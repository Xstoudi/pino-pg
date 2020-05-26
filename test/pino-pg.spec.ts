import { serial as test } from 'ava'
import { spawn } from 'child_process'
import concat from 'concat-stream'
import { EOL } from 'os'
import { Client } from 'pg'

const CORRECT_PARAMS = [
  '--connectionUrl',
  'postgresql://postgres:root@localhost/test-database',
  '--table',
  'logs',
  '--column',
  'content'
]

function createProcess(processPath: string, args: string[] = [], env: any = {}) {
  args = [processPath].concat(args);

  return spawn('node', args, {
    env: {
      ...env,
      NODE_END: 'test',
      PATH: process.env.PATH
    }
  })
}

function execute(args: string[] = [], opts: any = {}, pipedContent: string = '') {
  const { env = null } = opts
  const childProcess = createProcess('index.js', args, env)
  childProcess.stdin.setDefaultEncoding('utf-8')
  return new Promise((resolve: (out: string) => void, reject) => {
    childProcess.stderr.once('data', err => reject(new Error(err.toString())))
    childProcess.on('error', (err: string) => reject(new Error(err)))
    childProcess.stdout.pipe(concat(buffer => resolve(buffer.toString())))
    childProcess.stdin.write(`${pipedContent}\r\n`)
    childProcess.stdin.end()
  })
}

const client = new Client({
  connectionString: 'postgresql://postgres:root@localhost:5432/test-database'
})

test.before('create database connection', async () => {
  await client.connect()
  await client.query(`
    CREATE TABLE public.logs
    (
        id serial PRIMARY KEY NOT NULL,
        content jsonb NOT NULL
    )
  `)
})

test.beforeEach('remove content', async () => {
  await client.query('DELETE FROM logs')
})

test('should show help when --help', async assert => {
  const response: string = await execute(['--help'])
  assert.is(response.trim().split(EOL).shift()?.trim(), 'pino-pg [options]')
})

test('should show version when --version', async assert => {
  const response: string = await execute(['--version'])
  assert.is(response.trim(), require('../../package.json').version)
})

test('should store a simple log', async assert => {
  const logEntry = { foo: true }
  await execute(CORRECT_PARAMS, {}, JSON.stringify(logEntry))
  const result = await client.query(`SELECT content -> 'foo' AS foo FROM logs ORDER BY id DESC LIMIT 1`)
  assert.deepEqual(result.rows[0], logEntry)
})

test('should store a deep log', async assert => {
  const logEntry = { foo: { bar: true } }
  await execute(CORRECT_PARAMS, {}, JSON.stringify(logEntry))

  const result = await client.query(`SELECT content -> 'foo' AS foo FROM logs ORDER BY id DESC LIMIT 1`)
  assert.deepEqual(result.rows[0], logEntry)
})

test('db connection fail', async assert => {
  const params = [...CORRECT_PARAMS]
  params[3] = 'log'

  await assert.throwsAsync(execute(params, {}, '{}'))
})

test('config in env var', async assert => {
  const logEntry = { foo: true }
  await execute([], {
    env: {
      PINO_PG_CONNECTION_URL: CORRECT_PARAMS[1],
      PINO_PG_TABLE: CORRECT_PARAMS[3],
      PINO_PG_COLUMN: CORRECT_PARAMS[5]
    }
  }, JSON.stringify(logEntry))
  
  const result = await client.query(`SELECT content -> 'foo' AS foo FROM logs ORDER BY id DESC LIMIT 1`)
  assert.deepEqual(result.rows[0], logEntry)
})

test.after('end database connection', () => client.end())