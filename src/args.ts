import 'dotenv/config'
import {
    DEFAULT_DB_COLUMNS, DEFAULT_DB_NAME,
    DEFAULT_HOST,
    DEFAULT_LOG_TABLE,
    DEFAULT_PASSWORD,
    DEFAULT_PORT,
    DEFAULT_USER
} from "./config"

if (!process.env.DB_HOST) {
    console.error("No suitable .env file data found")
    process.exit(0)
}

export const host = process.env.DB_HOST || DEFAULT_HOST
export const port = process.env.DB_PORT && parseInt(process.env.DB_PORT) || DEFAULT_PORT
export const user = process.env.DB_USER || DEFAULT_USER
export const password = process.env.DB_PASSWORD || DEFAULT_PASSWORD
export const database = process.env.DB_NAME || DEFAULT_DB_NAME

export const connUrl = `postgres://${user}:${password}@${host}:${port}/${database}`
export const table = process.env.DB_LOG_TABLE || DEFAULT_LOG_TABLE
export const columns = process.env.DB_COLUMNS && JSON.parse(process.env.DB_COLUMNS) || DEFAULT_DB_COLUMNS