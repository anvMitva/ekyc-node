// @ts-nocheck
import { createClient } from 'redis'
import { Sequelize } from 'sequelize'
import { DB_CONFIG, REDIS_CONFIG } from '../config/index.js'

const ekycSequelize = new Sequelize(
  DB_CONFIG.EKYC.NAME,
  DB_CONFIG.EKYC.USERNAME,
  DB_CONFIG.EKYC.PASSWORD,
  {
    host: DB_CONFIG.EKYC.HOST,
    dialect: 'mssql',
    logging: false
  }
)

const crmsSequelize = new Sequelize(
  DB_CONFIG.CRMS.NAME,
  DB_CONFIG.CRMS.USERNAME,
  DB_CONFIG.CRMS.PASSWORD,
  {
    host: DB_CONFIG.CRMS.HOST,
    dialect: 'mssql',
    dialectOptions: {
      options: {
        requestTimeout: 300000, // 5 minutes
        enableArithAbort: true, // Avoids deadlocks
        encrypt: false, // Set to true if using SSL
      },
    },
    pool: {
      max: 20, // Max number of connections in the pool
      min: 5, // Minimum connections
      acquire: 30000, // Max time (ms) to acquire a connection
      idle: 10000, // Time (ms) a connection can be idle before being released
    },
    retry: {
      max: 3, // Number of retries for a failed query
    },
    logging: false, // Set to console.log for debugging
  }
)

// Default values for Redis if environment variables are not set
const redisHost = REDIS_CONFIG.HOST || '127.0.0.1'
const redisPort = REDIS_CONFIG.PORT || 6379
const redisPassword = REDIS_CONFIG.PASSWORD || ''

const redisAliases = {
  connect: {
    // Use a conditional URL format based on whether password is provided
    url: redisPassword
      ? `redis://:${redisPassword}@${redisHost}:${redisPort}/0` // With password
      : `redis://${redisHost}:${redisPort}/0` // Without password
  }
}

const config = redisAliases['connect']
const client = createClient(config)

client.on('error', err => console.error('Redis error:', err))
client.on('connect', () => console.log('Connected to Redis'))

export const connectRedis = async () => {
  try {
    await client.connect()
    console.log('Main Redis client connected successfully')
  } catch (error) {
    console.error('Error connecting main Redis client:', error)
  }
}

export { ekycSequelize, client as redisClient, redisAliases, crmsSequelize }
