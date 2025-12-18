// @ts-nocheck
import { OTPLog, OTP, Leads } from "../../models/index.js";
import { Op } from "sequelize";

/**
 * Database operations for OTPLog model
 * Handles CRUD operations and relationship management
 */
class OtpLogDB {
  /**
   * Create a new OTP log entry
   * @param {Object} logData - OTP log data
   * @param {Object} transaction - Sequelize transaction (optional)
   * @returns {Promise<Object>} Created OTP log
   */
  async create(logData, transaction = null) {
    try {
      const options = transaction ? { transaction } : {};
      const log = await OTPLog.create(logData, options);
      return log;
    } catch (error) {
      throw new Error(`Error creating OTP log: ${error.message}`);
    }
  }

  /**
   * Create multiple OTP log entries
   * @param {Array} logsData - Array of OTP log data
   * @returns {Promise<Array>} Created OTP logs
   */
  async bulkCreate(logsData) {
    try {
      const logs = await OTPLog.bulkCreate(logsData);
      return logs;
    } catch (error) {
      throw new Error(`Error bulk creating OTP logs: ${error.message}`);
    }
  }

  /**
   * Find OTP log by ID
   * @param {number} id - OTP log ID
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} OTP log or null
   */
  async findById(id, options = {}) {
    try {
      const { includeRelations = false } = options;
      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await OTPLog.findByPk(id, { include });
    } catch (error) {
      throw new Error(`Error finding OTP log by ID: ${error.message}`);
    }
  }

  /**
   * Find OTP logs by OTP ID
   * @param {number} otpId - OTP ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of OTP logs
   */
  async findByOtpId(otpId, options = {}) {
    try {
      const {
        includeRelations = false,
        limit = 100,
        offset = 0,
      } = options;

      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await OTPLog.findAll({
        where: { otpId },
        include,
        limit,
        offset,
        order: [["created_at", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error finding OTP logs by OTP ID: ${error.message}`);
    }
  }

  /**
   * Find OTP logs by UID
   * @param {string} uid - User UID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of OTP logs
   */
  async findByUid(uid, options = {}) {
    try {
      const {
        includeRelations = false,
        limit = 100,
        offset = 0,
      } = options;

      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await OTPLog.findAll({
        where: { uid },
        include,
        limit,
        offset,
        order: [["created_at", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error finding OTP logs by UID: ${error.message}`);
    }
  }

  /**
   * Find OTP logs by mobile
   * @param {string} mobile - Mobile number
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of OTP logs
   */
  async findByMobile(mobile, options = {}) {
    try {
      const {
        includeRelations = false,
        limit = 100,
        offset = 0,
      } = options;

      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await OTPLog.findAll({
        where: { mobile },
        include,
        limit,
        offset,
        order: [["created_at", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error finding OTP logs by mobile: ${error.message}`);
    }
  }

  /**
   * Find OTP logs by email
   * @param {string} email - Email address
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of OTP logs
   */
  async findByEmail(email, options = {}) {
    try {
      const {
        includeRelations = false,
        limit = 100,
        offset = 0,
      } = options;

      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await OTPLog.findAll({
        where: { email },
        include,
        limit,
        offset,
        order: [["created_at", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error finding OTP logs by email: ${error.message}`);
    }
  }

  /**
   * Find OTP logs by status
   * @param {string} status - OTP status (mobile or email)
   * @param {string} type - Type of status (mobile_otp_status or email_otp_status)
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of OTP logs
   */
  async findByStatus(status, type = "mobile", options = {}) {
    try {
      const {
        includeRelations = false,
        limit = 100,
        offset = 0,
      } = options;

      const include = includeRelations ? this._getRelationIncludes() : [];
      const statusField = type === "mobile" ? "mobileOtpStatus" : "emailOtpStatus";
      
      return await OTPLog.findAll({
        where: { [statusField]: status },
        include,
        limit,
        offset,
        order: [["created_at", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error finding OTP logs by status: ${error.message}`);
    }
  }

  /**
   * Find OTP logs by action
   * @param {string} action - OTP action
   * @param {string} type - Type of action (mobile or email)
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of OTP logs
   */
  async findByAction(action, type = "mobile", options = {}) {
    try {
      const {
        includeRelations = false,
        limit = 100,
        offset = 0,
      } = options;

      const include = includeRelations ? this._getRelationIncludes() : [];
      const actionField = type === "mobile" ? "mobileOtpAction" : "emailOtpAction";
      
      return await OTPLog.findAll({
        where: { [actionField]: action },
        include,
        limit,
        offset,
        order: [["created_at", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error finding OTP logs by action: ${error.message}`);
    }
  }

  /**
   * Find all OTP logs with filters
   * @param {Object} filters - Query filters
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of OTP logs
   */
  async findAll(filters = {}, options = {}) {
    try {
      const {
        includeRelations = false,
        limit = 100,
        offset = 0,
        order = [["created_at", "DESC"]],
      } = options;

      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await OTPLog.findAll({
        where: filters,
        include,
        limit,
        offset,
        order,
      });
    } catch (error) {
      throw new Error(`Error finding OTP logs: ${error.message}`);
    }
  }

  /**
   * Find and count all OTP logs with filters
   * @param {Object} filters - Query filters
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Object with rows and count
   */
  async findAndCountAll(filters = {}, options = {}) {
    try {
      const {
        includeRelations = false,
        limit = 100,
        offset = 0,
        order = [["created_at", "DESC"]],
      } = options;

      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await OTPLog.findAndCountAll({
        where: filters,
        include,
        limit,
        offset,
        order,
      });
    } catch (error) {
      throw new Error(`Error finding and counting OTP logs: ${error.message}`);
    }
  }

  /**
   * Find OTP logs by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of OTP logs
   */
  async findByDateRange(startDate, endDate, options = {}) {
    try {
      const {
        includeRelations = false,
        limit = 100,
        offset = 0,
      } = options;

      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await OTPLog.findAll({
        where: {
          created_at: {
            [Op.between]: [startDate, endDate],
          },
        },
        include,
        limit,
        offset,
        order: [["created_at", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error finding OTP logs by date range: ${error.message}`);
    }
  }

  /**
   * Get latest log for OTP
   * @param {number} otpId - OTP ID
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} Latest OTP log or null
   */
  async getLatestByOtpId(otpId, options = {}) {
    try {
      const { includeRelations = false } = options;
      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await OTPLog.findOne({
        where: { otpId },
        include,
        order: [["created_at", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error getting latest OTP log: ${error.message}`);
    }
  }

  /**
   * Get logs with OTP details
   * @param {number} otpId - OTP ID
   * @returns {Promise<Array>} Array of logs with OTP
   */
  async getLogsWithOtp(otpId) {
    try {
      return await OTPLog.findAll({
        where: { otpId },
        include: [
          {
            model: OTP,
            as: "otp",
          },
        ],
        order: [["created_at", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error getting logs with OTP: ${error.message}`);
    }
  }

  /**
   * Get logs with lead details
   * @param {string} uid - User UID
   * @returns {Promise<Array>} Array of logs with lead
   */
  async getLogsWithLead(uid) {
    try {
      return await OTPLog.findAll({
        where: { uid },
        include: [
          {
            model: Leads,
            as: "lead",
          },
        ],
        order: [["created_at", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error getting logs with lead: ${error.message}`);
    }
  }

  /**
   * Count OTP logs by filters
   * @param {Object} filters - Query filters
   * @returns {Promise<number>} Count of OTP logs
   */
  async count(filters = {}) {
    try {
      return await OTPLog.count({ where: filters });
    } catch (error) {
      throw new Error(`Error counting OTP logs: ${error.message}`);
    }
  }

  /**
   * Count logs by OTP ID
   * @param {number} otpId - OTP ID
   * @returns {Promise<number>} Count of logs
   */
  async countByOtpId(otpId) {
    try {
      return await OTPLog.count({ where: { otpId } });
    } catch (error) {
      throw new Error(`Error counting logs by OTP ID: ${error.message}`);
    }
  }

  /**
   * Count logs by UID
   * @param {string} uid - User UID
   * @returns {Promise<number>} Count of logs
   */
  async countByUid(uid) {
    try {
      return await OTPLog.count({ where: { uid } });
    } catch (error) {
      throw new Error(`Error counting logs by UID: ${error.message}`);
    }
  }

  /**
   * Delete OTP log
   * @param {number} id - OTP log ID
   * @returns {Promise<boolean>} True if deleted
   */
  async delete(id) {
    try {
      const log = await OTPLog.findByPk(id);
      if (!log) {
        throw new Error("OTP log not found");
      }
      
      await log.destroy();
      return true;
    } catch (error) {
      throw new Error(`Error deleting OTP log: ${error.message}`);
    }
  }

  /**
   * Delete old logs
   * @param {number} days - Number of days to keep
   * @returns {Promise<number>} Number of deleted records
   */
  async deleteOldLogs(days = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      const count = await OTPLog.destroy({
        where: {
          created_at: {
            [Op.lt]: cutoffDate,
          },
        },
      });
      
      return count;
    } catch (error) {
      throw new Error(`Error deleting old logs: ${error.message}`);
    }
  }

  /**
   * Delete logs by OTP ID
   * @param {number} otpId - OTP ID
   * @returns {Promise<number>} Number of deleted records
   */
  async deleteByOtpId(otpId) {
    try {
      const count = await OTPLog.destroy({
        where: { otpId },
      });
      return count;
    } catch (error) {
      throw new Error(`Error deleting logs by OTP ID: ${error.message}`);
    }
  }

  /**
   * Get relation includes for queries
   * @private
   * @returns {Array} Array of include options
   */
  _getRelationIncludes() {
    return [
      {
        model: OTP,
        as: "otp",
      },
      {
        model: Leads,
        as: "lead",
      },
    ];
  }
}

export default new OtpLogDB();
