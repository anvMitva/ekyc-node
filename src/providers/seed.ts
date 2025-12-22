/**
 * Provider Database Seed Script
 * Run this to populate initial provider configurations
 * 
 * Usage: npx ts-node --esm src/providers/seed.ts
 */
import { Provider } from "../models/provider/index.js";
import { ekycSequelize } from "../utils/dbConnection.js";

/**
 * Seed data for providers
 */
const seedData = [
  // ==================== KRA Providers ====================
  {
    moduleName: "KRA",
    providerCode: "CAMS",
    providerName: "CAMS KRA",
    enabled: true,
    priority: 1,
    timeout: 30000,
    baseUrl: "https://api.cams.com/v1",
    apiKey: "{{CAMS_API_KEY}}",
    apiSecret: "{{CAMS_API_SECRET}}",
    rateLimit: { maxRequests: 100, perMilliseconds: 60000 },
    retryConfig: { maxRetries: 2, retryableStatusCodes: [408, 429, 500, 502, 503, 504] },
  },
  {
    moduleName: "KRA",
    providerCode: "ONGRID",
    providerName: "Ongrid KRA",
    enabled: true,
    priority: 2,
    timeout: 25000,
    baseUrl: "https://api.ongrid.in",
    apiKey: "{{ONGRID_API_KEY}}",
    apiSecret: "{{ONGRID_CLIENT_ID}}",
    rateLimit: { maxRequests: 50, perMilliseconds: 60000 },
    retryConfig: { maxRetries: 2, retryableStatusCodes: [408, 429, 500, 502, 503, 504] },
  },

  // ==================== SMS Providers ====================
  {
    moduleName: "SMS",
    providerCode: "ONLYSMS",
    providerName: "OnlySMS",
    enabled: true,
    priority: 1,
    timeout: 10000,
    baseUrl: "https://onlysms.co.in/api/otp.aspx",
    apiKey: "{{USERID}}", // Maps to env variable
    apiSecret: "{{USERPASS}}",
    metadata: {
      gsmId: "{{GSMID}}",
      peId: "{{PEID}}",
    },
    rateLimit: { maxRequests: 100, perMilliseconds: 60000 },
  },
  {
    moduleName: "SMS",
    providerCode: "TWOFACTOR",
    providerName: "2Factor.in",
    enabled: true,
    priority: 2,
    timeout: 10000,
    baseUrl: "https://2factor.in",
    apiKey: "{{TWOFACTOR_API_KEY}}",
    rateLimit: { maxRequests: 100, perMilliseconds: 60000 },
  },

  // ==================== Email Providers ====================
  {
    moduleName: "EMAIL",
    providerCode: "SMTP",
    providerName: "SMTP Email",
    enabled: true,
    priority: 1,
    timeout: 15000,
    baseUrl: "smtp://{{SMTP_SERVER}}:{{SMTP_PORT}}",
    apiKey: "{{SMTP_USERNAME}}",
    apiSecret: "{{SMTP_PASSWORD}}",
  },

  // ==================== PAN Providers ====================
  {
    moduleName: "PAN",
    providerCode: "NSDL",
    providerName: "NSDL PAN Verification",
    enabled: true,
    priority: 1,
    timeout: 30000,
    baseUrl: "{{PAN_API_URL}}",
    apiKey: "{{NSDL_API_KEY}}",
    rateLimit: { maxRequests: 50, perMilliseconds: 60000 },
  },
];

/**
 * Run the seed
 */
async function seed(): Promise<void> {
  try {
    console.log("🌱 Starting provider seed...\n");

    // Sync the model (create table if not exists)
    await Provider.sync({ alter: true });
    console.log("✅ Provider table synced\n");

    // Insert or update providers
    for (const data of seedData) {
      const [provider, created] = await Provider.upsert({
        ...data,
        isHealthy: true,
        failureCount: 0,
        circuitBreakerOpen: false,
      } as any, {
        returning: true,
      });

      const status = created ? "Created" : "Updated";
      console.log(`  ${status}: ${data.moduleName} / ${data.providerCode}`);
    }

    console.log("\n✅ Provider seed completed!");
    console.log(`   Total providers: ${seedData.length}`);

  } catch (error) {
    console.error("❌ Seed failed:", (error as Error).message);
    throw error;
  }
}

/**
 * Run seed when executed directly
 */
async function main(): Promise<void> {
  try {
    await ekycSequelize.authenticate();
    console.log("✅ Database connected\n");

    await seed();

    await ekycSequelize.close();
    console.log("\n✅ Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", (error as Error).message);
    process.exit(1);
  }
}

// Export for programmatic use
export { seed, seedData };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  main();
}
