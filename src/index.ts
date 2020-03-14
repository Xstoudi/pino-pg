#!/usr/bin/env node
import { Client } from 'pg'
import pump from 'pump'
import split from 'split2'
import through from 'through2'

import args from './args'

interface PinoPgConfig {
  connectionUrl: string
  table: string
  column: string
}

function transporter(config: PinoPgConfig) {
  return through.obj((chunk, encoding, callback) => {
    const client = new Client({ connectionString: config.connectionUrl})
    client.connect((connectErr) => {
      if(connectErr !== null) {
        console.error('Failed to connect to PostgreSQL server.', connectErr)
        return callback('Failed to connect to PostgreSQL server.')
      }
      
      client.query(`INSERT INTO ${config.table}(${config.column}) VALUES($1)`, [JSON.parse(chunk)], (queryErr, result) => {
        if(queryErr !== null) {
          console.error('Query failed.', queryErr)
          return callback('Query failed.')
        }
        client.end(endErr => {
          if(endErr !== undefined) {
            console.error('Fail to close PG connection.', endErr)
            return callback('Fail to close PG connection.')
          }
          callback(null, chunk)
        })
      })
    })
  })
}

function main() {
  pump(process.stdin, split(), transporter(args as PinoPgConfig), process.stdout) 
}

export { main, transporter };