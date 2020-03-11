import yargs from 'yargs'

export default yargs
  .usage('pino-pg [options]')
  .env('PINO_PG')
  .option('connectionUrl', {
    type: 'string',
    alias: 'u',
    requiresArg: true,
    description: 'Connection string to PG server.'
  })
  .option('table', {
    type: 'string',
    alias: 't',
    requiresArg: true,
    description: 'Log table.',
    default: 'logs'
  })
  .option('column', {
    type: 'string',
    alias: 'c',
    requiresArg: true,
    description: 'JSONB column where to store the log entry.',
    default: 'content'
  })
  .parse()