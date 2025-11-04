// @ts-nocheck
import { connectRedis, crmsSequelize, ekycSequelize, } from '../utils/dbConnection.js'

const connectDB = async () => {
  try {
    await ekycSequelize.authenticate()
    console.log('💽 CONNECT DB Connection has been established successfully.')
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error)
  }

  try {
    await crmsSequelize.authenticate()
    console.log('💽 CRMS DB Connection has been established successfully.')
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error)
  }

  try {
    await connectRedis()
    console.log('💽 Connected to all Redis clients successfully.')
  } catch (error) {
    console.error('❌ Error during redis database connection:', error)
  }
}

export default connectDB
