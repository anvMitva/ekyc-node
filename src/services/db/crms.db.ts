// @ts-nocheck
import { crmsSequelize } from "../../utils/dbConnection.js";
import logger from "../../logger/winston.logger.js";

/**
 * CRMS Database Service Class
 * Handles all CRMS database operations
 */
class CrmsDB {
  /**
   * Get client details by mobile number and/or email
   * Executes stored procedure: [dbo].[GetClientByMobileEmail]
   * @param {string} mobileNo - Mobile number to search
   * @param {string} emailId - Email ID to search
   * @returns {Promise<Object>} Object containing mobileMatches, emailMatches, and bothMatches
   */
  async getClientByMobileEmail(mobileNo = null, emailId = null) {
    try {
      // Execute stored procedure
      const result = await crmsSequelize.query(
        `EXEC [dbo].[GetClientByMobileEmail] @MobileNo = :mobileNo, @EmailId = :emailId`,
        {
          replacements: {
            mobileNo: mobileNo || null,
            emailId: emailId || null,
          },
          type: crmsSequelize.QueryTypes.SELECT,
        }
      );

      // Convert keys to lowercase and categorize results
      const normalizedResults = result.map((row) =>
        this._convertKeysToLowerCase(row)
      );

      // Categorize results by match type
      const categorizedData = this._categorizeByMatchType(normalizedResults);
      return categorizedData;
    } catch (error) {
      logger.error("Error executing GetClientByMobileEmail", {
        error: error.message,
        stack: error.stack,
      });

      return {
        mobileMatches: [],
        emailMatches: [],
      };
    }
  }

  /**
   * Convert all object keys to lowercase
   * @param {Object} obj - Object with keys to convert
   * @returns {Object} Object with lowercase keys
   * @private
   */
  _convertKeysToLowerCase(obj) {
    if (!obj || typeof obj !== "object") return obj;

    return Object.keys(obj).reduce((acc, key) => {
      acc[key.toLowerCase()] = obj[key];
      return acc;
    }, {});
  }

  /**
   * Categorize results by match type
   * @param {Array} results - Array of result objects
   * @returns {Object} Categorized results
   * @private
   */
  _categorizeByMatchType(results) {
    const mobileMatches = [];
    const emailMatches = [];

    results.forEach((record) => {
      const matchType = (record.matchtype || "").toLowerCase().trim();

      switch (matchType) {
        case "mobile match":
          mobileMatches.push(record);
          break;
        case "email match":
          emailMatches.push(record);
          break;
        case "both match":
          mobileMatches.push(record);
          emailMatches.push(record);
          break;
        default:
          logger.warn("Unknown match type encountered", {
            matchType: record.matchtype,
            record,
          });
          break;
      }
    });

    return {
      mobileMatches,
      emailMatches,
    };
  }

  /**
   * Get clients by mobile number only
   * @param {string} mobileNo - Mobile number to search
   * @returns {Promise<Object>} Result object
   */
  async getClientByMobile(mobileNo) {
    if (!mobileNo) {
      return {
        success: false,
        error: "Mobile number is required",
        data: { mobileMatches: [], emailMatches: [] },
        totalRecords: 0,
      };
    }

    return await this.getClientByMobileEmail(mobileNo, null);
  }

  /**
   * Get clients by email only
   * @param {string} emailId - Email ID to search
   * @returns {Promise<Object>} Result object
   */
  async getClientByEmail(emailId) {
    if (!emailId) {
      return {
        success: false,
        error: "Email ID is required",
        data: { mobileMatches: [], emailMatches: [] },
        totalRecords: 0,
      };
    }

    return await this.getClientByMobileEmail(null, emailId);
  }
}

// Export singleton instance
export default new CrmsDB();

// Export class for testing or multiple instances
export { CrmsDB };
