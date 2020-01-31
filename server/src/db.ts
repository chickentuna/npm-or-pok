import log from './webapp/log'
import sqlite from 'sqlite'
import SQL from 'sql-template-strings'

async function createDB () {
  try {
    const db = await sqlite.open('./database.sqlite')
    await db.run(`CREATE TABLE IF NOT EXISTS guess (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        name varchar(64) NOT NULL,
        category varchar(64) NOT NULL,
        correct boolean NOT NULL,
        ip string
    );`)

    await db.run(SQL`INSERT INTO guess (name, category, correct, ip)
    VALUES (${'pikachu'}, ${'pokemon'}, ${false}, ${'::1'})`)

  // await db.run('')
  // const res = await db.get('SELECT * FROM Post WHERE id = ?', req.params.id),
  //   db.all('SELECT * FROM Category')
  // ]);
  } catch (err) {
    console.log(err)// TODO: how do i log stack trace with logger?
  }
}

export { createDB }
