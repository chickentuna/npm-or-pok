import log from './webapp/log'
import sqlite from 'sqlite'
import SQL from 'sql-template-strings'
import { Category } from './types'

async function run (query) {
  try {
    const db = await sqlite.open('./database.sqlite')
    await db.run(query)
    await db.close()
  } catch (err) {
    log.error(err.message)
  }
}

async function get (query) {
  try {
    const db = await sqlite.open('./database.sqlite')
    const result = await db.all(query)
    await db.close()
    return result
  } catch (err) {
    log.error(err.message)
  }
}

async function createDB () {
  await run(`CREATE TABLE IF NOT EXISTS guess (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        name varchar(64) NOT NULL,
        category varchar(64) NOT NULL,
        selected varchar(64) NOT NULL,
        ip string NOT NULL,
        time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );`)
  await run(`CREATE TABLE IF NOT EXISTS marathon (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      name varchar(64) NOT NULL,
      score INTEGER NOT NULL,
      ip string NOT NULL,
      time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
  );`)
}

async function saveGuess (name:string, category:Category, selected:string, address:string) {
  await run(SQL`INSERT INTO guess (name, category, selected, ip)
    VALUES (${name}, ${category}, ${selected}, ${address})`)
}

async function saveMarathonResult (name:string, score:number, address:string) {
  await run(SQL`INSERT INTO marathon (name, score, ip)
    VALUES (${name}, ${score}, ${address})`)
}

async function getLeaderboard () {
  const result = await get(SQL`SELECT name, score FROM marathon ORDER BY score DESC, time`)
  result.forEach((value, index) => {
    value.rank = index + 1
  })
  return result
}

export { createDB, saveGuess, saveMarathonResult, getLeaderboard }
