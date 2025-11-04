// @ts-nocheck
import { OTP, OTPLog, Leads } from "../../models/index.js";
import { Op } from "sequelize";

/**
 * Database operations for OTP model
 * Handles CRUD operations and relationship management
 */
class OtpDB {
  /**
   * Create a new OTP record
   * @param {Object} otpData - OTP data
   * @returns {Promise<Object>} Created OTP
   */
  async create(otpData) {
    try {
      const otp = await OTP.create(otpData);
      return otp;
    } catch (error) {
      throw new Error(`Error creating OTP: ${error.message}`);
    }
  }

  /**
   * Create OTP with log entry
   * @param {Object} otpData - OTP data
   * @param {Object} logData - OTP log data
   * @returns {Promise<Object>} Created OTP with log
   */
  async createWithLog(otpData, logData) {
    try {
      const otp = await OTP.create(otpData);
      const log = await OTPLog.create({
        ...logData,
        otpId: otp.id,
        uid: otp.uid,
      });
      return { otp, log };
    } catch (error) {
      throw new Error(`Error creating OTP with log: ${error.message}`);
    }
  }

  /**
   * Find OTP by ID
   * @param {number} id - OTP ID
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} OTP or null
   */
  async findById(id, options = {}) {
    try {
      const { includeRelations = false } = options;
      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await OTP.findByPk(id, { include });
    } catch (error) {
      throw new Error(`Error finding OTP by ID: ${error.message}`);
    }
  }

  /**
   * Find OTP by UID
   * @param {string} uid - User UID
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} OTP or null
   */
  async findByUid(uid, options = {}) {
    try {
      const { includeRelations = false } = options;
      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await OTP.findOne({
        where: { uid },
        include,
        order: [["created_at", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error finding OTP by UID: ${error.message}`);
    }
  }

  /**
   * Find OTP by mobile
   * @param {string} mobile - Mobile number
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} OTP or null
   */
  async findByMobile(mobile, options = {}) {
    try {
      const { includeRelations = false } = options;
      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await OTP.findOne({
        where: { mobile },
        include,
        order: [["created_at", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error finding OTP by mobile: ${error.message}`);
    }
  }

  /**
   * Find OTP by email
   * @param {string} email - Email address
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} OTP or null
   */
  async findByEmail(email, options = {}) {
    try {
      const { includeRelations = false } = options;
      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await OTP.findOne({
        where: { email },
        include,
        order: [["created_at", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error finding OTP by email: ${error.message}`);
    }
  }

  /**
   * Find active OTP by mobile
   * @param {string} mobile - Mobile number
   * @returns {Promise<Object|null>} Active OTP or null
   */
  async findActiveByMobile(mobile) {
    try {
      return await OTP.findOne({
        where: {
          mobile,
          mobileOtpExpiry: {
            [Op.gt]: new Date(),
          },
          mobileOtpVerified: false,
        },
        order: [["created_at", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error finding active OTP by mobile: ${error.message}`);
    }
  }

  /**
   * Find active OTP by email
   * @param {string} email - Email address
   * @returns {Promise<Object|null>} Active OTP or null
   */
  async findActiveByEmail(email) {
    try {
      return await OTP.findOne({
        where: {
          email,
          emailOtpExpiry: {
            [Op.gt]: new Date(),
          },
          emailOtpVerified: false,
        },
        order: [["created_at", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error finding active OTP by email: ${error.message}`);
    }
  }

  /**
   * Find all OTPs with filters
   * @param {Object} filters - Query filters
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of OTPs
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
      
      return await OTP.findAll({
        where: filters,
        include,
        limit,
        offset,
        order,
      });
    } catch (error) {
      throw new Error(`Error finding OTPs: ${error.message}`);
    }
  }

  /**
   * Find and count all OTPs with filters
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
      
      return await OTP.findAndCountAll({
        where: filters,
        include,
        limit,
        offset,
        order,
      });
    } catch (error) {
      throw new Error(`Error finding and counting OTPs: ${error.message}`);
    }
  }

  /**
   * Update OTP
   * @param {number} id - OTP ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated OTP
   */
  async update(id, updateData) {
    try {
      const otp = await OTP.findByPk(id);
      if (!otp) {
        throw new Error("OTP not found");
      }
      
      await otp.update(updateData);
      return otp;
    } catch (error) {
      throw new Error(`Error updating OTP: ${error.message}`);
    }
  }

  /**
   * Update OTP by UID
   * @param {string} uid - User UID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated OTP
   */
  async updateByUid(uid, updateData) {
    try {
      const otp = await OTP.findOne({
        where: { uid },
        order: [["created_at", "DESC"]],
      });
      
      if (!otp) {
        throw new Error("OTP not found");
      }
      
      await otp.update(updateData);
      return otp;
    } catch (error) {
      throw new Error(`Error updating OTP by UID: ${error.message}`);
    }
  }

  /**
   * Increment mobile OTP attempts
   * @param {number} id - OTP ID
   * @returns {Promise<Object>} Updated OTP
   */
  async incrementMobileAttempts(id) {
    try {
      const otp = await OTP.findByPk(id);
      if (!otp) {
        throw new Error("OTP not found");
      }
      
      await otp.increment("mobileOtpAttempts");
      await otp.reload();
      return otp;
    } catch (error) {
      throw new Error(`Error incrementing mobile attempts: ${error.message}`);
    }
  }

  /**
   * Increment email OTP attempts
   * @param {number} id - OTP ID
   * @returns {Promise<Object>} Updated OTP
   */
  async incrementEmailAttempts(id) {
    try {
      const otp = await OTP.findByPk(id);
      if (!otp) {
        throw new Error("OTP not found");
      }
      
      await otp.increment("emailOtpAttempts");
      await otp.reload();
      return otp;
    } catch (error) {
      throw new Error(`Error incrementing email attempts: ${error.message}`);
    }
  }

  /**
   * Increment mobile OTP resend attempts
   * @param {number} id - OTP ID
   * @returns {Promise<Object>} Updated OTP
   */
  async incrementMobileResendAttempts(id) {
    try {
      const otp = await OTP.findByPk(id);
      if (!otp) {
        throw new Error("OTP not found");
      }
      
      await otp.increment("mobileOtpResendAttempts");
      await otp.reload();
      return otp;
    } catch (error) {
      throw new Error(`Error incrementing mobile resend attempts: ${error.message}`);
    }
  }

  /**
   * Increment email OTP resend attempts
   * @param {number} id - OTP ID
   * @returns {Promise<Object>} Updated OTP
   */
  async incrementEmailResendAttempts(id) {
    try {
      const otp = await OTP.findByPk(id);
      if (!otp) {
        throw new Error("OTP not found");
      }
      
      await otp.increment("emailOtpResendAttempts");
      await otp.reload();
      return otp;
    } catch (error) {
      throw new Error(`Error incrementing email resend attempts: ${error.message}`);
    }
  }

  /**
   * Verify mobile OTP
   * @param {number} id - OTP ID
   * @returns {Promise<Object>} Updated OTP
   */
  async verifyMobileOtp(id) {
    try {
      return await this.update(id, {
        mobileOtpVerified: true,
        mobileOtpVerifiedAt: new Date(),
      });
    } catch (error) {
      throw new Error(`Error verifying mobile OTP: ${error.message}`);
    }
  }

  /**
   * Verify email OTP
   * @param {number} id - OTP ID
   * @returns {Promise<Object>} Updated OTP
   */
  async verifyEmailOtp(id) {
    try {
      return await this.update(id, {
        emailOtpVerified: true,
        emailOtpVerifiedAt: new Date(),
      });
    } catch (error) {
      throw new Error(`Error verifying email OTP: ${error.message}`);
    }
  }

  /**
   * Block OTP
   * @param {number} id - OTP ID
   * @param {Date} blockedUntil - Block until date
   * @returns {Promise<Object>} Updated OTP
   */
  async blockOtp(id, blockedUntil) {
    try {
      return await this.update(id, {
        isBlocked: true,
        blockedUntil,
      });
    } catch (error) {
      throw new Error(`Error blocking OTP: ${error.message}`);
    }
  }

  /**
   * Unblock OTP
   * @param {number} id - OTP ID
   * @returns {Promise<Object>} Updated OTP
   */
  async unblockOtp(id) {
    try {
      return await this.update(id, {
        isBlocked: false,
        blockedUntil: null,
      });
    } catch (error) {
      throw new Error(`Error unblocking OTP: ${error.message}`);
    }
  }

  /**
   * Delete OTP
   * @param {number} id - OTP ID
   * @returns {Promise<boolean>} True if deleted
   */
  async delete(id) {
    try {
      const otp = await OTP.findByPk(id);
      if (!otp) {
        throw new Error("OTP not found");
      }
      
      await otp.destroy();
      return true;
    } catch (error) {
      throw new Error(`Error deleting OTP: ${error.message}`);
    }
  }

  /**
   * Delete expired OTPs
   * @returns {Promise<number>} Number of deleted records
   */
  async deleteExpired() {
    try {
      const now = new Date();
      const count = await OTP.destroy({
        where: {
          [Op.or]: [
            {
              mobileOtpExpiry: {
                [Op.lt]: now,
              },
            },
            {
              emailOtpExpiry: {
                [Op.lt]: now,
              },
            },
          ],
        },
      });
      return count;
    } catch (error) {
      throw new Error(`Error deleting expired OTPs: ${error.message}`);
    }
  }

  /**
   * Get OTP with logs
   * @param {number} id - OTP ID
   * @returns {Promise<Object|null>} OTP with logs
   */
  async getOtpWithLogs(id) {
    try {
      return await OTP.findByPk(id, {
        include: [
          {
            model: OTPLog,
            as: "logs",
            order: [["created_at", "DESC"]],
          },
        ],
      });
    } catch (error) {
      throw new Error(`Error getting OTP with logs: ${error.message}`);
    }
  }

  /**
   * Get OTP with lead
   * @param {number} id - OTP ID
   * @returns {Promise<Object|null>} OTP with lead
   */
  async getOtpWithLead(id) {
    try {
      return await OTP.findByPk(id, {
        include: [
          {
            model: Leads,
            as: "lead",
          },
        ],
      });
    } catch (error) {
      throw new Error(`Error getting OTP with lead: ${error.message}`);
    }
  }

  /**
   * Count OTPs by filters
   * @param {Object} filters - Query filters
   * @returns {Promise<number>} Count of OTPs
   */
  async count(filters = {}) {
    try {
      return await OTP.count({ where: filters });
    } catch (error) {
      throw new Error(`Error counting OTPs: ${error.message}`);
    }
  }

  /**
   * Check if OTP is blocked
   * @param {number} id - OTP ID
   * @returns {Promise<boolean>} True if blocked
   */
  async isBlocked(id) {
    try {
      const otp = await OTP.findByPk(id);
      if (!otp) {
        return false;
      }
      
      if (!otp.isBlocked) {
        return false;
      }
      
      if (otp.blockedUntil && new Date() > otp.blockedUntil) {
        await this.unblockOtp(id);
        return false;
      }
      
      return true;
    } catch (error) {
      throw new Error(`Error checking if OTP is blocked: ${error.message}`);
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
        model: Leads,
        as: "lead",
      },
      {
        model: OTPLog,
        as: "logs",
        order: [["created_at", "DESC"]],
      },
    ];
  }
}

export default new OtpDB();
