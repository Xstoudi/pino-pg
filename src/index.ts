import { Client } from 'pg'
import split from 'split2'
import { pipeline } from 'stream'

import args from './args'

function transporter(table: string, column: string, client: Client) {
  return async function* (source: AsyncIterable<string>) {
    for await (const line of source) {
      await client.query(`INSERT INTO ${table}(${column}) VALUES($1)`, [JSON.parse(line)])
      yield line
    }
  }
}

function main() {
  const client = new Client({ connectionString: args.connectionUrl})
  client.connect((connectErr) => {
    if(connectErr !== null) {
      return console.error('Failed to connect to PostgreSQL server.', connectErr)
    }
    pipeline(process.stdin, split(), transporter(args.table, args.column, client) as any, process.stdout, () => {
      client.end()
    })
  })
}

export { main, transporter };