// @ts-nocheck
import { parseDate } from './date.js'

// Helper function to convert snake_case to camelCase
export const toCamelCase = str => {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
}

// Helper function to convert object keys from snake_case to camelCase
export const convertToCamelCase = data => {
  if (Array.isArray(data)) {
    return data.map(item => {
      if (typeof item === 'object' && item !== null) {
        const camelCaseItem = {}
        Object.keys(item).forEach(key => {
          const camelKey = toCamelCase(key.toLowerCase())
          camelCaseItem[camelKey] = item[key] || ''
        })
        return camelCaseItem
      }
      return item
    })
  } else if (typeof data === 'object' && data !== null) {
    const camelCaseData = {}
    Object.keys(data).forEach(key => {
      const camelKey = toCamelCase(key.toLowerCase())
      camelCaseData[camelKey] = data[key] || ''
    })
    return camelCaseData
  }
  return data
}

// Helper function to sanitize records: transform keys to lowercase and replace falsy values with empty string
export const sanitizeRecord = data => {
  if (Array.isArray(data)) {
    return data.map(item => {
      if (typeof item === 'object' && item !== null) {
        const sanitizedItem = {}
        Object.keys(item).forEach(key => {
          sanitizedItem[key.toLowerCase()] = item[key] || ''
        })
        return sanitizedItem
      }
      return item
    })
  } else if (typeof data === 'object' && data !== null) {
    const sanitizedData = {}
    Object.keys(data).forEach(key => {
      sanitizedData[key.toLowerCase()] = data[key] || ''
    })
    return sanitizedData
  }
  return data
}

export const transformAccountData = (record, modifications) => {
  return {
    personalDetails: {
      clientId: record.clientId,
      clientDpCode: record.clientDpCode,
      clientName: record.clientDpName,
      fatherHusbandName: record.fatherHusbandName,
      panNo: record.panNo,
      birthDate: parseDate(record.birthDate),
      mobileNo: record.mobileNo,
      clientIdMail: record.clientIdMail,
      categoryDesc: record.categoryDesc,
      sex: record.sex,
      clResiAdd1: record.clResiAdd1,
      clResiAdd2: record.clResiAdd2,
      clResiAdd3: record.clResiAdd3,
      annualIncome: record.annualIncome,
      guardianName: record.guardianName,
      firstName: record.firstName,
      city: record.city,
      state: record.state,
      pinCode: record.pinCode
    },
    dpDetails: {
      depository: record.depository,
      clientDpCode: record.clientDpCode,
      clientName: record.clientDpName,
      companyCode: record.companyCodes,
      activateSegment: record.segments, // fallback if needed
      age: record.age
    },
    dob: parseDate(record.birthDate),
    nomineeDetails: {
      nomineeOptout: record.nomineeoptout,
      nomineeName: record.nomineeName
    },
    closeAccount: {
      clientId: record.clientId,
      clientDpCode: record.clientDpCode,
      clientName: record.clientDpName,
      panNo: record.panNo
    },
    modifications
  }
}

export const transformBankRecord = record => ({
  bankName: record.bank_name,
  bankAcno: record.bank_acno,
  ifscCodeAct: record.ifsc_code_act,
  micrCode: record.micr_code,
  bankAcctype: record.bank_acctype,
  defaultAc: record.default_ac,
  clientName: record.client_name,
  clientCode: record.account_code
})
