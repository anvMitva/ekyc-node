// @ts-nocheck
import { Op } from "sequelize";
import { ApiLog } from "../../models/index.js";

class ApiLogDB {
  /**
   * Create a new API log entry
   * @param {Object} logData - API log data
   * @returns {Promise<Object>} Created API log
   */
  async create(logData) {
    try {
      const log = await ApiLog.create(logData);
      return log;
    } catch (error) {
      throw new Error(`Error creating API log: ${error.message}`);
    }
  }

  /**
   * Create multiple API log entries
   * @param {Array} logsData - Array of API log data
   * @returns {Promise<Array>} Created API logs
   */
  async bulkCreate(logsData) {
    try {
      const logs = await ApiLog.bulkCreate(logsData);
      return logs;
    } catch (error) {
      throw new Error(`Error bulk creating API logs: ${error.message}`);
    }
  }

  /**
   * Find API log by ID
   * @param {number} id - API log ID
   * @returns {Promise<Object|null>} API log or null
   */
  async findById(id) {
    try {
      return await ApiLog.findByPk(id);
    } catch (error) {
      throw new Error(`Error finding API log by ID: ${error.message}`);
    }
  }

  /**
   * Find API logs by service
   * @param {string} service - Service name (SMS, EMAIL, PAN, etc.)
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of API logs
   */
  async findByService(service, options = {}) {
    try {
      const { limit = 100, offset = 0 } = options;

      return await ApiLog.findAll({
        where: { service },
        limit,
        offset,
        order: [["created_at", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error finding API logs by service: ${error.message}`);
    }
  }

  /**
   * Find API logs by UID
   * @param {string} uid - User UID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of API logs
   */
  async findByUid(uid, options = {}) {
    try {
      const { limit = 100, offset = 0 } = options;

      return await ApiLog.findAll({
        where: { uid },
        limit,
        offset,
        order: [["created_at", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error finding API logs by UID: ${error.message}`);
    }
  }

  /**
   * Find API logs by mobile
   * @param {string} mobile - Mobile number
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of API logs
   */
  async findByMobile(mobile, options = {}) {
    try {
      const { limit = 100, offset = 0 } = options;

      return await ApiLog.findAll({
        where: { mobile },
        limit,
        offset,
        order: [["created_at", "DESC"]],
      });  
    } catch (error) {
      throw new Error(`Error finding API logs by mobile: ${error.message}`);
    }
  }

  /**
   * Find API logs by status
   * @param {string} status - Status (success, failed, pending)
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of API logs
   */
  async findByStatus(status, options = {}) {
    try {
      const { limit = 100, offset = 0 } = options;

      return await ApiLog.findAll({
        where: { status },
        limit,
        offset,
        order: [["created_at", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error finding API logs by status: ${error.message}`);
    }
  }

  /**
   * Find failed API logs
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of failed API logs
   */
  async findFailedLogs(options = {}) {
    try {
      return await this.findByStatus("failed", options);
    } catch (error) {
      throw new Error(`Error finding failed API logs: ${error.message}`);
    }
  }

  /**
   * Find API logs by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of API logs
   */
  async findByDateRange(startDate, endDate, options = {}) {
    try {
      const { limit = 100, offset = 0 } = options;

      return await ApiLog.findAll({
        where: {
          created_at: {
            [Op.between]: [startDate, endDate],
          },
        },
        limit,
        offset,
        order: [["created_at", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error finding API logs by date range: ${error.message}`);
    }
  }

  /**
   * Find all API logs with filters
   * @param {Object} filters - Query filters
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of API logs
   */
  async findAll(filters = {}, options = {}) {
    try {
      const {
        limit = 100,
        offset = 0,
        order = [["created_at", "DESC"]],
      } = options;

      return await ApiLog.findAll({
        where: filters,
        limit,
        offset,
        order,
      });
    } catch (error) {
      throw new Error(`Error finding API logs: ${error.message}`);
    }
  }

  /**
   * Find and count all API logs with filters
   * @param {Object} filters - Query filters
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Object with rows and count
   */
  async findAndCountAll(filters = {}, options = {}) {
    try {
      const {
        limit = 100,
        offset = 0,
        order = [["created_at", "DESC"]],
      } = options;

      return await ApiLog.findAndCountAll({
        where: filters,
        limit,
        offset,
        order,
      });
    } catch (error) {
      throw new Error(`Error finding and counting API logs: ${error.message}`);
    }
  }

  /**
   * Update API log
   * @param {number} id - API log ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated API log
   */
  async update(id, updateData) {
    try {
      const log = await ApiLog.findByPk(id);
      if (!log) {
        throw new Error("API log not found");
      }
      await log.update(updateData);
      return log;
    } catch (error) {
      throw new Error(`Error updating API log: ${error.message}`);
    }
  }

  /**
   * Delete API log
   * @param {number} id - API log ID
   * @returns {Promise<boolean>} True if deleted
   */
  async delete(id) {
    try {
      const log = await ApiLog.findByPk(id);
      if (!log) {
        throw new Error("API log not found");
      }
      await log.destroy();
      return true;
    } catch (error) {
      throw new Error(`Error deleting API log: ${error.message}`);
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

      const count = await ApiLog.destroy({
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
   * Get API statistics
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} Statistics object
   */
  async getStatistics(filters = {}) {
    try {
      const [total, successful, failed] = await Promise.all([
        ApiLog.count({ where: filters }),
        ApiLog.count({ where: { ...filters, status: "success" } }),
        ApiLog.count({ where: { ...filters, status: "failed" } }),
      ]);

      const avgDuration = await ApiLog.findOne({
        where: filters,
        attributes: [[ApiLog.sequelize.fn("AVG", ApiLog.sequelize.col("duration")), "avgDuration"]],
      });

      return {
        total,
        successful,
        failed,
        successRate: total > 0 ? (successful / total) * 100 : 0,
        avgDuration: avgDuration?.avgDuration || 0,
      };
    } catch (error) {
      throw new Error(`Error getting API statistics: ${error.message}`);
    }
  }

  /**
   * Count API logs by filters
   * @param {Object} filters - Query filters
   * @returns {Promise<number>} Count of API logs
   */
  async count(filters = {}) {
    try {
      return await ApiLog.count({ where: filters });
    } catch (error) {
      throw new Error(`Error counting API logs: ${error.message}`);
    }
  }
}

export default new ApiLogDB();
