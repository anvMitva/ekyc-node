// @ts-nocheck
import { ActivityLog, Leads, KYC } from "../../models/index.js";
import { Op } from "sequelize";

/**
 * Database operations for ActivityLog model
 * Handles CRUD operations and relationship management
 */
class ActivityLogDB {
  /**
   * Create a new activity log entry
   * @param {Object} logData - Activity log data
   * @returns {Promise<Object>} Created activity log
   */
  async create(logData) {
    try {
      const log = await ActivityLog.create(logData);
      return log;
    } catch (error) {
      throw new Error(`Error creating activity log: ${error.message}`);
    }
  }

  /**
   * Create multiple activity log entries
   * @param {Array} logsData - Array of activity log data
   * @returns {Promise<Array>} Created activity logs
   */
  async bulkCreate(logsData) {
    try {
      const logs = await ActivityLog.bulkCreate(logsData);
      return logs;
    } catch (error) {
      throw new Error(`Error bulk creating activity logs: ${error.message}`);
    }
  }

  /**
   * Find activity log by ID
   * @param {number} id - Activity log ID
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} Activity log or null
   */
  async findById(id, options = {}) {
    try {
      const { includeRelations = false } = options;
      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await ActivityLog.findByPk(id, { include });
    } catch (error) {
      throw new Error(`Error finding activity log by ID: ${error.message}`);
    }
  }

  /**
   * Find activity logs by UID
   * @param {string} uid - User UID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of activity logs
   */
  async findByUid(uid, options = {}) {
    try {
      const {
        includeRelations = false,
        limit = 100,
        offset = 0,
      } = options;

      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await ActivityLog.findAll({
        where: { uid },
        include,
        limit,
        offset,
        order: [["activity_time", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error finding activity logs by UID: ${error.message}`);
    }
  }

  /**
   * Find activity logs by KYC ID
   * @param {string} kycId - KYC ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of activity logs
   */
  async findByKycId(kycId, options = {}) {
    try {
      const {
        includeRelations = false,
        limit = 100,
        offset = 0,
      } = options;

      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await ActivityLog.findAll({
        where: { kycId },
        include,
        limit,
        offset,
        order: [["activity_time", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error finding activity logs by KYC ID: ${error.message}`);
    }
  }

  /**
   * Find activity logs by client code
   * @param {string} clientCode - Client code
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of activity logs
   */
  async findByClientCode(clientCode, options = {}) {
    try {
      const {
        includeRelations = false,
        limit = 100,
        offset = 0,
      } = options;

      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await ActivityLog.findAll({
        where: { clientCode },
        include,
        limit,
        offset,
        order: [["activity_time", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error finding activity logs by client code: ${error.message}`);
    }
  }

  /**
   * Find activity logs by activity name
   * @param {string} activityName - Activity name
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of activity logs
   */
  async findByActivityName(activityName, options = {}) {
    try {
      const {
        includeRelations = false,
        limit = 100,
        offset = 0,
      } = options;

      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await ActivityLog.findAll({
        where: { activityName },
        include,
        limit,
        offset,
        order: [["activity_time", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error finding activity logs by activity name: ${error.message}`);
    }
  }

  /**
   * Find activity logs by activity type
   * @param {string} activityType - Activity type
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of activity logs
   */
  async findByActivityType(activityType, options = {}) {
    try {
      const {
        includeRelations = false,
        limit = 100,
        offset = 0,
      } = options;

      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await ActivityLog.findAll({
        where: { activityType },
        include,
        limit,
        offset,
        order: [["activity_time", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error finding activity logs by activity type: ${error.message}`);
    }
  }

  /**
   * Find activity logs by status
   * @param {string} status - Status
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of activity logs
   */
  async findByStatus(status, options = {}) {
    try {
      const {
        includeRelations = false,
        limit = 100,
        offset = 0,
      } = options;

      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await ActivityLog.findAll({
        where: { status },
        include,
        limit,
        offset,
        order: [["activity_time", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error finding activity logs by status: ${error.message}`);
    }
  }

  /**
   * Find activity logs by session ID
   * @param {string} sessionId - Session ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of activity logs
   */
  async findBySessionId(sessionId, options = {}) {
    try {
      const {
        includeRelations = false,
        limit = 100,
        offset = 0,
      } = options;

      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await ActivityLog.findAll({
        where: { sessionId },
        include,
        limit,
        offset,
        order: [["activity_time", "ASC"]],
      });
    } catch (error) {
      throw new Error(`Error finding activity logs by session ID: ${error.message}`);
    }
  }

  /**
   * Find activity logs by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of activity logs
   */
  async findByDateRange(startDate, endDate, options = {}) {
    try {
      const {
        includeRelations = false,
        limit = 100,
        offset = 0,
      } = options;

      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await ActivityLog.findAll({
        where: {
          activity_time: {
            [Op.between]: [startDate, endDate],
          },
        },
        include,
        limit,
        offset,
        order: [["activity_time", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error finding activity logs by date range: ${error.message}`);
    }
  }

  /**
   * Find all activity logs with filters
   * @param {Object} filters - Query filters
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of activity logs
   */
  async findAll(filters = {}, options = {}) {
    try {
      const {
        includeRelations = false,
        limit = 100,
        offset = 0,
        order = [["activity_time", "DESC"]],
      } = options;

      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await ActivityLog.findAll({
        where: filters,
        include,
        limit,
        offset,
        order,
      });
    } catch (error) {
      throw new Error(`Error finding activity logs: ${error.message}`);
    }
  }

  /**
   * Find and count all activity logs with filters
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
        order = [["activity_time", "DESC"]],
      } = options;

      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await ActivityLog.findAndCountAll({
        where: filters,
        include,
        limit,
        offset,
        order,
      });
    } catch (error) {
      throw new Error(`Error finding and counting activity logs: ${error.message}`);
    }
  }

  /**
   * Get latest activity by UID
   * @param {string} uid - User UID
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} Latest activity log or null
   */
  async getLatestByUid(uid, options = {}) {
    try {
      const { includeRelations = false } = options;
      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await ActivityLog.findOne({
        where: { uid },
        include,
        order: [["activity_time", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error getting latest activity by UID: ${error.message}`);
    }
  }

  /**
   * Get latest activity by KYC ID
   * @param {string} kycId - KYC ID
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} Latest activity log or null
   */
  async getLatestByKycId(kycId, options = {}) {
    try {
      const { includeRelations = false } = options;
      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await ActivityLog.findOne({
        where: { kycId },
        include,
        order: [["activity_time", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error getting latest activity by KYC ID: ${error.message}`);
    }
  }

  /**
   * Get activity logs with lead
   * @param {string} uid - User UID
   * @returns {Promise<Array>} Array of logs with lead
   */
  async getLogsWithLead(uid) {
    try {
      return await ActivityLog.findAll({
        where: { uid },
        include: [
          {
            model: Leads,
            as: "lead",
          },
        ],
        order: [["activity_time", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error getting logs with lead: ${error.message}`);
    }
  }

  /**
   * Get activity logs with KYC
   * @param {string} kycId - KYC ID
   * @returns {Promise<Array>} Array of logs with KYC
   */
  async getLogsWithKyc(kycId) {
    try {
      return await ActivityLog.findAll({
        where: { kycId },
        include: [
          {
            model: KYC,
            as: "kyc",
          },
        ],
        order: [["activity_time", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error getting logs with KYC: ${error.message}`);
    }
  }

  /**
   * Count activity logs by filters
   * @param {Object} filters - Query filters
   * @returns {Promise<number>} Count of activity logs
   */
  async count(filters = {}) {
    try {
      return await ActivityLog.count({ where: filters });
    } catch (error) {
      throw new Error(`Error counting activity logs: ${error.message}`);
    }
  }

  /**
   * Count logs by UID
   * @param {string} uid - User UID
   * @returns {Promise<number>} Count of logs
   */
  async countByUid(uid) {
    try {
      return await ActivityLog.count({ where: { uid } });
    } catch (error) {
      throw new Error(`Error counting logs by UID: ${error.message}`);
    }
  }

  /**
   * Count logs by KYC ID
   * @param {string} kycId - KYC ID
   * @returns {Promise<number>} Count of logs
   */
  async countByKycId(kycId) {
    try {
      return await ActivityLog.count({ where: { kycId } });
    } catch (error) {
      throw new Error(`Error counting logs by KYC ID: ${error.message}`);
    }
  }

  /**
   * Count logs by activity name
   * @param {string} activityName - Activity name
   * @returns {Promise<number>} Count of logs
   */
  async countByActivityName(activityName) {
    try {
      return await ActivityLog.count({ where: { activityName } });
    } catch (error) {
      throw new Error(`Error counting logs by activity name: ${error.message}`);
    }
  }

  /**
   * Get activity statistics by UID
   * @param {string} uid - User UID
   * @returns {Promise<Object>} Activity statistics
   */
  async getActivityStatsByUid(uid) {
    try {
      const total = await this.countByUid(uid);
      const latest = await this.getLatestByUid(uid);
      const byType = await ActivityLog.findAll({
        where: { uid },
        attributes: [
          "activityType",
          [ActivityLog.sequelize.fn("COUNT", "*"), "count"],
        ],
        group: ["activityType"],
      });

      return { total, latest, byType };
    } catch (error) {
      throw new Error(`Error getting activity stats by UID: ${error.message}`);
    }
  }

  /**
   * Delete activity log
   * @param {number} id - Activity log ID
   * @returns {Promise<boolean>} True if deleted
   */
  async delete(id) {
    try {
      const log = await ActivityLog.findByPk(id);
      if (!log) {
        throw new Error("Activity log not found");
      }
      
      await log.destroy();
      return true;
    } catch (error) {
      throw new Error(`Error deleting activity log: ${error.message}`);
    }
  }

  /**
   * Delete old logs
   * @param {number} days - Number of days to keep
   * @returns {Promise<number>} Number of deleted records
   */
  async deleteOldLogs(days = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      const count = await ActivityLog.destroy({
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
   * Delete logs by UID
   * @param {string} uid - User UID
   * @returns {Promise<number>} Number of deleted records
   */
  async deleteByUid(uid) {
    try {
      const count = await ActivityLog.destroy({
        where: { uid },
      });
      return count;
    } catch (error) {
      throw new Error(`Error deleting logs by UID: ${error.message}`);
    }
  }

  /**
   * Delete logs by KYC ID
   * @param {string} kycId - KYC ID
   * @returns {Promise<number>} Number of deleted records
   */
  async deleteByKycId(kycId) {
    try {
      const count = await ActivityLog.destroy({
        where: { kycId },
      });
      return count;
    } catch (error) {
      throw new Error(`Error deleting logs by KYC ID: ${error.message}`);
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
        model: KYC,
        as: "kyc",
      },
    ];
  }
}

export default new ActivityLogDB();
