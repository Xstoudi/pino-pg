import {Client} from 'pg'
import {columns, database, host, password, port, table, user} from "../src/args"
import {expect} from "chai"
import {PgTransport} from "../src"

const idCol = 'id'

// function execute(pipedContent: string = '') {
//     const childProcess = spawn('./index.js')
//     childProcess.stdin.setDefaultEncoding('utf-8')
//     return new Promise((resolve: (out: string) => void, reject) => {
//             childProcess.stderr.once('data', err => {
//                 reject(new Error(err.toString()))
//             })
//             childProcess.on('error', (err: string) => {
//                 return reject(new Error(err))
//             })
//             childProcess.stdout.pipe(concat(buffer => resolve(buffer.toString())))
//             childProcess.stdin.write(`${pipedContent}\n`)
//             childProcess.stdin.end()
//         }
//     )
// }

const client = new Client({
    host,
    port,
    user,
    password,
    database
})

// const dbReset = async () => {
//     try {
//         await client.query(`TRUNCATE ${table};`)
//         console.log("Table cleanup successful")
//     } catch (e) {
//         console.warn(`Unable to cleanup ${table} table.`)
//     }
// }

describe('method transport', () => {

    const client = new Client({
        host,
        port,
        user,
        password,
        database
    })


    it('should store a simple log', async () => {

        await client.connect()

        const logEntry = {
            severity: 'INFO',
            category: 'DEV',
            message: 'test message',
            vars: '{}',
            notify: 'CLIENT'
        }
        const pgt = new PgTransport(table, columns, client)

        const chunk = Buffer.from(JSON.stringify(logEntry), "utf-8")
        // const cb = (d: any) => {
        //     console.log(d)
        // }
        // try {
        const rows = await pgt._transform(chunk)
        // } catch (e) {
        //     console.log(e)
        // }

        const result = await client.query(`SELECT *
                                           FROM ${table}
                                           ORDER BY ${idCol} DESC
                                           LIMIT 1`)
        // expect(result.rows[0]).to.deep.eq(logEntry)
        console.log(result, rows)
    })
})