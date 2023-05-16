/*
* TEMPLATES
*/
export const DEFAULT_CLIENT_TEMPLATE = "CLIENT_ERROR_TEMPLATE"
export const DEFAULT_ADMIN_TEMPLATE = "ADMIN_ERROR_TEMPLATE"
export const DEFAULT_HOST = "localhost"
export const DEFAULT_PORT = 5432
export const DEFAULT_USER = "log_frog"
export const DEFAULT_PASSWORD = "devPassword_123"
export const DEFAULT_DB_NAME = "logs"
export const DEFAULT_LOG_TABLE = "log"
export const DEFAULT_DB_COLUMNS = [
    'severity',
    'category',
    'message',
    'vars',
    'notify'
]