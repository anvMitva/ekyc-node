// @ts-nocheck
import { Leads, OTP, OTPLog, KYC, LastActivity, ActivityLog } from "../../models/index.js";
import { Op } from "sequelize";

/**
 * Database operations for Leads model
 * Handles CRUD operations and relationship management
 */
class LeadsDB {
  /**
   * Create a new lead
   * @param {Object} leadData - Lead data
   * @returns {Promise<Object>} Created lead
   */
  async create(leadData, transaction = null) {
    try {
      const options = transaction ? { transaction } : {};
      const lead = await Leads.create(leadData, options);
      return lead;
    } catch (error) {
      throw new Error(`Error creating lead: ${error.message}`);
    }
  }

  /**
   * Create a new lead with related OTP record
   * @param {Object} leadData - Lead data
   * @param {Object} otpData - OTP data
   * @returns {Promise<Object>} Created lead with OTP
   */
  async createWithOtp(leadData, otpData) {
    try {
      const lead = await Leads.create(leadData);
      const otp = await OTP.create({
        ...otpData,
        uid: lead.uid,
      });
      return { lead, otp };
    } catch (error) {
      throw new Error(`Error creating lead with OTP: ${error.message}`);
    }
  }

  /**
   * Find lead by ID
   * @param {number} id - Lead ID
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} Lead or null
   */
  async findById(id, options = {}) {
    try {
      const { includeRelations = false } = options;
      const include = includeRelations ? this._getRelationIncludes() : [];

      return await Leads.findByPk(id, { include });
    } catch (error) {
      throw new Error(`Error finding lead by ID: ${error.message}`);
    }
  }

  /**
   * Find lead by UID
   * @param {string} uid - Lead UID
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} Lead or null
   */
  async findByUid(uid, options = {}) {
    try {
      const { includeRelations = false } = options;
      const include = includeRelations ? this._getRelationIncludes() : [];

      return await Leads.findOne({
        where: { uid },
        include,
      });
    } catch (error) {
      throw new Error(`Error finding lead by UID: ${error.message}`);
    }
  }

  /**
   * Find lead by mobile
   * @param {string} mobile - Mobile number
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} Lead or null
   */
  async findByMobile(mobile, options = {}) {
    try {
      const { includeRelations = false } = options;
      const include = includeRelations ? this._getRelationIncludes() : [];

      return await Leads.findOne({
        where: { mobile },
        include,
      });
    } catch (error) {
      throw new Error(`Error finding lead by mobile: ${error.message}`);
    }
  }

  /**
   * Find lead by email
   * @param {string} email - Email address
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} Lead or null
   */
  async findByEmail(email, options = {}) {
    try {
      const { includeRelations = false } = options;
      const include = includeRelations ? this._getRelationIncludes() : [];

      return await Leads.findOne({
        where: { email },
        include,
      });
    } catch (error) {
      throw new Error(`Error finding lead by email: ${error.message}`);
    }
  }

  /**
   * Find lead by mobile or email
   * @param {string} mobile - Mobile number
   * @param {string} email - Email address
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} Lead or null
   */
  async findByMobileOrEmail(mobile, email, options = {}) {
    try {
      const { includeRelations = false } = options;
      const include = includeRelations ? this._getRelationIncludes() : [];

      return await Leads.findOne({
        where: {
          [Op.or]: [{ mobile }, { email }],
        },
        include,
      });
    } catch (error) {
      throw new Error(`Error finding lead by mobile or email: ${error.message}`);
    }
  }

  /**
 * Find lead by mobile or email where panStatus or otpStatus is pending
 * @param {string} mobile - Mobile number
 * @param {string} email - Email address
 * @param {Object} options - Query options
 * @returns {Promise<Object|null>} Lead or null
 */
  async findPendingLeadByMobileOrEmail(mobile, email, transaction = null) {
    try {
      const options = {
        where: {
          [Op.and]: [
            { [Op.or]: [{ mobile }, { email }] },
            { [Op.or]: [{ panStatus: "pending" }, { otpStatus: "pending" }] }
          ],
        },
      };

      if (transaction) {
        options.transaction = transaction;
      }

      return await Leads.findOne(options);
    } catch (error) {
      throw new Error(`Error finding pending lead by mobile or email: ${error.message}`);
    }
  }

  /**
   * Find all leads with filters
   * @param {Object} filters - Query filters
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of leads
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

      return await Leads.findAll({
        where: filters,
        include,
        limit,
        offset,
        order,
      });
    } catch (error) {
      throw new Error(`Error finding leads: ${error.message}`);
    }
  }

  /**
   * Find and count all leads with filters
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

      return await Leads.findAndCountAll({
        where: filters,
        include,
        limit,
        offset,
        order,
      });
    } catch (error) {
      throw new Error(`Error finding and counting leads: ${error.message}`);
    }
  }

  /**
   * Find leads by RM code
   * @param {string} rmCode - RM code
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of leads
   */
  async findByRmCode(rmCode, options = {}) {
    try {
      return await this.findAll({ rmCode }, options);
    } catch (error) {
      throw new Error(`Error finding leads by RM code: ${error.message}`);
    }
  }

  /**
   * Find leads by AP code
   * @param {string} apCode - AP code
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of leads
   */
  async findByApCode(apCode, options = {}) {
    try {
      return await this.findAll({ apCode }, options);
    } catch (error) {
      throw new Error(`Error finding leads by AP code: ${error.message}`);
    }
  }

  /**
   * Update lead
   * @param {number} id - Lead ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated lead
   */
  async update(id, updateData) {
    try {
      const lead = await Leads.findByPk(id);
      if (!lead) {
        throw new Error("Lead not found");
      }

      await lead.update(updateData);
      return lead;
    } catch (error) {
      throw new Error(`Error updating lead: ${error.message}`);
    }
  }

  /**
   * Update lead by UID
   * @param {string} uid - Lead UID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated lead
   */
  async updateByUid(uid, updateData, transaction = null) {
    try {
      const findOptions = transaction ? { where: { uid }, transaction } : { where: { uid } };
      const lead = await Leads.findOne(findOptions);
      if (!lead) {
        throw new Error("Lead not found");
      }

      const updateOptions = transaction ? { transaction } : {};

      await lead.update(updateData, updateOptions);
      return lead;
    } catch (error) {
      throw new Error(`Error updating lead by UID: ${error.message}`);
    }
  }

  /**
   * Update or create lead (upsert)
   * @param {Object} criteria - Search criteria
   * @param {Object} leadData - Lead data
   * @returns {Promise<Object>} Lead and created flag
   */
  async upsert(criteria, leadData) {
    try {
      const [lead, created] = await Leads.findOrCreate({
        where: criteria,
        defaults: leadData,
      });

      if (!created) {
        await lead.update(leadData);
      }

      return { lead, created };
    } catch (error) {
      throw new Error(`Error upserting lead: ${error.message}`);
    }
  }

  /**
   * Upsert lead with transaction support
   * Finds existing lead by mobile or email and updates it, or creates new lead
   * @param {string} mobile - Mobile number
   * @param {string} email - Email address
   * @param {Object} leadData - Lead data to insert/update
   * @param {Object} transaction - Sequelize transaction object (optional)
   * @returns {Promise<Object>} { lead, created, updated }
   */
  async upsertLeadWithTransaction(mobile, email, leadData, transaction = null) {
    try {
      // Find existing lead by mobile or email
      const existingLead = await Leads.findOne({
        where: {
          [Op.or]: [{ mobile }, { email }],
        },
        transaction,
      });

      if (existingLead) {
        // Update existing lead (remove uid from update to preserve existing uid)
        const { uid, ...updateData } = leadData;
        await existingLead.update(updateData, { transaction });
        return { 
          lead: existingLead, 
          created: false, 
          updated: true 
        };
      } else {
        // Create new lead with uid
        const newLead = await Leads.create(leadData, { transaction });
        return { 
          lead: newLead, 
          created: true, 
          updated: false 
        };
      }
    } catch (error) {
      throw new Error(`Error upserting lead with transaction: ${error.message}`);
    }
  }

  /**
   * Delete lead
   * @param {number} id - Lead ID
   * @returns {Promise<boolean>} True if deleted
   */
  async delete(id) {
    try {
      const lead = await Leads.findByPk(id);
      if (!lead) {
        throw new Error("Lead not found");
      }

      await lead.destroy();
      return true;
    } catch (error) {
      throw new Error(`Error deleting lead: ${error.message}`);
    }
  }

  /**
   * Delete lead by UID
   * @param {string} uid - Lead UID
   * @returns {Promise<boolean>} True if deleted
   */
  async deleteByUid(uid) {
    try {
      const lead = await Leads.findOne({ where: { uid } });
      if (!lead) {
        throw new Error("Lead not found");
      }

      await lead.destroy();
      return true;
    } catch (error) {
      throw new Error(`Error deleting lead by UID: ${error.message}`);
    }
  }

  /**
   * Soft delete (if implementing soft delete pattern)
   * @param {number} id - Lead ID
   * @returns {Promise<Object>} Updated lead
   */
  async softDelete(id) {
    try {
      return await this.update(id, { deletedAt: new Date() });
    } catch (error) {
      throw new Error(`Error soft deleting lead: ${error.message}`);
    }
  }

  /**
   * Get lead with all OTP records
   * @param {string} uid - Lead UID
   * @returns {Promise<Object|null>} Lead with OTPs
   */
  async getLeadWithOtps(uid) {
    try {
      return await Leads.findOne({
        where: { uid },
        include: [
          {
            model: OTP,
            as: "otps",
            include: [
              {
                model: OTPLog,
                as: "logs",
              },
            ],
          },
        ],
      });
    } catch (error) {
      throw new Error(`Error getting lead with OTPs: ${error.message}`);
    }
  }

  /**
   * Get lead with KYC details
   * @param {string} uid - Lead UID
   * @returns {Promise<Object|null>} Lead with KYC
   */
  async getLeadWithKyc(uid) {
    try {
      return await Leads.findOne({
        where: { uid },
        include: [
          {
            model: KYC,
            as: "kyc",
            include: [
              {
                model: LastActivity,
                as: "lastActivities",
              },
              {
                model: ActivityLog,
                as: "activityLogs",
                limit: 10,
                order: [["activity_time", "DESC"]],
              },
            ],
          },
        ],
      });
    } catch (error) {
      throw new Error(`Error getting lead with KYC: ${error.message}`);
    }
  }

  /**
   * Get lead with all related data
   * @param {string} uid - Lead UID
   * @returns {Promise<Object|null>} Lead with all relations
   */
  async getLeadWithAllRelations(uid) {
    try {
      return await Leads.findOne({
        where: { uid },
        include: this._getRelationIncludes(),
      });
    } catch (error) {
      throw new Error(`Error getting lead with all relations: ${error.message}`);
    }
  }

  /**
   * Count leads by filters
   * @param {Object} filters - Query filters
   * @returns {Promise<number>} Count of leads
   */
  async count(filters = {}) {
    try {
      return await Leads.count({ where: filters });
    } catch (error) {
      throw new Error(`Error counting leads: ${error.message}`);
    }
  }

  /**
   * Check if lead exists by mobile
   * @param {string} mobile - Mobile number
   * @returns {Promise<boolean>} True if exists
   */
  async existsByMobile(mobile) {
    try {
      const count = await Leads.count({ where: { mobile } });
      return count > 0;
    } catch (error) {
      throw new Error(`Error checking lead existence by mobile: ${error.message}`);
    }
  }

  /**
   * Check if lead exists by email
   * @param {string} email - Email address
   * @returns {Promise<boolean>} True if exists
   */
  async existsByEmail(email) {
    try {
      const count = await Leads.count({ where: { email } });
      return count > 0;
    } catch (error) {
      throw new Error(`Error checking lead existence by email: ${error.message}`);
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
        as: "otps",
        include: [
          {
            model: OTPLog,
            as: "logs",
          },
        ],
      },
      {
        model: OTPLog,
        as: "otpLogs",
      },
      {
        model: KYC,
        as: "kyc",
        include: [
          {
            model: LastActivity,
            as: "lastActivities",
          },
          {
            model: ActivityLog,
            as: "activityLogs",
          },
        ],
      },
      {
        model: LastActivity,
        as: "lastActivities",
      },
      {
        model: ActivityLog,
        as: "activityLogs",
      },
    ];
  }
}

export default new LeadsDB();
