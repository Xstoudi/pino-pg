#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { Client, ClientConfig } from 'pg'
import pump from 'pump'
import split from 'split2'
import through from 'through2'

interface CmdArgs {
  config?: string;
}

interface ICallback {
  (error: string | null, ...args: any): void
}

interface PinoPgConfig {
  connection: ClientConfig,
  table: string,
  columns: {
    [key: string]: string
  }
}

function loadArgs() {
  const args: CmdArgs = {
    config: undefined
  }
  for(let i = 1; i < process.argv.length; i++) {
    const arg = process.argv[i]
    if(arg == '-c' || arg == '--config') {
      i++
      args.config = process.argv[i]
    }
  }
  return args
}

function loadConfig(args: CmdArgs, callback: ICallback) {
  if(args.config === undefined) return callback('Missing database configuration')
  fs.readFile(`${path.join(process.cwd(), args.config)}`, { encoding: 'utf8' }, (readFileErr, data) => {
    if(readFileErr !== null) {
      console.error(readFileErr)
      return callback('Fail to read the configuration file.')
    }

    try {
      const config = JSON.parse(data)
      callback(null, config)
    } catch(parseErr) {
      console.error(parseErr)
      callback('Fail to parse configuration file.')
    }
  })
}

function buildInsertString(config: PinoPgConfig) {
  const values = Object.values(config.columns)

  return `INSERT INTO ${config.table}(${values.reduce((previous, current, index) => (index === 0 ? `${current}` : `${previous}, ${current}`), '')})
    VALUES(${values.reduce((previous, current, index) => (index === 0 ? `$${index+1}` : `${previous}, $${index+1}`), '')})`
}

function transporter(errConfig: string | null, config: PinoPgConfig) {
  if(errConfig !== null) return console.error(errConfig)
  
  const pgTransport = through.obj((chunk, encoding, callback) => {
    console.log(chunk)
    const client = new Client(config.connection)
    client.connect((connectErr) => {
      if(connectErr !== null) {
        console.error(connectErr)
        return callback('Failed to connect to PostgreSQL server.')
      }
      
      client.query(buildInsertString(config), Object.values(JSON.parse(chunk)), (queryErr, result) => {
        if(queryErr !== null) {
          console.error(queryErr)
          return callback('Query failed.')
        }
      })
    })
    callback(null, chunk)
  })
  
  pump(process.stdin, split(), pgTransport) 
}

function main() {
  const args = loadArgs()

  loadConfig(args, transporter)
}

main()