// @ts-nocheck
import moment from 'moment'
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek.js";
import { HOLIDAYS } from '../config/index.js'

dayjs.extend(isoWeek);

export function getFormattedDate(date) {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-indexed
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

export function parseDate(date) {
  const formats = [
    'DD/MM/YYYY',
    'MMMM D, YYYY HH:mm:ss Z',
    'MMMM, D YYYY HH:mm:ss Z',
    'MMMM, DD YYYY HH:mm:ss Z',
    'YYYY-MM-DD',
    'DD-MM-YYYY'
  ]
  const parsedDate = moment(date, formats, true)

  return parsedDate.isValid() ? parsedDate.format('DD/MM/YYYY') : null
}

export function calculateAge(birthdate) {
  const dob = moment(birthdate, 'DD/MM/YYYY')
  return moment().diff(dob, 'years')
}

// Function to get financial year dates
export function getFinancialYearDates(startYear) {
  startYear = parseInt(startYear)
  const fromDate = new Date(startYear, 3, 1) // April 1 of the start year
  const currentDate = new Date() // today's date
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  let toDate

  // Check if we're in the same financial year range (April to March)
  if (currentYear === startYear && currentMonth >= 3) {
    // Between April and March of the same year range
    toDate = currentDate
  } else if (currentYear === startYear + 1 && currentMonth < 3) {
    // January to March of the next year still belongs to the previous financial year
    toDate = currentDate
  } else {
    // If it's beyond March of the next year, set to the end of the financial year
    toDate = new Date(startYear + 1, 2, 31) // March 31 of the next year
  }

  return {
    fromDate: fromDate.toLocaleDateString('en-GB'), // Format as DD/MM/YYYY
    toDate: toDate.toLocaleDateString('en-GB')
  }
}

export const getFinancialYear = () => {
  const today = new Date()
  const year = today.getFullYear()
  const isAfterMarch = today.getMonth() >= 3 // Months are 0-indexed (0 = January, 3 = April)

  const financialYear = isAfterMarch ? year : year - 1

  return financialYear
}

export function getCurrentMonth() {
  const now = new Date();
  return now.getMonth() + 1; // 1 = January, 12 = December
}

export function getISTDate() {
  const now = new Date()
  const istOffset = 5.5 * 60 * 60 * 1000 // IST offset in ms
  const istTime = new Date(now.getTime() + istOffset)
  return new Date(istTime.toISOString())
}

// Helper function to check if a date value is valid
export const isValidDate = date =>
  date !== undefined && date !== null && date !== 0 && date !== ''

export const getTodayRemainingTime = () => {
  const currentDate = new Date()

  const expiry = new Date(currentDate)
  expiry.setDate(expiry.getDate() + 1)
  expiry.setHours(0, 0, 0, 0)
  const ttlSeconds = Math.floor(
    (expiry.getTime() - currentDate.getTime()) / 1000
  )

  return ttlSeconds
}

export function parseDateToString(date) {
  const formats = [
    'DD/MM/YYYY',
    'MMMM D, YYYY HH:mm:ss Z',
    'MMMM, D YYYY HH:mm:ss Z',
    'MMMM, DD YYYY HH:mm:ss Z',
    'YYYY-MM-DD',
    'DD-MM-YYYY',
    'YYYY-MM-DD HH:mm:ss'
  ]

  for (const format of formats) {
    const parsedDate = moment(date, format, true)
    if (parsedDate.isValid()) {
      return parsedDate.format('YYYYMMDD')
    }
  }

  return null
}

export function adjustToDate(toDate) {
  if (!toDate) return toDate;

  let date = dayjs(toDate, "DD/MM/YYYY");

  // Step back one day initially
  date = date.subtract(1, "day");

  // Keep stepping back if weekend or holiday
  while (
    date.isoWeekday() > 5 || // 6=Sat, 7=Sun
    HOLIDAYS.includes(date.format("DD/MM/YYYY"))
  ) {
    date = date.subtract(1, "day");
  }

  return date.format("DD/MM/YYYY");
}

export function parseDDMMYYYY(dateString) {
  const [day, month, year] = dateString.split('/');
  // JavaScript Date constructor uses MM/DD/YYYY, so we rearrange
  return new Date(year, month - 1, day); // month is 0-indexed
}
