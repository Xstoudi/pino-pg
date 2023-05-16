import {Client} from 'pg'
import split from 'split2'
import {pipeline, Transform, TransformCallback} from 'stream'

import {columns, connUrl, encoding, params, table} from './config'

export class PgTransport extends Transform {
    private client: any
    private readonly table: string
    private readonly columns: string

    constructor(table: string, columns: string[], client: Client) {
        super()
        this.table = table
        this.columns = columns.join(', ')
        this.client = client

        process.on('SIGINT', () => this._shutdown())
        process.on('SIGTERM', () => this._shutdown())
    }

    _shutdown() {
        process.exit(0)
    }

    _transform(chunk: Buffer, encode: string, callback: TransformCallback) {
        const content = chunk.toString(encoding)

        let log: any
        try {
            const logData = JSON.parse(content)
            log = Object.values(logData)
        } catch {
            //pass it through non-json.
            return callback(null, `${chunk}\n`)
        }
        const query = `INSERT INTO ${this.table} (${this.columns})
                       VALUES (${params});`
        this.client.query(
            query,
            log,
            (err: Error) => {
                callback(err, null)
            })
    }
}

function transporter(table: string, columns: string[], client: Client) {
    const pgTransport = new PgTransport(table, columns, client)
    pgTransport.on('end', () => {
        client.end().catch(e => {
            console.warn('Unable to close stream.', e)
        })
    })
    return pgTransport
}

// noinspection JSUnusedGlobalSymbols
function main() {
    const client = new Client({connectionString: connUrl})
    client.connect((connectErr) => {
        if (connectErr !== null) {
            return console.error('Failed to connect to Postgres server.', connectErr)
        }
        pipeline(process.stdin, split(), transporter(table, columns, client) as any, process.stdout,
            err => {
                if (err != null) {
                    console.error(err)
                }
            })
    })
}

export {main, transporter}