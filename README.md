# pino-pg
A Pino Transport for PostgreSQL databases.

## Installation
```
npm install pino-pg
```

## Usage
Write logs into PostgreSQL
```
node my-app.js | pino-pg -c configuration.json
```

## Configuration file
The configuration file is a JSON file like this :
```json
{
    "connection": {
        "user": "postgres",
        "database": "test-database",
        "password": "",
        "port": "",
        "host": "127.0.0.1"
    },
    "table": "logs",
    "columns": {
        "level": "level",
        "time": "time",
        "pid": "pid",
        "hostname": "hostname",
        "msg": "msg",
        "v": "v"
    }
}
```
The `connection` field contains the [node-pg connection information](https://node-postgres.com/features/connecting#Programmatic).
The `table` field is the table where you want to store logs.
The `columns` field allows you to custom PostgreSQL column name for each pino field. Key is pino field, value is column name.

## License
Licensed under [MIT](https://github.com/Xstoudi/pino-pg/blob/master/LICENSE.md)
