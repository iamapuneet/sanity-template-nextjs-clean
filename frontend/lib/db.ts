import mysql from 'mysql2/promise'

const globalForDb = globalThis as unknown as {
  dbPool: mysql.Pool | undefined
}

export const db =
  globalForDb.dbPool ??
  mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '12345',
    database: process.env.DB_NAME || 'examforge',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    decimalNumbers: true,
  })

if (process.env.NODE_ENV !== 'production') {
  globalForDb.dbPool = db
}

export default db

