import 'dotenv/config'

if (!(process.env.DB_HOST &&
    process.env.DB_PORT &&
    process.env.BD_USER &&
    process.env.BD_PASSWORD)) {
    console.error("No suitable .env file data found")
    process.exit(0)
}

/*
* TEMPLATES
*/
const DEFAULT_CLIENT_TEMPLATE = "CLIENT_ERROR_TEMPLATE"
const DEFAULT_ADMIN_TEMPLATE = "ADMIN_ERROR_TEMPLATE"

/*
* DATABASE
 */
const DEFAULT_HOST = "localhost"
const DEFAULT_PORT = 5432
const DEFAULT_USER = "log_frog"
const DEFAULT_PASSWORD = "devPassword_123"
const DEFAULT_DB_NAME = "logs"
const DEFAULT_LOG_TABLE = "log"
const DEFAULT_DB_COLUMNS = [
    'severity',
    'category',
    'message',
    'vars',
    'notify'
]

/*
* EXTRAS
*/

export const encoding = 'utf-8'

export const host = process.env.DB_HOST || DEFAULT_HOST
export const port = process.env.DB_PORT && parseInt(process.env.DB_PORT) || DEFAULT_PORT
export const user = process.env.DB_USER || DEFAULT_USER
export const password = process.env.DB_PASSWORD || DEFAULT_PASSWORD
export const database = process.env.DB_NAME || DEFAULT_DB_NAME

export const connUrl = `postgres://${user}:${password}@${host}:${port}/${database}`
export const table = process.env.DB_LOG_TABLE || DEFAULT_LOG_TABLE
export const columns = process.env.DB_COLUMNS && JSON.parse(process.env.DB_COLUMNS) || DEFAULT_DB_COLUMNS

export const params = '$1' + [...Array(columns.length).keys()].join(', $')