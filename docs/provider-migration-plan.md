# Provider Services TypeScript Migration Plan

## Overview
Migration of provider service files from JavaScript to TypeScript, removing `@ts-nocheck` and adding proper type definitions based on the patterns in `client.service.ts`.

## Reference Standards (from client.service.ts)
- Use `type` for simple type aliases and `interface` for objects
- Use `Nullable<T>` pattern for nullable types
- Proper async/return type annotations
- Explicit parameter types with interfaces
- Use union types for enums where appropriate
- Proper error handling with ApiError type
- Logger with typed metadata objects

---

## File 1: email.service.ts

### Current State
- Uses `@ts-nocheck`
- Class-based singleton pattern
- Methods lack type annotations
- Config and templates untyped

### Changes Required

#### 1. Type Definitions Needed
```typescript
// Config types
interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  protocol: string;
  mailType: string;
  charset: string;
  wordwrap: boolean;
}

interface AuthConfig {
  user: string;
  pass: string;
}

interface EmailConfig {
  smtp: SmtpConfig;
  auth: AuthConfig;
  from: string;
}

// Template types
interface EmailTemplate {
  subject: string;
  template: string;
}

interface EmailTemplates {
  [key: string]: EmailTemplate;
}

// Response types
interface EmailSendResult {
  success: boolean;
  status: 'success' | 'error';
  message: string;
  data?: {
    messageId: string;
    accepted: string[];
    rejected: string[];
  };
  duration: number;
}

interface EmailHealthStatus {
  service: string;
  provider: string;
  status: string;
  config: {
    host: string;
    port: number;
    secure: boolean;
    from: string;
  };
  templates: string[];
}

interface EmailContentResult {
  subject: string;
  htmlContent: string;
}

// Metadata types
interface EmailMetadata {
  uid?: string;
  ip?: string;
  userAgent?: string;
  [key: string]: any;
}

// Log data types
interface EmailLogData {
  toEmail: string;
  templateType: string;
  response?: {
    messageId?: string;
    response?: string;
    accepted?: string[];
    rejected?: string[];
  };
  error?: {
    message: string;
    stack?: string;
  };
  status: 'success' | 'failed';
  duration: number;
  [key: string]: any;
}

// Nodemailer types
interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename?: string;
    path?: string;
    content?: Buffer | string;
    contentType?: string;
  }>;
}

interface SendMailResult {
  messageId: string;
  response: string;
  accepted: string[];
  rejected: string[];
}
```

#### 2. Method Signatures
```typescript
class EmailService {
  private config: EmailConfig;
  private templates: EmailTemplates;
  private transporter: nodemailer.Transporter | null;

  constructor()
  
  private _getTransporter(): nodemailer.Transporter
  
  private _buildEmailContent(templateType: string, data: Record<string, any>): EmailContentResult
  
  private async _logApiCall(logData: EmailLogData): Promise<void>
  
  async sendEmail(
    toEmail: string,
    templateType: string,
    data?: Record<string, any>,
    metadata?: EmailMetadata
  ): Promise<EmailSendResult>
  
  async sendSignupEmail(
    toEmail: string,
    otp: string,
    metadata?: EmailMetadata
  ): Promise<EmailSendResult>
  
  async sendCustomEmail(
    toEmail: string,
    subject: string,
    htmlContent: string,
    attachments?: Array<any>,
    metadata?: EmailMetadata
  ): Promise<EmailSendResult>
  
  validateEmail(email: string): boolean
  
  async verifyConnection(): Promise<EmailSendResult>
  
  getHealthStatus(): EmailHealthStatus
  
  getAvailableTemplates(): string[]
  
  close(): void
}
```

#### 3. Import Updates
- Add: `import type { Transporter } from "nodemailer";`
- Ensure logger types are imported properly

---

## File 2: sms.service.ts

### Current State
- Uses `@ts-nocheck`
- Class-based singleton pattern
- Methods lack type annotations
- Template functions untyped

### Changes Required

#### 1. Type Definitions Needed
```typescript
// Config types
interface SmsCredentials {
  USER_ID: string;
  USER_PASS: string;
  GSM_ID: string;
  PE_ID: string;
}

interface SmsConfig {
  userId: string;
  userPass: string;
  gsmId: string;
  peId: string;
  baseUrl: string;
  unicode: string;
  timeout: number;
  provider: string;
}

// Template types
type SmsTemplateFunction = (value: string) => string;

interface SmsTemplates {
  [key: string]: SmsTemplateFunction;
}

interface SmsTemplateIds {
  [key: string]: string;
}

// Response types
interface SmsSendResult {
  success: boolean;
  data?: any;
  error?: string;
  statusCode?: number;
  duration: number;
}

interface SmsHealthStatus {
  service: string;
  provider: string;
  status: string;
  config: {
    baseUrl: string;
    gsmId: string;
    peId: string;
  };
  templates: string[];
}

// Metadata types
interface SmsMetadata {
  uid?: string;
  ip?: string;
  userAgent?: string;
  [key: string]: any;
}

// Log data types
interface SmsLogData {
  mobile: string;
  type: string;
  payload: {
    mobileNumber: string;
    otp: string;
    type: string;
    message?: string;
    tempId?: string;
    timestamp: string;
  };
  response: any;
  error: {
    message: string;
    stack?: string;
    code?: string;
    response?: any;
  } | null;
  status: 'success' | 'failed';
  statusCode: number;
  duration: number;
  ip: string | null;
  userAgent: string | null;
  uid: string | null;
}

// SMS Types
type SmsType = 'signup' | 'mobile' | 'bankUpdate' | 'password' | 'edis' | 'ipvLink' | 'default';
```

#### 2. Method Signatures
```typescript
class SmsService {
  private config: SmsConfig;
  private messageTemplates: SmsTemplates;
  private templateIds: SmsTemplateIds;

  constructor()
  
  private _getMessageTemplate(type: SmsType, value: string): string
  
  private _getTemplateId(type: SmsType): string
  
  private _buildApiUrl(mobileNumber: string, message: string, tempId: string): string
  
  private async _logApiCall(logData: SmsLogData): Promise<void>
  
  async sendSms(
    mobileNumber: string,
    otp: string,
    type?: SmsType,
    metadata?: SmsMetadata
  ): Promise<SmsSendResult>
  
  async sendOtp(
    mobileNumber: string,
    otp: string,
    type?: SmsType
  ): Promise<SmsSendResult>
  
  async sendSignupOtp(
    mobileNumber: string,
    otp: string,
    metadata?: SmsMetadata
  ): Promise<SmsSendResult>
  
  async sendMobileUpdateOtp(
    mobileNumber: string,
    otp: string,
    metadata?: SmsMetadata
  ): Promise<SmsSendResult>
  
  async sendBankUpdateOtp(
    mobileNumber: string,
    otp: string,
    metadata?: SmsMetadata
  ): Promise<SmsSendResult>
  
  async sendPasswordResetOtp(
    mobileNumber: string,
    otp: string,
    metadata?: SmsMetadata
  ): Promise<SmsSendResult>
  
  async sendEdisOtp(
    mobileNumber: string,
    otp: string,
    metadata?: SmsMetadata
  ): Promise<SmsSendResult>
  
  async sendIpvLink(
    mobileNumber: string,
    link: string,
    metadata?: SmsMetadata
  ): Promise<SmsSendResult>
  
  async sendCustomSms(
    mobileNumber: string,
    message: string,
    tempId: string,
    metadata?: SmsMetadata
  ): Promise<SmsSendResult>
  
  validateMobileNumber(mobileNumber: string): boolean
  
  getHealthStatus(): SmsHealthStatus
  
  getAvailableTypes(): Record<string, SmsType>
}
```

#### 3. Import Updates
- Add: `import type { AxiosResponse } from "axios";`

---

## File 3: kyc.service.ts

### Current State
- Uses `@ts-nocheck`
- Function-based exports
- No type annotations
- Complex database queries untyped

### Changes Required

#### 1. Type Definitions Needed
```typescript
// Nullable helper
type Nullable<T> = T | null;

// Database result types
interface KycRecord {
  [key: string]: any;
}

interface ClientKycResult {
  clientId: string;
  [key: string]: any;
}

// Function parameter types
interface GetClientKycParams {
  clientId: string;
  bypassCache?: boolean;
}

interface InsertClientKycParams {
  clientId: string;
}

// API Response types
interface ApiResponse<T = any> {
  statusCode: number;
  message?: string;
  data?: T;
}

// GeoLocation helper type (if needed)
interface GeoLookupResult {
  range?: [number, number];
  country?: string;
  region?: string;
  city?: string;
  ll?: [number, number];
  metro?: number;
  area?: number;
  timezone?: string;
  country_iso_code?: string;
  region_name?: string;
}
```

#### 2. Function Signatures
```typescript
export async function getClientKyc(
  clientId: string,
  bypassCache?: boolean
): Promise<ClientKycResult[]>

export async function insertClientKyc(
  clientId: string
): Promise<void>
```

#### 3. Import Updates
- Add missing imports: `import axios from "axios";`
- Add: `import { ApiError } from "../../utils/ApiError.js";`
- Ensure all db imports are typed

---

## Migration Execution Order

1. ✅ **email.service.ts** - Independent, no dependencies on other providers
2. ✅ **sms.service.ts** - Independent, no dependencies on other providers  
3. ✅ **kyc.service.ts** - May use cache/client services (already typed)

## Testing Checklist (for each file)

- [ ] File compiles without `@ts-nocheck`
- [ ] No TypeScript errors in VS Code
- [ ] All imports resolve correctly
- [ ] Return types match expected interfaces
- [ ] Error handling preserves ApiError types
- [ ] Logger calls have proper metadata types
- [ ] Singleton/export patterns maintain compatibility

## Post-Migration Tasks

1. Update `migration-status.md` - Mark providers as "Completed"
2. Update `migration-log.md` - Add entry for provider migrations
3. Run type check: `npx tsc --noEmit`
4. Test builds successfully
5. Verify no runtime regressions

---

## Notes

- Follow `client.service.ts` patterns for consistency
- Use `Nullable<T>` for optional/null values
- Prefer `interface` for complex objects
- Keep metadata objects flexible with index signatures
- Ensure backward compatibility with existing callers
- All async functions should have explicit Promise return types
