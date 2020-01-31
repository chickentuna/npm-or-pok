import log from './webapp/log'
import sqlite from 'sqlite'
import SQL from 'sql-template-strings'

async function run (query) {
  try {
    const db = await sqlite.open('./database.sqlite')
    await db.run(query)
    await db.close()
  } catch (err) {
    log.error(err.message)
  }
}

async function createDB () {
  await run(`CREATE TABLE IF NOT EXISTS guess (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        name varchar(64) NOT NULL,
        category varchar(64) NOT NULL,
        correct boolean NOT NULL,
        ip string NOT NULL,
        time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );`)
}

async function saveGuess (name, category, correct, address) {
  await run(SQL`INSERT INTO guess (name, category, correct, ip)
    VALUES (${name}, ${category}, ${correct}, ${address})`)
}

export { createDB, saveGuess }
