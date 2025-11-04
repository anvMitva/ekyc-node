// @ts-nocheck
import { KYC, Leads, LastActivity, ActivityLog } from "../../models/index.js";
import { Op } from "sequelize";

/**
 * Database operations for KYC model
 * Handles CRUD operations and relationship management
 */
class KycDB {
  /**
   * Create a new KYC record
   * @param {Object} kycData - KYC data
   * @returns {Promise<Object>} Created KYC
   */
  async create(kycData) {
    try {
      const kyc = await KYC.create(kycData);
      return kyc;
    } catch (error) {
      throw new Error(`Error creating KYC: ${error.message}`);
    }
  }

  /**
   * Create KYC with activity log
   * @param {Object} kycData - KYC data
   * @param {Object} activityData - Activity log data
   * @returns {Promise<Object>} Created KYC with activity
   */
  async createWithActivity(kycData, activityData) {
    try {
      const kyc = await KYC.create(kycData);
      const activity = await ActivityLog.create({
        ...activityData,
        kycId: kyc.kycId,
        uid: kyc.uid,
      });
      return { kyc, activity };
    } catch (error) {
      throw new Error(`Error creating KYC with activity: ${error.message}`);
    }
  }

  /**
   * Find KYC by ID
   * @param {number} id - KYC ID
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} KYC or null
   */
  async findById(id, options = {}) {
    try {
      const { includeRelations = false } = options;
      const include = includeRelations ? this._getRelationIncludes() : [];

      return await KYC.findByPk(id, { include });
    } catch (error) {
      throw new Error(`Error finding KYC by ID: ${error.message}`);
    }
  }

  /**
   * Find KYC by KYC ID
   * @param {string} kycId - KYC ID
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} KYC or null
   */
  async findByKycId(kycId, options = {}) {
    try {
      const { includeRelations = false } = options;
      const include = includeRelations ? this._getRelationIncludes() : [];

      return await KYC.findOne({
        where: { kycId },
        include,
      });
    } catch (error) {
      throw new Error(`Error finding KYC by KYC ID: ${error.message}`);
    }
  }

  /**
   * Find KYC by UID
   * @param {string} uid - User UID
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} KYC or null
   */
  async findByUid(uid, options = {}) {
    try {
      const { includeRelations = false } = options;
      const include = includeRelations ? this._getRelationIncludes() : [];

      return await KYC.findOne({
        where: { uid },
        include,
      });
    } catch (error) {
      throw new Error(`Error finding KYC by UID: ${error.message}`);
    }
  }

  /**
   * Find KYC by PAN number
   * @param {string} panNo - PAN number
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} KYC or null
   */
  async findByPanNo(panNo, options = {}) {
    try {
      const { includeRelations = false } = options;
      const include = includeRelations ? this._getRelationIncludes() : [];

      return await KYC.findOne({
        where: { panNo },
        include,
      });
    } catch (error) {
      throw new Error(`Error finding KYC by PAN: ${error.message}`);
    }
  }

  /**
   * Find KYC by client code
   * @param {string} clientCode - Client code
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} KYC or null
   */
  async findByClientCode(clientCode, options = {}) {
    try {
      const { includeRelations = false } = options;
      const include = includeRelations ? this._getRelationIncludes() : [];

      return await KYC.findOne({
        where: { clientCode },
        include,
      });
    } catch (error) {
      throw new Error(`Error finding KYC by client code: ${error.message}`);
    }
  }

  /**
   * Find all KYCs with filters
   * @param {Object} filters - Query filters
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of KYCs
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

      return await KYC.findAll({
        where: filters,
        include,
        limit,
        offset,
        order,
      });
    } catch (error) {
      throw new Error(`Error finding KYCs: ${error.message}`);
    }
  }

  /**
   * Find and count all KYCs with filters
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

      return await KYC.findAndCountAll({
        where: filters,
        include,
        limit,
        offset,
        order,
      });
    } catch (error) {
      throw new Error(`Error finding and counting KYCs: ${error.message}`);
    }
  }

  /**
   * Find KYCs by status
   * @param {string} status - KYC status
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of KYCs
   */
  async findByStatus(status, options = {}) {
    try {
      return await this.findAll({ kycStatus: status }, options);
    } catch (error) {
      throw new Error(`Error finding KYCs by status: ${error.message}`);
    }
  }

  /**
   * Find KYCs by KRA status
   * @param {string} kraStatus - KRA status
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of KYCs
   */
  async findByKraStatus(kraStatus, options = {}) {
    try {
      return await this.findAll({ kraStatus }, options);
    } catch (error) {
      throw new Error(`Error finding KYCs by KRA status: ${error.message}`);
    }
  }

  /**
   * Find KYCs by PAN status
   * @param {string} panStatus - PAN status
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of KYCs
   */
  async findByPanStatus(panStatus, options = {}) {
    try {
      return await this.findAll({ panStatus }, options);
    } catch (error) {
      throw new Error(`Error finding KYCs by PAN status: ${error.message}`);
    }
  }

  /**
   * Find KRAs
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of KYCs with KRA
   */
  async findKras(options = {}) {
    try {
      return await this.findAll({ isKra: true }, options);
    } catch (error) {
      throw new Error(`Error finding KRAs: ${error.message}`);
    }
  }

  /**
   * Find KYCs by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of KYCs
   */
  async findByDateRange(startDate, endDate, options = {}) {
    try {
      const {
        includeRelations = false,
        limit = 100,
        offset = 0,
      } = options;

      const include = includeRelations ? this._getRelationIncludes() : [];

      return await KYC.findAll({
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
      throw new Error(`Error finding KYCs by date range: ${error.message}`);
    }
  }

  /**
   * Update KYC
   * @param {number} id - KYC ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated KYC
   */
  async update(id, updateData) {
    try {
      const kyc = await KYC.findByPk(id);
      if (!kyc) {
        throw new Error("KYC not found");
      }

      await kyc.update(updateData);
      return kyc;
    } catch (error) {
      throw new Error(`Error updating KYC: ${error.message}`);
    }
  }

  /**
   * Update KYC by KYC ID
   * @param {string} kycId - KYC ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated KYC
   */
  async updateByKycId(kycId, updateData) {
    try {
      const kyc = await KYC.findOne({ where: { kycId } });
      if (!kyc) {
        throw new Error("KYC not found");
      }

      await kyc.update(updateData);
      return kyc;
    } catch (error) {
      throw new Error(`Error updating KYC by KYC ID: ${error.message}`);
    }
  }

  /**
   * Update KYC by UID
   * @param {string} uid - User UID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated KYC
   */
  async updateByUid(uid, updateData) {
    try {
      const kyc = await KYC.findOne({ where: { uid } });
      if (!kyc) {
        throw new Error("KYC not found");
      }

      await kyc.update(updateData);
      return kyc;
    } catch (error) {
      throw new Error(`Error updating KYC by UID: ${error.message}`);
    }
  }

  /**
   * Update or create KYC (upsert)
   * @param {Object} criteria - Search criteria
   * @param {Object} kycData - KYC data
   * @returns {Promise<Object>} KYC and created flag
   */
  async upsert(criteria, kycData) {
    try {
      const [kyc, created] = await KYC.findOrCreate({
        where: criteria,
        defaults: kycData,
      });

      if (!created) {
        await kyc.update(kycData);
      }

      return { kyc, created };
    } catch (error) {
      throw new Error(`Error upserting KYC: ${error.message}`);
    }
  }

  /**
   * Update KYC status
   * @param {string} kycId - KYC ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated KYC
   */
  async updateStatus(kycId, status) {
    try {
      return await this.updateByKycId(kycId, { kycStatus: status });
    } catch (error) {
      throw new Error(`Error updating KYC status: ${error.message}`);
    }
  }

  /**
   * Update KRA status
   * @param {string} kycId - KYC ID
   * @param {string} kraStatus - New KRA status
   * @param {Object} kraData - Additional KRA data
   * @returns {Promise<Object>} Updated KYC
   */
  async updateKraStatus(kycId, kraStatus, kraData = {}) {
    try {
      return await this.updateByKycId(kycId, {
        kraStatus,
        ...kraData,
      });
    } catch (error) {
      throw new Error(`Error updating KRA status: ${error.message}`);
    }
  }

  /**
   * Update PAN status
   * @param {string} kycId - KYC ID
   * @param {string} panStatus - New PAN status
   * @param {Object} panData - Additional PAN data
   * @returns {Promise<Object>} Updated KYC
   */
  async updatePanStatus(kycId, panStatus, panData = {}) {
    try {
      return await this.updateByKycId(kycId, {
        panStatus,
        ...panData,
      });
    } catch (error) {
      throw new Error(`Error updating PAN status: ${error.message}`);
    }
  }

  /**
   * Complete KYC
   * @param {string} kycId - KYC ID
   * @param {Object} completionData - Completion data
   * @returns {Promise<Object>} Updated KYC
   */
  async completeKyc(kycId, completionData = {}) {
    try {
      return await this.updateByKycId(kycId, {
        kycStatus: "completed",
        kycCompletedAt: new Date(),
        ...completionData,
      });
    } catch (error) {
      throw new Error(`Error completing KYC: ${error.message}`);
    }
  }

  /**
   * Reject KYC
   * @param {string} kycId - KYC ID
   * @param {string} rejectionReason - Rejection reason
   * @param {string} rejectedBy - Rejected by
   * @returns {Promise<Object>} Updated KYC
   */
  async rejectKyc(kycId, rejectionReason, rejectedBy = null) {
    try {
      return await this.updateByKycId(kycId, {
        kycStatus: "rejected",
        rejectionReason,
        verifiedBy: rejectedBy,
        verifiedAt: new Date(),
      });
    } catch (error) {
      throw new Error(`Error rejecting KYC: ${error.message}`);
    }
  }

  /**
   * Verify KYC
   * @param {string} kycId - KYC ID
   * @param {string} verifiedBy - Verified by
   * @returns {Promise<Object>} Updated KYC
   */
  async verifyKyc(kycId, verifiedBy) {
    try {
      return await this.updateByKycId(kycId, {
        kycStatus: "verified",
        verifiedBy,
        verifiedAt: new Date(),
      });
    } catch (error) {
      throw new Error(`Error verifying KYC: ${error.message}`);
    }
  }

  /**
   * Delete KYC
   * @param {number} id - KYC ID
   * @returns {Promise<boolean>} True if deleted
   */
  async delete(id) {
    try {
      const kyc = await KYC.findByPk(id);
      if (!kyc) {
        throw new Error("KYC not found");
      }

      await kyc.destroy();
      return true;
    } catch (error) {
      throw new Error(`Error deleting KYC: ${error.message}`);
    }
  }

  /**
   * Delete KYC by KYC ID
   * @param {string} kycId - KYC ID
   * @returns {Promise<boolean>} True if deleted
   */
  async deleteByKycId(kycId) {
    try {
      const kyc = await KYC.findOne({ where: { kycId } });
      if (!kyc) {
        throw new Error("KYC not found");
      }

      await kyc.destroy();
      return true;
    } catch (error) {
      throw new Error(`Error deleting KYC by KYC ID: ${error.message}`);
    }
  }

  /**
   * Get KYC with lead
   * @param {string} kycId - KYC ID
   * @returns {Promise<Object|null>} KYC with lead
   */
  async getKycWithLead(kycId) {
    try {
      return await KYC.findOne({
        where: { kycId },
        include: [
          {
            model: Leads,
            as: "lead",
          },
        ],
      });
    } catch (error) {
      throw new Error(`Error getting KYC with lead: ${error.message}`);
    }
  }

  /**
   * Get KYC with activities
   * @param {string} kycId - KYC ID
   * @returns {Promise<Object|null>} KYC with activities
   */
  async getKycWithActivities(kycId) {
    try {
      return await KYC.findOne({
        where: { kycId },
        include: [
          {
            model: LastActivity,
            as: "lastActivities",
          },
          {
            model: ActivityLog,
            as: "activityLogs",
            limit: 20,
            order: [["activity_time", "DESC"]],
          },
        ],
      });
    } catch (error) {
      throw new Error(`Error getting KYC with activities: ${error.message}`);
    }
  }

  /**
   * Get KYC with all relations
   * @param {string} kycId - KYC ID
   * @returns {Promise<Object|null>} KYC with all relations
   */
  async getKycWithAllRelations(kycId) {
    try {
      return await KYC.findOne({
        where: { kycId },
        include: this._getRelationIncludes(),
      });
    } catch (error) {
      throw new Error(`Error getting KYC with all relations: ${error.message}`);
    }
  }

  /**
   * Count KYCs by filters
   * @param {Object} filters - Query filters
   * @returns {Promise<number>} Count of KYCs
   */
  async count(filters = {}) {
    try {
      return await KYC.count({ where: filters });
    } catch (error) {
      throw new Error(`Error counting KYCs: ${error.message}`);
    }
  }

  /**
   * Count KYCs by status
   * @param {string} status - KYC status
   * @returns {Promise<number>} Count of KYCs
   */
  async countByStatus(status) {
    try {
      return await KYC.count({ where: { kycStatus: status } });
    } catch (error) {
      throw new Error(`Error counting KYCs by status: ${error.message}`);
    }
  }

  /**
   * Check if PAN exists
   * @param {string} panNo - PAN number
   * @returns {Promise<boolean>} True if exists
   */
  async existsByPan(panNo) {
    try {
      const count = await KYC.count({ where: { panNo } });
      return count > 0;
    } catch (error) {
      throw new Error(`Error checking PAN existence: ${error.message}`);
    }
  }

  /**
   * Check if client code exists
   * @param {string} clientCode - Client code
   * @returns {Promise<boolean>} True if exists
   */
  async existsByClientCode(clientCode) {
    try {
      const count = await KYC.count({ where: { clientCode } });
      return count > 0;
    } catch (error) {
      throw new Error(`Error checking client code existence: ${error.message}`);
    }
  }

  /**
   * Check if client code exists
   * @param {string} clientCode - Client code
   * @returns {Promise<boolean>} True if exists
   */
  async findPendingKYCByMobileOrEmail(mobile, email) {
    try {
      const count = await KYC.count({
        where: {
          [Op.or]: [
            { mobile },  // matches mobile
            { email }    // matches email
          ],
          kycStatus: "pending" // only pending KYC
        }
      });

      // returns true if at least 1 record exists
      return count > 0;
    } catch (error) {
      throw new Error(`Error checking mobile/email existence in pending kyc: ${error.message}`);
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
        model: LastActivity,
        as: "lastActivities",
      },
      {
        model: ActivityLog,
        as: "activityLogs",
        limit: 20,
        order: [["activity_time", "DESC"]],
      },
    ];
  }
}

export default new KycDB();
