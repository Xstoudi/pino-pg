# pino-pg
A Pino Transport for PostgreSQL databases.

## Installation
```
npm install pino-pg
```

## Usage
Write logs into PostgreSQL
```
node my-app.js | pino-pg --connectionUrl <your connection string> --table <your logs table> --column <your column table>
```

## Options
The `connectionUrl` (or `c`) must contain the [postgres url string](https://node-postgres.com/features/connecting#Connection%20URI).
The `table` (or `t`) must contain the table name. Default to `logs`.
The `column` (or `c`) must contain the name of the JSONB column where you want to store log entries.

## License
Licensed under [MIT](https://github.com/Xstoudi/pino-pg/blob/master/LICENSE.md)
