import { Client } from 'pg'
import split from 'split2'
import { pipeline, TransformCallback, Transform } from 'stream'

import args from './args'

class PgTransport extends Transform {
  private client: Client;
  private table: string;
  private column: string;

  constructor(table: string, column: string, client: Client) {
    super()
    this.table = table
    this.column = column
    this.client = client
  }

  _transform(chunk: any, encoding: string, callback: TransformCallback) {
    const content = chunk.toString('utf-8')
    this.client.query(`INSERT INTO ${this.table}(${this.column}) VALUES($1)`, [JSON.parse(content)])
      .then(
        () => {
          callback(null, chunk)
        },
        err => callback(err, null)
      )
  }
}

function transporter(table: string, column: string, client: Client) {
  const pgTransport = new PgTransport(table, column, client)
  pgTransport.on('end', () => {
    client.end()
  })
  return pgTransport

  /*return async function* (source: AsyncIterable<string>) {
    for await (const line of source) {
      await client.query(`INSERT INTO ${table}(${column}) VALUES($1)`, [JSON.parse(line)])
      yield line
    }
  }*/
  
}

function main() {
  const client = new Client({ connectionString: args.connectionUrl})
  client.connect((connectErr) => {
    if(connectErr !== null) {
      return console.error('Failed to connect to PostgreSQL server.', connectErr)
    }

    pipeline(process.stdin, split(), transporter(args.table, args.column, client) as any, process.stdout, err => {
      if(err != null){
        console.error(err)
      }
    })
  })
}

export { main, transporter };