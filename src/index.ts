import { Client } from 'pg'
import split from 'split2'
import { pipeline } from 'stream'

import args from './args'

function transporter(table: string, column: string, client: Client) {
  return async function* (source: AsyncIterable<string>) {
    const prepared: string[] = []
    const values: any[] = []
    for await (const line of source) {
      prepared.push(`($${prepared.length + 1})`)
      values.push(JSON.parse(line))
      yield line
    }
    
    await client.query(`INSERT INTO ${table}(${column}) VALUES${prepared.join(',')}`, values)
  }
}

function main() {
  const client = new Client({ connectionString: args.connectionUrl})
  client.connect((connectErr) => {
    if(connectErr !== null) {
      return console.error('Failed to connect to PostgreSQL server.', connectErr)
    }
    pipeline(process.stdin, split(), transporter(args.table, args.column, client) as any, process.stdout, err => {
      if(err !== null){
        console.error(err)
      }
      client.end()
    })
  })
}

export { main, transporter };