// @ts-nocheck
import { LastActivity, Leads, KYC } from "../../models/index.js";
import { Op } from "sequelize";

/**
 * Database operations for LastActivity model
 * Handles CRUD operations and relationship management
 */
class LastActivityDB {
  /**
   * Create a new last activity record
   * @param {Object} activityData - Last activity data
   * @returns {Promise<Object>} Created last activity
   */
  async create(activityData) {
    try {
      const activity = await LastActivity.create(activityData);
      return activity;
    } catch (error) {
      throw new Error(`Error creating last activity: ${error.message}`);
    }
  }

  /**
   * Create or update last activity (upsert)
   * @param {Object} criteria - Search criteria
   * @param {Object} activityData - Activity data
   * @returns {Promise<Object>} Activity and created flag
   */
  async upsert(criteria, activityData) {
    try {
      const [activity, created] = await LastActivity.findOrCreate({
        where: criteria,
        defaults: activityData,
      });

      if (!created) {
        await activity.update(activityData);
      }

      return { activity, created };
    } catch (error) {
      throw new Error(`Error upserting last activity: ${error.message}`);
    }
  }

  /**
   * Update or create last activity by UID and activity name
   * @param {string} uid - User UID
   * @param {string} activityName - Activity name
   * @param {Object} activityData - Activity data
   * @returns {Promise<Object>} Activity and created flag
   */
  async upsertByUidAndActivity(uid, activityName, activityData) {
    try {
      return await this.upsert(
        { uid, activityName },
        { ...activityData, uid, activityName }
      );
    } catch (error) {
      throw new Error(`Error upserting last activity by UID and activity: ${error.message}`);
    }
  }

  /**
   * Update or create last activity by KYC ID and activity name
   * @param {string} kycId - KYC ID
   * @param {string} activityName - Activity name
   * @param {Object} activityData - Activity data
   * @returns {Promise<Object>} Activity and created flag
   */
  async upsertByKycIdAndActivity(kycId, activityName, activityData) {
    try {
      return await this.upsert(
        { kycId, activityName },
        { ...activityData, kycId, activityName }
      );
    } catch (error) {
      throw new Error(`Error upserting last activity by KYC ID and activity: ${error.message}`);
    }
  }

  /**
   * Find last activity by ID
   * @param {number} id - Last activity ID
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} Last activity or null
   */
  async findById(id, options = {}) {
    try {
      const { includeRelations = false } = options;
      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await LastActivity.findByPk(id, { include });
    } catch (error) {
      throw new Error(`Error finding last activity by ID: ${error.message}`);
    }
  }

  /**
   * Find last activities by UID
   * @param {string} uid - User UID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of last activities
   */
  async findByUid(uid, options = {}) {
    try {
      const {
        includeRelations = false,
        limit = 100,
        offset = 0,
      } = options;

      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await LastActivity.findAll({
        where: { uid },
        include,
        limit,
        offset,
        order: [["activity_time", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error finding last activities by UID: ${error.message}`);
    }
  }

  /**
   * Find last activity by UID and activity name
   * @param {string} uid - User UID
   * @param {string} activityName - Activity name
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} Last activity or null
   */
  async findByUidAndActivity(uid, activityName, options = {}) {
    try {
      const { includeRelations = false } = options;
      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await LastActivity.findOne({
        where: { uid, activityName },
        include,
      });
    } catch (error) {
      throw new Error(`Error finding last activity by UID and activity: ${error.message}`);
    }
  }

  /**
   * Find last activities by KYC ID
   * @param {string} kycId - KYC ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of last activities
   */
  async findByKycId(kycId, options = {}) {
    try {
      const {
        includeRelations = false,
        limit = 100,
        offset = 0,
      } = options;

      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await LastActivity.findAll({
        where: { kycId },
        include,
        limit,
        offset,
        order: [["activity_time", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error finding last activities by KYC ID: ${error.message}`);
    }
  }

  /**
   * Find last activity by KYC ID and activity name
   * @param {string} kycId - KYC ID
   * @param {string} activityName - Activity name
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} Last activity or null
   */
  async findByKycIdAndActivity(kycId, activityName, options = {}) {
    try {
      const { includeRelations = false } = options;
      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await LastActivity.findOne({
        where: { kycId, activityName },
        include,
      });
    } catch (error) {
      throw new Error(`Error finding last activity by KYC ID and activity: ${error.message}`);
    }
  }

  /**
   * Find last activities by client code
   * @param {string} clientCode - Client code
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of last activities
   */
  async findByClientCode(clientCode, options = {}) {
    try {
      const {
        includeRelations = false,
        limit = 100,
        offset = 0,
      } = options;

      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await LastActivity.findAll({
        where: { clientCode },
        include,
        limit,
        offset,
        order: [["activity_time", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error finding last activities by client code: ${error.message}`);
    }
  }

  /**
   * Find last activities by activity name
   * @param {string} activityName - Activity name
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of last activities
   */
  async findByActivityName(activityName, options = {}) {
    try {
      const {
        includeRelations = false,
        limit = 100,
        offset = 0,
      } = options;

      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await LastActivity.findAll({
        where: { activityName },
        include,
        limit,
        offset,
        order: [["activity_time", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error finding last activities by activity name: ${error.message}`);
    }
  }

  /**
   * Find last activities by activity type
   * @param {string} activityType - Activity type
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of last activities
   */
  async findByActivityType(activityType, options = {}) {
    try {
      const {
        includeRelations = false,
        limit = 100,
        offset = 0,
      } = options;

      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await LastActivity.findAll({
        where: { activityType },
        include,
        limit,
        offset,
        order: [["activity_time", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error finding last activities by activity type: ${error.message}`);
    }
  }

  /**
   * Find last activities by status
   * @param {string} status - Status
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of last activities
   */
  async findByStatus(status, options = {}) {
    try {
      const {
        includeRelations = false,
        limit = 100,
        offset = 0,
      } = options;

      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await LastActivity.findAll({
        where: { status },
        include,
        limit,
        offset,
        order: [["activity_time", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error finding last activities by status: ${error.message}`);
    }
  }

  /**
   * Find last activities by session ID
   * @param {string} sessionId - Session ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of last activities
   */
  async findBySessionId(sessionId, options = {}) {
    try {
      const {
        includeRelations = false,
        limit = 100,
        offset = 0,
      } = options;

      const include = includeRelations ? this._getRelationIncludes() : [];
      
      return await LastActivity.findAll({
        where: { sessionId },
        include,
        limit,
        offset,
        order: [["activity_time", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error finding last activities by session ID: ${error.message}`);
    }
  }

  /**
   * Find all last activities with filters
   * @param {Object} filters - Query filters
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of last activities
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
      
      return await LastActivity.findAll({
        where: filters,
        include,
        limit,
        offset,
        order,
      });
    } catch (error) {
      throw new Error(`Error finding last activities: ${error.message}`);
    }
  }

  /**
   * Find and count all last activities with filters
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
      
      return await LastActivity.findAndCountAll({
        where: filters,
        include,
        limit,
        offset,
        order,
      });
    } catch (error) {
      throw new Error(`Error finding and counting last activities: ${error.message}`);
    }
  }

  /**
   * Update last activity
   * @param {number} id - Last activity ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated last activity
   */
  async update(id, updateData) {
    try {
      const activity = await LastActivity.findByPk(id);
      if (!activity) {
        throw new Error("Last activity not found");
      }
      
      await activity.update(updateData);
      return activity;
    } catch (error) {
      throw new Error(`Error updating last activity: ${error.message}`);
    }
  }

  /**
   * Update last activity by UID and activity name
   * @param {string} uid - User UID
   * @param {string} activityName - Activity name
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated last activity
   */
  async updateByUidAndActivity(uid, activityName, updateData) {
    try {
      const activity = await LastActivity.findOne({
        where: { uid, activityName },
      });
      
      if (!activity) {
        throw new Error("Last activity not found");
      }
      
      await activity.update(updateData);
      return activity;
    } catch (error) {
      throw new Error(`Error updating last activity by UID and activity: ${error.message}`);
    }
  }

  /**
   * Get activities with lead
   * @param {string} uid - User UID
   * @returns {Promise<Array>} Array of activities with lead
   */
  async getActivitiesWithLead(uid) {
    try {
      return await LastActivity.findAll({
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
      throw new Error(`Error getting activities with lead: ${error.message}`);
    }
  }

  /**
   * Get activities with KYC
   * @param {string} kycId - KYC ID
   * @returns {Promise<Array>} Array of activities with KYC
   */
  async getActivitiesWithKyc(kycId) {
    try {
      return await LastActivity.findAll({
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
      throw new Error(`Error getting activities with KYC: ${error.message}`);
    }
  }

  /**
   * Count last activities by filters
   * @param {Object} filters - Query filters
   * @returns {Promise<number>} Count of last activities
   */
  async count(filters = {}) {
    try {
      return await LastActivity.count({ where: filters });
    } catch (error) {
      throw new Error(`Error counting last activities: ${error.message}`);
    }
  }

  /**
   * Count activities by UID
   * @param {string} uid - User UID
   * @returns {Promise<number>} Count of activities
   */
  async countByUid(uid) {
    try {
      return await LastActivity.count({ where: { uid } });
    } catch (error) {
      throw new Error(`Error counting activities by UID: ${error.message}`);
    }
  }

  /**
   * Count activities by KYC ID
   * @param {string} kycId - KYC ID
   * @returns {Promise<number>} Count of activities
   */
  async countByKycId(kycId) {
    try {
      return await LastActivity.count({ where: { kycId } });
    } catch (error) {
      throw new Error(`Error counting activities by KYC ID: ${error.message}`);
    }
  }

  /**
   * Delete last activity
   * @param {number} id - Last activity ID
   * @returns {Promise<boolean>} True if deleted
   */
  async delete(id) {
    try {
      const activity = await LastActivity.findByPk(id);
      if (!activity) {
        throw new Error("Last activity not found");
      }
      
      await activity.destroy();
      return true;
    } catch (error) {
      throw new Error(`Error deleting last activity: ${error.message}`);
    }
  }

  /**
   * Delete activities by UID
   * @param {string} uid - User UID
   * @returns {Promise<number>} Number of deleted records
   */
  async deleteByUid(uid) {
    try {
      const count = await LastActivity.destroy({
        where: { uid },
      });
      return count;
    } catch (error) {
      throw new Error(`Error deleting activities by UID: ${error.message}`);
    }
  }

  /**
   * Delete activities by KYC ID
   * @param {string} kycId - KYC ID
   * @returns {Promise<number>} Number of deleted records
   */
  async deleteByKycId(kycId) {
    try {
      const count = await LastActivity.destroy({
        where: { kycId },
      });
      return count;
    } catch (error) {
      throw new Error(`Error deleting activities by KYC ID: ${error.message}`);
    }
  }

  /**
   * Delete activity by UID and activity name
   * @param {string} uid - User UID
   * @param {string} activityName - Activity name
   * @returns {Promise<boolean>} True if deleted
   */
  async deleteByUidAndActivity(uid, activityName) {
    try {
      const count = await LastActivity.destroy({
        where: { uid, activityName },
      });
      return count > 0;
    } catch (error) {
      throw new Error(`Error deleting activity by UID and activity: ${error.message}`);
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

export default new LastActivityDB();
