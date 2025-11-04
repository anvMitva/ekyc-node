// @ts-nocheck
import { getIniPath, getPath } from "./utils.js";

export const HEADER_USER_AGENT = { 'User-Agent': 'Mozilla/5.0' }
export const CONTENT_TYPE = 'application/json'
export const PROJECT = 'connect-arham-backend'
export const CONNECT = 'connect'
export const CONNECT_APP = 'connect_app'
export const NSDL = 'nsdl'
export const CDSL = 'cdsl'
export const APB = 'ap'
export const ERP = 'erp'
export const ERP_CLIENT = 'erp_client'
export const TRADING_APP = 'trading_app'
export const ARHAM_PNL_LINK = 'web'
export const APB_LINK = 'apb_link'
export const AADHAR = 'AADHAR'
export const PAN = 'PAN'
export const OK = 'ok'
export const CWT = 'close-with-transfer'
export const NORMAL_CLOSE = 'close'
export const NB = 'nb'
export const UPI = 'upi'
export const MTF = 'mtf'
export const FO = 'fo'
export const ESIGN_TICK = 'tick.jpg'
export const ESIGN_JAR = 'Multi_esign2.1.jar'
export const ACC_CLS_COORDINATE = 'acc_close_coordinates.txt'
export const ACC_CLS_WTS_COORDINATE = 'acc_close_with_transfer_coordinates.txt'
export const PROFILE_MODIFICATION_COORDINATE = 'profile_modification_coordinates.txt'
export const NOMINEE_MODIFICATION_COORDINATE = 'nominee_coordinates.txt'
export const CERTIFICATE = 'Arham.pfx'
export const ESIGN_ERROR_TEMPLATE = 'error'
export const ESIGN_SUCCESS_TEMPLATE = 'index'
export const DEFAULT_BANK_RESPONSE = 'tech_push_default_bank_response.txt'
export const QUICK_LINK_MTF_FILE = 'approved_mtf_list.xlsx'
export const QUICK_LINK_FO_FILE = 'approved_fo_list.xlsx'
export const PROFILE_MODIFICATION = 'profile_modification.pdf'
export const PROFILE_MODIFICATION_ESIGNREQUEST = 'profile_modification_eSignRequestXml.txt'
export const PROFILE_MODIFICATION_RESPONSE = 'profile_modification_response.txt'
export const PROFILE_MODIFICATION_ESIGN_LOG = 'profile_modification_esignlog.txt'
export const PROFILE_MODIFICATION_FINAL_SIGNED = 'profile_modification_signedFinal.pdf'

export const SOURCE_ACC_CLS_PDF = 'Documents/AccClose_new/arhamshare_close_account.pdf'
export const SOURCE_MODIFICATION_MOBILE_PDF = 'Documents/Modification_new/acc_details_modification_Addition_AS.pdf'
export const SOURCE_MODIFICATION_EMAIL_PDF = 'Documents/Modification_new/acc_details_email_modification_Addition_AS.pdf'
export const SOURCE_MODIFICATION_INCOME_PDF = 'Documents/Modification_new/income_AccountDetailsAddition_Arhamshare.pdf'
export const SOURCE_MODIFICATION_SEGMENT_PDF = 'Documents/Modification_new/arhm_segment_addtion.pdf'
export const SOURCE_MODIFICATION_BANK_PDF = 'Documents/Modification_new/AccountDetailsAddition.pdf'
export const SOURCE_MODIFICATION_NOMINEE_PDF = 'Documents/Modification_new/add_nominee.pdf'

export const PROFILE_MODIFICATION_OUTPUT_FILE_PATH = 'Downloads/FinalOutput/ProfileModidfication'
export const BANK_ADDITION_OUTPUT_FILE_PATH = 'Downloads/FinalOutput/BankAddition'
export const SEGMENT_ADDITION_OUTPUT_FILE_PATH = 'Downloads/FinalOutput/SegmentAddition'
export const NOMINEE_ADDITION_OUTPUT_FILE_PATH = 'Downloads/FinalOutput/Nominee_Addition'
export const INCOME_MODIFICATION_OUTPUT_FILE_PATH = 'Downloads/FinalOutput/IncomeModification'
export const ACCOUNT_CLOSE_OUTPUT_FILE_PATH = 'Downloads/FinalOutput/AccountClouser'
export const EMANDATE_PHYSICAL_OUTPUT_FILE_PATH = 'Downloads/FinalOutput/Emandate'
export const PNL_OUTPUT_FILE_PATH = 'Downloads/PNL'

export const HOLDING_PDF = 'Downloads/Reports/Holdings'
export const POSITION_PDF = 'Downloads/Reports/Position'
export const esignDocsPath = 'Documents/EsignDocuments'
export const coordinatePath = 'Documents/EsignDocuments/Coordinates'
export const MTF_COORDINATE = 'mtf_coordinates.txt'

export const BANK_ADDITION = 'bank_addition.pdf'
export const BANK_ADDITION_ESIGNREQUEST = 'bank_addition_eSignRequestXml.txt'
export const BANK_ADDITION_RESPONSE = 'bank_addition_response.txt'
export const BANK_ADDITION_ESIGN_LOG = 'bank_addition_esignlog.txt'
export const BANK_ADDITION_FINAL_SIGNED = 'bank_addition_signedFinal.pdf'
export const SEGMENT_ADDITION = 'segment_addition.pdf'
export const SEGMENT_ADDITION_ESIGNREQUEST = 'segment_addition_eSignRequestXml.txt'
export const SEGMENT_ADDITION_RESPONSE = 'segment_addition_response.txt'
export const SEGMENT_ADDITION_ESIGN_LOG = 'segment_addition_esignlog.txt'
export const SEGMENT_ADDITION_FINAL_SIGNED = 'segment_addition_signedFinal.pdf'
export const NET_WORTH_CERTIFICATE = "Net-worth Certificate"
export const ITR_AKN = "ITR acknowledgment"
export const LATEST_DEMATE_HOLDING_STATEMENT = "Latest Demat Holding Statement"
export const ANNUAL_ACC = "Annual Accounts"
export const LATEST_SALARY = "Latest Salary Slip OR Latest Form 16"
export const BANK_ACC_STATEMENT_6_MONTH = "Bank A/c Statement for last 6 months"
export const INCOME_MODIFICATION = "income_modification.pdf"
export const NOMINEE_ADDITION = 'nominee_addition.pdf'
export const NOMINEE_ADDITION_ESIGNREQUEST = 'nominee_addition_eSignRequestXml.txt'
export const NOMINEE_ADDITION_RESPONSE = 'nominee_addition_response.txt'
export const NOMINEE_ADDITION_ESIGN_LOG = 'nominee_addition_esignlog.txt'
export const NOMINEE_ADDITION_FINAL_SIGNED = 'nominee_addition_signedFinal.pdf'
export const EMNDATE_PHYSICAL_OUTPUT_FILE_NAME = 'physical_emandate.pdf'
export const ACC_CLOSE_PDF = 'acc_close.pdf'
export const ACC_CLOSE_ESIGNREQUEST = 'acc_close_eSignRequestXml.txt'
export const ACC_CLOSE_RESPONSE = 'acc_close_response.txt'
export const ACC_CLOSE_ESIGN_LOG = 'acc_close_esignlog.txt'
export const ACC_CLOSE_FINAL_SIGNED = 'acc_close_signedFinal.pdf'

// MTF Constants
export const MTF_PDF_FILE_NAME = 'MTF_Individual.pdf'
export const MTF_OUTPUT_FILE_PATH = 'Downloads/FinalOutput/MTF'
export const MTF_ESIGN_RESPONSE = 'MTF_Individual_response.txt'
export const MTF_ESIGN_LOG = 'MTF_Individual_esignlog.txt'
export const MTF_FINAL_SIGNED = 'MTF_Individual_signedFinal.pdf'
export const MTF_ESIGNREQUEST = 'MTF_Individual_eSignRequestXml.txt'
export const SOURCE_MTF_PDF = 'Documents/MTF/MTF_Individual.pdf'
export const ARHAM_STEMP = 'Documents/img/Stemp.png'


export const CASH = "Cash"
export const CD = "Currency Derivatives"
export const FNO = "Future & Options"
export const MF = "Mutual fund"
export const SLBM = "SLBM"
export const FALSE = "False"
export const TRUE = "True"
export const YES = 'Yes'
export const NO = 'No'
export const FETCHONE = 'fetchone'
export const FETCHALL = 'fetchall'
export const APPROVE = 'approve'
export const REJECT = 'reject'
export const SUCCESS = 'success'
export const PENDING = 'Pending'
export const FAILED = 'failed'
export const ERROR = 'Error'
export const SEND_OTP = 'send_otp'
export const coordinatetxtfile = 'coordinates.txt'
export const VERIFY_OTP = 'verify_otp'
export const RESEND_OTP = 'resend_otp'
export const SEND_OTP_ERP = 'Send'
export const VERIFY_OTP_ERP = 'Verified'
export const MOBILE = 'mobile'
export const EMAIL = 'email'
export const INCOME = 'income'
export const BANKUPDATE = 'bankUpdate'
export const SEGMENT = 'segment'
export const NOMINEE = 'nominee'
export const ACC_CLOSE = 'acc_close'
export const RE_KYC = 're_kyc'
export const ACC_CLOSE_WITH_TRANSFER = 'acc_close_with_transfer'
export const ADMIN = 'ADMIN'
export const PASSWORD = 'password'
export const RESET_PASSWORD_LINK = "http://192.168.102.146:3007/erp/change-password?:userId={{uid}}"
export const FORGOT_EMAIL = "forgot mail"
export const EMPLOYEE_CREATION = "employee_creation"
export const ESIGN_REDIRECT_LINK = "{{url}}/profile?redirected=true"
export const SEGMENT_LINK = "{{url}}segment-addition/verification?id={{uid}}&segment={{encode_segment}}"
export const SEGMENT_EMAIL = "Segment Addition"
export const EMAIL_MODIFICATION_MAIL = "email_verification"
export const OTP_MESSAGE = "Dear User, Kindly signup on ArhamShare using this OTP - {sent_mobile_otp}. For security reasons, ensure you don't share your OTP with anyone ARHAM SHARE."
export const MOBILE_OTP_MESSAGE = "Dear Customer, Kindly proceed to update your Mobile no by using this OTP - {sent_mobile_otp}. For security reasons, ensure you don't share your OTP with anyone. Arham Share"
export const BANK_OTP_MESSAGE = "Dear Customer, Kindly proceed to update your Bank details by using this OTP - {sent_mobile_otp}. For security reasons, ensure you don't share your OTP with anyone. Arham Share"
export const PASSWORD_OTP_MESSAGE = "Dear customer, Your OTP for password reset request is {sent_mobile_otp}. This code will be valid for 5 mins only. Kindly do not share this with anyone. ARHAM SHARE"
export const PDF = 'PDF'
export const EXCEL = 'Excel'
export const XLS = 'XLS'
export const SPDF = 'pdf'
export const FUND_PAYOUT = 'fund_payout'
export const FUND_PAYIN = 'fund_payin'

// AtomPay Payment Gateway Constants
export const ATOMPAY_GATEWAY_URL = 'https://payment.atomtech.in/paynetz/epi/fts'
export const ATOMPAY_TRANSACTION_TYPE = 'NBFundTransfer'
export const ATOMPAY_CURRENCY = 'INR'
export const ATOMPAY_MIN_AMOUNT = 100.00
export const ATOMPAY_UPI_MODE = 'UP|SMSUPI'

// Payment Types
export const PAYMENT_TYPE_NB = 'NB'
export const PAYMENT_TYPE_UPI = 'UPI'

export const ADDRESS = [
   "Regd. Off.: U-8, Jolly Plaza, Athvagate, SURAT-395001.",
   "Tel: 0261-6794000, Fax : 0261-2471060, Email: contact@arhamshare.com,",
   "Website: www.arhamshare.com, SEBI Regi. No:BSE & NSE :INZ000175534",
   "CIN: U67120GJ2010PTC061501, GST Location: Gujarat",
   "Grievances ID: grievances@arhamshare.com",
   "Compliance Officer : Priyank Mehta, Tel.: 0261-6794000, Email Id: mehta_priyank@ymail.com"
]
export const POA_NAME = 'ARHAM SHARE PRIVATE LIMITED ( CDSL)'
export const POA_ID = '2207170000000011'
export const DP_ID = '2207170000000155'
export const HOLDER_NAME = 'First Holder Name'
export const HOLDER_PAN = 'First Holder PAN'
export const DATE_OF_BIRTH = 'Date of Birth'
export const SECOND_PAN = 'Second Holder PAN'
export const SECOND_NAME = 'Second Holder Name'
export const THIRD_NAME = 'Third Holder Name'
export const THIRD_PAN = 'Third Holder PAN'
export const GUARDIAN_PAN = 'Guardian PAN'
export const GUARDIAN_NAME = 'Guardian Name'
export const HUF_NAME = 'HUF Name'
export const HUF_PAN = 'HUF PAN'
export const HUF_DOB = 'Date of Incorporation'
export const KARTA_NAME = 'Karta Name'
export const HUF_S = "huf"
export const MINOR = "minor"
export const ELECTRONIC = 'Electronic'
export const FONT_FILE = "C:/Windows/Fonts/arial.ttf"
export const PDFS = 'Pdfs'
export const DOCUMENTS = 'Documents'
export const ARIAL_BOLD = 'Arial-Bold'
export const HELVETICA_BOLD = "Helvetica-Bold"
export const FIRST_HOLDER = "First Holder"
export const SECOND_HOLDER = "Second Holder"
export const THIRD_HOLDER = "Third Holder"
export const ZIP_PDFS = 'zip_pdfs'
export const POA_DETAILS = "POA Details"
export const HC_OK = 200
export const HC_CREATED = 201
export const HC_BAD_REQUEST = 400
export const HC_UNAUTHORISED = 401
export const HC_FORBIDDEN = 403
export const HC_PAGE_NOT_FOUND = 404
export const HC_TOO_MANY_REQUESTS = 429
export const HC_INTERNAL_SERVER_ERROR = 500
export const HC_NOT_ACCEPTABLE = 406
export const HEM_MAC_NOT_MATCHED = "Access denied for this device"
export const HEM_EMAIL_EXISTS = "Email already exist"
export const HEM_USERNAME_EXISTS = "Username already exist"
export const HEM_USERNAME_LENGTH = "Username must have 3 or more charachter"
export const HEM_USERNAME_ALPHANUMERIC = "Username must be in alphanumeric"
export const HEM_VERIFY_EMAIL = "Please verify email"
export const HEM_EMAIL_FORMAT = "Incorrect email format"
export const HEM_PASSWORD_LENGTH = "Password must be 8 or more than 8 character"
export const HEM_PHONE_NO_LENGTH = "Phone number must be 10 digits"
export const HEM_SERVER_ERROR = "Internal server Error"
export const HEM_TIMEOUT_ERROR = "Request Timeout Error"
export const HEM_INVALID_CREDENTIAL = "Invalid Credential"
export const HEM_INVALID_ACC_CREDENTIAL = "Account closed Already."
export const HEM_INVALID_DATE = "Invalid date"
export const HEM_TOKEN_EXPIRED = "Token expired"
export const HEM_TOKEN_INVALID = "Invalid token"
export const HEM_USERTYPE_INVALID = "Usertype invalid"
export const HEM_OTP_INVALID = "Invalid OTP."
export const HEM_OTP_REQ = "OTP Request is not Valid"
export const HEM_DOWNLOAD_FAIL = "Failed to download the file"
export const HEM_DATA_NOT_FOUND = "data not found"
export const HEM_FILE_NOT_UPLOADED = "Please, Upload File."
export const HEM_FILE_SIZE_LIMIT_EXCEEDS = 'File size exceeds the 20MB limit.'
export const HEM_NOT_INCOME = "Please, select income."
export const HEM_FILE_EXISTS = "File already exists"
export const HEM_SERVICE_ALREADY_START = "service already start"
export const HEM_NO_LOG_AVAILABLE = "no log available"
export const HEM_PAGE_NOT_FOUND = 'Page not found.'
export const HEM_NO_VALID_PAN = "pan number is not in valid format"
export const HEM_NOMINEE_PAN = "nominee Pan is required. try again."
export const HEM_TOTAL_SHARE_PERCENTAGE = "total share percentage must 100 and zero share_percentage is not allowed"
export const HEM_INCORRECT_SEGMENT = "Select from eq, fno, cds, ledger or pnl"
export const HEM_EXCEL_GENERATE_ERROR = "Can't Generate EXCEL Report right now. Try again in some time."
export const HEM_FILE_GENERATE_ERROR = "Can't Generate This Report right now. Try again later"
export const HEM_UNDEFINED_SEGMENT = "This segment is not defined."
export const HEM_NOMINEE_SELECT = "Nominee Selection YES or NO"
export const HEM_NO_XTS_PUSH = "Couldn't find data."
export const HEM_NO_TOKEN = "Couldn't get token."
export const HEM_FLOAT_QTY = "Pledge quantity cannot be a float."
export const HEM_CAN_NOT_PUSH = "Will not Push in xts because status code is not 0."
export const HEM_NO_BANK = "Selected bank is not supported."
export const HEM_UPLOAD_FILE = "Please, Upload file"
export const HEM_NO_DATA = "data not found"
export const HEM_INCORRECT_PROOF = "Enter Correct AADHAR or PAN number"
export const HEM_DEFAULT_BANK_EXIST = "This Bank is already set as Default Bank."
export const HEM_NOT_CLOSE_ACCOUNT = "Please ensure your ledger, holding, virtual debit, and cdsl debit are 0 before proceeding!"
export const HEM_NOT_APPROVED = "This Scrip is not approved. Kindly Select another scrip!"
export const HEM_INVALID_QTY = "Invalid QTY!"
export const HEM_SELECT_SEGMENT = "Please, select  least one segment."
export const HEM_SELECT_PLEDGE = "At least select one script."
export const HEM_MINOR_CLIENT = "Client is Minor. Please upload Proof!"
export const HEM_AMOUNT_NEEDED = 'Amount must be greater then 100.00 or  equal to 100.00.'
export const HEM_AMOUNT_FLOAT = 'Amount must be in float and 2 digit after point ex:100.00'
export const HEM_NOT_FORMMATED = "Uploaded file must be in '.pdf', '.png', '.jpg', '.jpeg'"
export const HEM_INVALID_ACC = "Invalid Account details. Please enter correct account details!"
export const HEM_PENNY_FAILED = "Penny Drop Verification Failed. Please contact the administrator!"
export const HEM_NO_DATA_CLIENTID = 'There is no data in this client id.'
export const HEM_UNDER_PROCESS = "Your modification process in progress."
export const HEM_LONG_ADDRESS_SIZE = "Address size should be less then 29 letters"
export const HEM_PASSWORD_PROTECT = "Can not Upload Password Protected file."
export const HEM_MODIFICATION_PROC_PENDING = "Your modification process in progress."
export const HEM_ESIGN_PENDING = "Your Esing Pending."
export const HEM_INVALID_PREFERENCE = 'Invalid Segments.'
export const HEM_SEGMENT_EXIST = 'Segment Already Exist.'
export const HEM_USER_NOT_FOUND = " User not found."
export const HEM_PASSWORD_SAME = "Existing and New Password Must Be different."
export const HEM_PASSWORD_NOT_MATCH = "Password not Matched"
export const HEM_SESSION_EXPIRED = "Session Expired"
export const HEM_NO_CLIENTID = "Invalid Client Code."
export const HEM_INVALID_SOURCE = "Invalid Source."
export const HEM_FILE_NOT_FOUND = 'File not Found.'
export const HEM_MOBILE_EXIST = "Mobile Already Exists!"
export const HEM_EMAIL_EXIST = "Email Already Exists!"
export const HEM_FIELD_REQUIRED = "Please fill all the required fields."
export const HEM_INVALID_AMOUNT = "Amount must be 50.00 INR or greter than 50.00 INR."
export const HEM_ATOMPAY_INVALID_AMOUNT = "Amount must be 100.00 INR or greater than 100.00 INR."
export const HEM_INVALID_DATA = "Invalid Data."
export const HEM_INVALID_SIGNATURE = "Invalid Signature."
export const HEM_FAILED_TRANSACTION = "Transaction Failed !"
export const HEM_FIELD_REQ = "Field Required."
export const HEM_NOT_ENOUGH_BALANCE = "Balance is insufficient to payout."
export const HEM_INVALID_MODIFICATION_TYPE = 'Invalid Modification Type.'
export const HEM_DATABASE_ERROR = "Database process Failed. Please try again."
export const HEM_BANK_ACC_NUM = 'Invalid Account Number.'
export const HEM_BANK_ACC_TYPE = 'Invalid Account Type.'
export const HEM_BANK_ACC_IFSC = 'Invalid IFSC code.'
export const HEM_BANK_ACC_MICR = 'Invalid MICR code.'
export const HEM_BANK_EXIST = 'Bank is Already Exists.'
export const HEM_TRY_AGAIN = 'Please,Try Again!'
export const PENNY_VERIFICATION_INVALID = 'Penny Verification Invalid.'
export const HEM_BANK_ACCOUNT_INVALID = 'Invalid Bank Account.'
export const HEM_NAME_NOT_MATCHED = 'Not Matched.'
export const HEM_FILED_REQUIRED = 'Field Required.'
export const HEM_REQUIRED_PENNY_STATUS = 'Penny Status required.'
export const HEM_INVALID_EXT = "File should be in formate '.jpg', '.jpeg', '.png', '.pdf' "
export const HEM_FUND_PAYOUT_FAILED = "Fund Payout Failed!"
export const HEM_EMANDATE_FAILED = "Emandate Failed!"
export const HEM_VALID_BALANCES = "Please ensure your ledger, holding, virtual debit, and cdsl debit are 0 before proceeding!"
export const HSM_ESIGN_REQUEST = "Esign request generated."
export const HSM_FILE_UPLOAD_SUCCESS = "File upload successfully"
export const HSM_AUTH_VERIFIED = "Auth Verified"
export const HSM_CREATED = "Created successfully"
export const HSM_LOGIN_SUCCESS = "Log in successful"
export const HSM_VERSION_SUCCESS = "Already Installed Latest version"
export const HSM_PASSWORD_SENT_MAIL = "OTP sent to your registered email"
export const HSM_PASSWORD_UPDATE_SUCCESS = "Succesfully updated password"
export const HSM_TOKEN_SUCCESS = "Token generated successfully"
export const HSM_TOKEN_DECODE_SUCCESS = "Token decoded successfully"
export const HSM_SUPPORT_SUCCESS = "Bug recevied"
export const HSM_HEALTH = "Server is Healthy"
export const HSM_LOGOUT_SUCCESS = "Logout successful"
export const HSM_DELETE_SUCCESS = "Deleted successfully"
export const HSM_UPDATE_SUCCESS = "Updated successfully"
export const HSM_FILE_UPLOAD = "File uploaded successfully"
export const HSM_FETCH_SERVCE_STATUS = "services status successfully fetched"
export const HSM_BOD_SUCCESSFUL = " bod process successfully done"
export const HSM_CORP_SUCCESSFUL = " corporate action successfully done"
export const HSM_AEL_SUCCESSFUL = " ael process successfully done"
export const HSM_SPAN_MARGIN_SUCCESSFUL = "span margin process successfully done"
export const HSM_CAL_SPREAD_SUCCESSFUL = "cal spread process successfully done"
export const HSM_POTM_SUCCESSFUL = "cal spread process successfully done"
export const HSM_OPEN_POSITION_SUCCESSFUL = "open position process successfully done"
export const HSM_SHEET_SUCCESSFUL = "Sheet successfully done"
export const HSM_VAR_MARGIN_SUCCESSFUL = "var margin successfully done"
export const HSM_BSE_CONTRACT_SUCCESSFUL = "bse contract successfully done"
export const HSM_BSE_SPAN_SUCCESSFUL = "bse span successfully done"
export const HSM_SERVICE_START_SUCCESSFULLY = "service successfully start "
export const HSM_SERVICE_RESTART_SUCCESSFULLY = "service successfully restart "
export const HSM_SERVICE_STOP_SUCCESSFULLY = "service successfully stop "
export const HSM_NOTICE_LOG_SUCCESSFULLY = "Log read successfully "
export const HSM_REQUEST_TO_MODIFY_PROFILE = "Request send successfully to modify Income."
export const HSM_OTP_SUCCESS = "OTP send successfully"
export const HSM_OTP_RESEND_SUCCESS = "OTP Resend successfully"
export const HSM_DATA_INSERTED = "Data Inserted Successfully."
export const HSM_DOWNLOAD_SUCCESSFULLY = 'Download successfully'
export const HSM_PDF_GENERATED_SUCCESS = 'Pdf Generated successfully.'
export const HSM_PENNY_SUCCESS = "Penny Drop Verification is Completed Successfully!"
export const HSM_PENNY_ESIGN = "Penny E-sign Client."
export const HSM_PENNY_ESIGN_SUCCESS = "Penny E-sign Complete Successfully"
export const HSM_FUND_PAYOUT = "Fund Payout successfully!"
export const HSM_SEGMENT_ADDITION = " Send request successfully to add segment! "
export const HSM_SUCCESS_DATA = "Fetch data successfully!"
export const HSM_DEFAULT_BANK = "Default Bank Updated Successfully!"
export const HSM_CLOSE_ACCOUNT = "Account Closed Successfully."
export const HSM_xts_push = "Data push on xts successfully!"
export const HSM_NOMINEE_ESIGN_SUCCESS = " Esign Completed Successfully"
export const HSM_REQUEST_SEND = "Send request Succesfully to modification."
export const HSM_UNDER_MAINTAINCE = "Proccess Under Maintaince."
export const HSM_DATA_APPROVED_SUCCESS = "Data Approved Successfully."
export const HSM_DATA_REJECTED_SUCCESS = "Data Rejected Successfully."
export const HSM_LINK_GENERATED = 'Link Generated Successfully.'
export const HSM_APB_LINK_SUCCESS = 'Link Detected Successfully.'
export const HSM_ACC_CLOSE_PRO = "Proceed to account clouser Form."
export const HSM_DATA_FETCHED_SUCCESS = 'Fetch data successfully.'
export const HSM_APPROVE_REQUEST = 'Approve successfully'
export const HSM_REJECT_REQUEST = 'Reject successfully'
export const HSM_OTP_VERIFIED = "OTP Verify Successfully"
export const HEM_INVALID_PARAM = "Invalid data."
export const HS_SUCCESS = "success"
export const HS_ERROR = "error"

export const MAIL_TEMPLATE_PDF = {
   signup_subject: 'Email Verification - Arhamshare.',
   signup_template: `<!DOCTYPE html>
<html>
  <head>
     <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0">
  </head>
<style>
   p{
 font-family: system-ui;
 font-size: 15px;
}
</style>
  <body style="padding:15px; margin: 0; color: #333">
     <div style="max-width: 600px; margin: auto;background: var(--c-white, #ffffff);box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.05);
        border-radius: 5px;  overflow: hidden; box-sizing: border-box; border: solid 1px rgb(239, 239, 239) ">
        <div style=" padding: 15px 20px;">
           <div style="text-align: center; padding-top: 10px;"><img src="https://ekyc.arhamshare.com/img//Header_mail.png" alt="image"
              class="img-responsive" height="100" width="550">
           </div>

            <table width="100%" border="0" cellspacing="0" cellpadding="0">
               <tbody>
                   <tr>
                       <td>&nbsp;</td>
                   </tr>
                   <tr>
                       <td style="font-size: 16px; color: #38393c; font-family:Helvetica, Arial, sans-serif; font-weight: 400;">
                           <p>Dear User,</p>
                       </td>
                   </tr>

                   <tr>
                     <td style="font-size: 13px; color: #38393c; font-family:Helvetica, Arial, sans-serif; font-weight: 400;">
                           <p>{{ message }}</p> 
                           <p>Please find attached the PDF file you requested.</p> 
                           <p>Regards,<br>
                           Team Arham Share</p>
                       </td>
                   </tr>
                   </tbody>
               </table>
           <div
               style=" font-family:Arial, Helvetica, sans-serif; color: var(--c-grey7, #8097A2); font-size: 13px; text-align: -webkit-center; padding-top: 20px;">This automated email was sent to {{ emailId }}. For any query contact us at +91261 6794000, or contact us at help@arhamshre.com.
            </div>

        </div>
        <div style="text-align: center; padding-top: 10px;background-image: url('https://ekyc.arhamshare.com/img//Footer.png'); background-repeat: no-repeat;background-size: 600px 100px; height:100px; width: 600px;">
           <div style="text-align: center; padding-top: 18px;">
               <a href="#"><img src="https://ekyc.arhamshare.com/img/Facebook.png" height="30" width="30" style="margin-left:-437px;"></a>
               <a href="#"><img src="https://ekyc.arhamshare.com/img/Instagram.png" height="30" width="30"></a>
               <a href="#"><img src="https://ekyc.arhamshare.com/img/youtube.png" height="30" width="30"></a>
               <a href="#"><img src="https://ekyc.arhamshare.com/img/In.png" height="30" width="30"></a> 
           </div>
        </div>
        <div class="footerDiv" style="color: #fff;
           background-color: #1e447e; 
           font-size: 12px; font-family:Arial, Helvetica, sans-serif;">
        </div>
     </div>
  </body>
</html>  
`
}

export const MAIL_TEMPLATE_APPROVE_REJECT = {
   signup_subject: 'Email Verification - Arhamshare.',
   signup_template: `<!DOCTYPE html>
<html>
  <head>
     <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0">
  </head>
<style>
   p{
 font-family: system-ui;
 font-size: 15px;
}
</style>
  <body style="padding:15px; margin: 0; color: #333">
     <div style="max-width: 600px; margin: auto;background: var(--c-white, #ffffff);box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.05);
        border-radius: 5px;  overflow: hidden; box-sizing: border-box; border: solid 1px rgb(239, 239, 239) ">
        <div style=" padding: 15px 20px;">
           <div style="text-align: center; padding-top: 10px;"><img src="https://ekyc.arhamshare.com/img//Header_mail.png" alt="image"
              class="img-responsive" height="100" width="550">
           </div>

            <table width="100%" border="0" cellspacing="0" cellpadding="0">
               <tbody>
                   <tr>
                       <td>&nbsp;</td>
                   </tr>
                   <tr>
                       <td style="font-size: 16px; color: #38393c; font-family:Helvetica, Arial, sans-serif; font-weight: 400;">
                           <p>

                           Dear User,</p>

                       </td>
                   </tr>

                   <tr>
                     <td style="font-size: 13px; color: #38393c; font-family:Helvetica, Arial, sans-serif; font-weight: 400;">

                           <p>{{ message }}</p> 

                           <p>Regards,<br>
                           Team Arham Share</p>
                       </td>
                   </tr>
                   </tbody>
               </table>
           <div
               style=" font-family:Arial, Helvetica, sans-serif; color: var(--c-grey7, #8097A2); font-size: 13px; text-align: -webkit-center; padding-top: 20px;">This automated email was sent to {{ emailId }}. For any query contact us at +91261 6794000, or contact us at help@arhamshre.com.
            </div>

        </div>
        <div style="text-align: center; padding-top: 10px;background-image: url('https://ekyc.arhamshare.com/img//Footer.png'); background-repeat: no-repeat;background-size: 600px 100px; height:100px; width: 600px;">
           <div style="text-align: center; padding-top: 18px;">

           <a href="#"><img src="https://ekyc.arhamshare.com/img/Facebook.png" height="30" width="30" style="margin-left:-437px;"></a>
           <a href="#"><img src="https://ekyc.arhamshare.com/img/Instagram.png" height="30" width="30"></a>

           <a href="#"><img src="https://ekyc.arhamshare.com/img/youtube.png" height="30" width="30"></a>

           <a href="#"><img src="https://ekyc.arhamshare.com/img/In.png" height="30" width="30"></a> 


           </div>
        </div>
        <div class="footerDiv" style="color: #fff;
           background-color: #1e447e; 
           font-size: 12px; font-family:Arial, Helvetica, sans-serif;">
        </div>
     </div>
  </body>
</html>  
`
}

export const MAIL_TEMPLATE = {
   signup_subject: 'Email Verification - Arhamshare.',
   signup_template: `<!DOCTYPE html>
<html>
  <head>
     <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0">
  </head>
<style>
   p{
 font-family: system-ui;
 font-size: 15px;
}
</style>
  <body style="padding:15px; margin: 0; color: #333">
     <div style="max-width: 600px; margin: auto;background: var(--c-white, #ffffff);box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.05);
        border-radius: 5px;  overflow: hidden; box-sizing: border-box; border: solid 1px rgb(239, 239, 239) ">
        <div style=" padding: 15px 20px;">
           <div style="text-align: center; padding-top: 10px;"><img src="https://ekyc.arhamshare.com/img//Header_mail.png" alt="image"
              class="img-responsive" height="100" width="550">
           </div>

            <table width="100%" border="0" cellspacing="0" cellpadding="0">
               <tbody>
                   <tr>
                       <td>&nbsp;</td>
                   </tr>
                   <tr>
                       <td style="font-size: 16px; color: #38393c; font-family:Helvetica, Arial, sans-serif; font-weight: 400;">
                           <p>

                           Dear User,</p>

                       </td>
                   </tr>

                   <tr>
                     <td style="font-size: 13px; color: #38393c; font-family:Helvetica, Arial, sans-serif; font-weight: 400;">

                           <p>Please reset your password by using this OTP <br>
                            
                           <p >Verification Code : <b>{{ OTP }}</b> </p>

                           <p>Regards,<br>
                           Team Arham Share</p>
                       </td>
                   </tr>
                   </tbody>
               </table>
           <div
               style=" font-family:Arial, Helvetica, sans-serif; color: var(--c-grey7, #8097A2); font-size: 13px; text-align: -webkit-center; padding-top: 20px;">This automated email was sent to {{ emailId }}. For any query contact us at +91261 6794000, or contact us at help@arhamshre.com.
            </div>

        </div>
        <div style="text-align: center; padding-top: 10px;background-image: url('https://ekyc.arhamshare.com/img//Footer.png'); background-repeat: no-repeat;background-size: 600px 100px; height:100px; width: 600px;">
           <div style="text-align: center; padding-top: 18px;">

           <a href="#"><img src="https://ekyc.arhamshare.com/img/Facebook.png" height="30" width="30" style="margin-left:-437px;"></a>
           <a href="#"><img src="https://ekyc.arhamshare.com/img/Instagram.png" height="30" width="30"></a>

           <a href="#"><img src="https://ekyc.arhamshare.com/img/youtube.png" height="30" width="30"></a>

           <a href="#"><img src="https://ekyc.arhamshare.com/img/In.png" height="30" width="30"></a> 


           </div>
        </div>
        <div class="footerDiv" style="color: #fff;
           background-color: #1e447e; 
           font-size: 12px; font-family:Arial, Helvetica, sans-serif;">
        </div>
     </div>
  </body>
</html>  
`,
   employee_creation_subject: 'Account Information - Arham Share',
   employee_creation_template: `<!DOCTYPE html>
<html>
  <head>
     <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0">
  </head>
  <style>
     p {
        font-family: system-ui;
        font-size: 15px;
     }
  </style>
  <body style="padding:15px; margin: 0; color: #333">
     <div style="max-width: 600px; margin: auto;background: var(--c-white, #ffffff);box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.05);
        border-radius: 5px;  overflow: hidden; box-sizing: border-box; border: solid 1px rgb(239, 239, 239) ">
        <div style=" padding: 15px 20px;">
           <div style="text-align: center; padding-top: 10px;"><img src="https://ekyc.arhamshare.com/img//Header_mail.png" alt="image"
              class="img-responsive" height="100" width="550">
           </div>

            <table width="100%" border="0" cellspacing="0" cellpadding="0">
               <tbody>
                   <tr>
                       <td>&nbsp;</td>
                   </tr>
                   <tr>
                       <td style="font-size: 13px; color: #38393c; font-family:Helvetica, Arial, sans-serif; font-weight: 400;">
                           <p>Your username and password are provided below:</p>
                           <p>Username: <b>{{ username }}</b></p>
                           <p>Password: <b>{{ password }}</b></p>
                           <p>Please click the link below to sign in:</p>
                           <p><a href="http://192.168.130.23:3007/login">Sign In</a></p>
                           <p>Regards,<br> Team Arham Share</p>
                       </td>
                   </tr>

                   </tbody>
               </table>
           <div style=" font-family:Arial, Helvetica, sans-serif; color: var(--c-grey7, #8097A2); font-size: 13px; text-align: -webkit-center; padding-top: 20px;">This automated email was sent to {{ emailId }}. For any query contact us at +91261 6794000, or contact us at help@arhamshre.com.
            </div>

        </div>
        <div style="text-align: center; padding-top: 10px;background-image: url('https://ekyc.arhamshare.com/img//Footer.png'); background-repeat: no-repeat;background-size: 600px 100px; height:100px; width: 600px;">
           <div style="text-align: center; padding-top: 18px;">
              <a href="#"><img src="https://ekyc.arhamshare.com/img/Facebook.png" height="30" width="30" style="margin-left:-437px;"></a>
              <a href="#"><img src="https://ekyc.arhamshare.com/img/Instagram.png" height="30" width="30"></a>
              <a href="#"><img src="https://ekyc.arhamshare.com/img/youtube.png" height="30" width="30"></a>
              <a href="#"><img src="https://ekyc.arhamshare.com/img/In.png" height="30" width="30"></a> 
           </div>
        </div>
        <div class="footerDiv" style="color: #fff;
           background-color: #1e447e; 
           font-size: 12px; font-family:Arial, Helvetica, sans-serif;">
        </div>
     </div>
  </body>
</html>

`
}

export const SEGMENT_MAIL_TEMPLATE = {
   signup_subject: 'Email Verification - Arhamshare.',
   signup_tempelate: `<!DOCTYPE html>
<html>
  <head>
     <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0">
  </head>
<style>
   p{
 font-family: system-ui;
 font-size: 15px;
}
</style>
  <body style="padding:15px; margin: 0; color: #333">
     <div style="max-width: 600px; margin: auto;background: var(--c-white, #ffffff);box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.05);
        border-radius: 5px;  overflow: hidden; box-sizing: border-box; border: solid 1px rgb(239, 239, 239) ">
        <div style=" padding: 15px 20px;">
           <div style="text-align: center; padding-top: 10px;"><img src="https://ekyc.arhamshare.com/img//Header_mail.png" alt="image"
              class="img-responsive" height="100" width="550">
           </div>

            <table width="100%" border="0" cellspacing="0" cellpadding="0">
               <tbody>
                   <tr>
                       <td>&nbsp;</td>
                   </tr>
                   <tr>
                       <td style="font-size: 16px; color: #38393c; font-family:Helvetica, Arial, sans-serif; font-weight: 400;">
                           <p>

                           Dear User,</p>

                       </td>
                   </tr>

                   <tr>
                     <td style="font-size: 13px; color: #38393c; font-family:Helvetica, Arial, sans-serif; font-weight: 400;">

                           <p>Please Add your segment  by clicking the link below. <br>
                              This link is valid for 24 hours only and can be used only once.</p> 

                           <p >Verification Code : <b>{{ OTP }}</b> </p>

                           <p >Click On Link To Segment Addition: <b><a href="{{url}}segment-addition/verification?id={{uid}}&segment={{encode_segment}}">{{url}}segment-addition/verification?id={{uid}}&segment={{encode_segment}}</a></b> </p>

                           <p>Regards,<br>
                           Team Arham Share</p>
                       </td>
                   </tr>
                   </tbody>
               </table>
           <div
               style=" font-family:Arial, Helvetica, sans-serif; color: var(--c-grey7, #8097A2); font-size: 13px; text-align: -webkit-center; padding-top: 20px;">This automated email was sent to {{ emailId }}. For any query contact us at +91261 6794000, or contact us at help@arhamshre.com.
            </div>

        </div>
        <div style="text-align: center; padding-top: 10px;background-image: url('https://ekyc.arhamshare.com/img//Footer.png'); background-repeat: no-repeat;background-size: 600px 100px; height:100px; width: 600px;">
           <div style="text-align: center; padding-top: 18px;">

           <a href="#"><img src="https://ekyc.arhamshare.com/img/Facebook.png" height="30" width="30" style="margin-left:-437px;"></a>
           <a href="#"><img src="https://ekyc.arhamshare.com/img/Instagram.png" height="30" width="30"></a>

           <a href="#"><img src="https://ekyc.arhamshare.com/img/youtube.png" height="30" width="30"></a>

           <a href="#"><img src="https://ekyc.arhamshare.com/img/In.png" height="30" width="30"></a> 


           </div>
        </div>
        <div class="footerDiv" style="color: #fff;
           background-color: #1e447e; 
           font-size: 12px; font-family:Arial, Helvetica, sans-serif;">
        </div>
     </div>
  </body>
</html>  
`,
   employee_creation_subject: 'Account Information - Arham Share',
   employee_creation_tempelate: `<!DOCTYPE html>
<html>
  <head>
     <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0">
  </head>
  <style>
     p {
        font-family: system-ui;
        font-size: 15px;
     }
  </style>
  <body style="padding:15px; margin: 0; color: #333">
     <div style="max-width: 600px; margin: auto;background: var(--c-white, #ffffff);box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.05);
        border-radius: 5px;  overflow: hidden; box-sizing: border-box; border: solid 1px rgb(239, 239, 239) ">
        <div style=" padding: 15px 20px;">
           <div style="text-align: center; padding-top: 10px;"><img src="https://ekyc.arhamshare.com/img//Header_mail.png" alt="image"
              class="img-responsive" height="100" width="550">
           </div>

            # <table width="100%" border="0" cellspacing="0" cellpadding="0">
            #    <tbody>
            #        <tr>
            #            <td>&nbsp;</td>
            #        </tr>
            #        <tr>
            #            <td style="font-size: 13px; color: #38393c; font-family:Helvetica, Arial, sans-serif; font-weight: 400;">
            #                <p>Your username and password are provided below:</p>
            #                <p>Username: <b>{{ username }}</b></p>
            #                <p>Password: <b>{{ password }}</b></p>
            #                <p>Please click the link below to sign in:</p>
            #                <p><a href="http://192.168.130.23:3007/login">Sign In</a></p>
            #                <p>Regards,<br> Team Arham Share</p>
            #            </td>
            #        </tr>
            # 
            #        </tbody>
            #    </table>
           <div style=" font-family:Arial, Helvetica, sans-serif; color: var(--c-grey7, #8097A2); font-size: 13px; text-align: -webkit-center; padding-top: 20px;">This automated email was sent to {{ emailId }}. For any query contact us at +91261 6794000, or contact us at help@arhamshre.com.
            </div>

        </div>
        <div style="text-align: center; padding-top: 10px;background-image: url('https://ekyc.arhamshare.com/img//Footer.png'); background-repeat: no-repeat;background-size: 600px 100px; height:100px; width: 600px;">
           <div style="text-align: center; padding-top: 18px;">
              <a href="#"><img src="https://ekyc.arhamshare.com/img/Facebook.png" height="30" width="30" style="margin-left:-437px;"></a>
              <a href="#"><img src="https://ekyc.arhamshare.com/img/Instagram.png" height="30" width="30"></a>
              <a href="#"><img src="https://ekyc.arhamshare.com/img/youtube.png" height="30" width="30"></a>
              <a href="#"><img src="https://ekyc.arhamshare.com/img/In.png" height="30" width="30"></a> 
           </div>
        </div>
        <div class="footerDiv" style="color: #fff;
           background-color: #1e447e; 
           font-size: 12px; font-family:Arial, Helvetica, sans-serif;">
        </div>
     </div>
  </body>
</html>

`
}

export const MAIL_TEMPLATE_OTP = {
   signup_subject: 'Email Verification - Arhamshare.',
   signup_tempelate: `<!DOCTYPE html>
<html>
  <head>
     <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0">
  </head>
<style>
   p{
 font-family: system-ui;
 font-size: 15px;
}
</style>
  <body style="padding:15px; margin: 0; color: #333">
     <div style="max-width: 600px; margin: auto;background: var(--c-white, #ffffff);box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.05);
        border-radius: 5px;  overflow: hidden; box-sizing: border-box; border: solid 1px rgb(239, 239, 239) ">
        <div style=" padding: 15px 20px;">
           <div style="text-align: center; padding-top: 10px;"><img src="https://ekyc.arhamshare.com/img//Header_mail.png" alt="image"
              class="img-responsive" height="100" width="550">
           </div>

            <table width="100%" border="0" cellspacing="0" cellpadding="0">
               <tbody>
                   <tr>
                       <td>&nbsp;</td>
                   </tr>
                   <tr>
                       <td style="font-size: 16px; color: #38393c; font-family:Helvetica, Arial, sans-serif; font-weight: 400;">
                           <p>

                           Dear User,</p>

                       </td>
                   </tr>

                   <tr>
                     <td style="font-size: 13px; color: #38393c; font-family:Helvetica, Arial, sans-serif; font-weight: 400;">

                           <p>Please reset your password by clicking the link below. <br>
                              This link is valid for 24 hours only and can be used only once.</p> 

                           <p >Verification Code : <b>{{ OTP }}</b> </p>

                           <p>Regards,<br>
                           Team Arham Share</p>
                       </td>
                   </tr>
                   </tbody>
               </table>
           <div
               style=" font-family:Arial, Helvetica, sans-serif; color: var(--c-grey7, #8097A2); font-size: 13px; text-align: -webkit-center; padding-top: 20px;">This automated email was sent to {{ emailId }}. For any query contact us at +91261 6794000, or contact us at help@arhamshre.com.
            </div>

        </div>
        <div style="text-align: center; padding-top: 10px;background-image: url('https://ekyc.arhamshare.com/img//Footer.png'); background-repeat: no-repeat;background-size: 600px 100px; height:100px; width: 600px;">
           <div style="text-align: center; padding-top: 18px;">

           <a href="#"><img src="https://ekyc.arhamshare.com/img/Facebook.png" height="30" width="30" style="margin-left:-437px;"></a>
           <a href="#"><img src="https://ekyc.arhamshare.com/img/Instagram.png" height="30" width="30"></a>

           <a href="#"><img src="https://ekyc.arhamshare.com/img/youtube.png" height="30" width="30"></a>

           <a href="#"><img src="https://ekyc.arhamshare.com/img/In.png" height="30" width="30"></a> 


           </div>
        </div>
        <div class="footerDiv" style="color: #fff;
           background-color: #1e447e; 
           font-size: 12px; font-family:Arial, Helvetica, sans-serif;">
        </div>
     </div>
  </body>
</html>  
`,
   employee_creation_subject: 'Account Information - Arham Share',
   employee_creation_tempelate: `<!DOCTYPE html>
<html>
  <head>
     <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0">
  </head>
  <style>
     p {
        font-family: system-ui;
        font-size: 15px;
     }
  </style>
  <body style="padding:15px; margin: 0; color: #333">
     <div style="max-width: 600px; margin: auto;background: var(--c-white, #ffffff);box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.05);
        border-radius: 5px;  overflow: hidden; box-sizing: border-box; border: solid 1px rgb(239, 239, 239) ">
        <div style=" padding: 15px 20px;">
           <div style="text-align: center; padding-top: 10px;"><img src="https://ekyc.arhamshare.com/img//Header_mail.png" alt="image"
              class="img-responsive" height="100" width="550">
           </div>

            # <table width="100%" border="0" cellspacing="0" cellpadding="0">
            #    <tbody>
            #        <tr>
            #            <td>&nbsp;</td>
            #        </tr>
            #        <tr>
            #            <td style="font-size: 13px; color: #38393c; font-family:Helvetica, Arial, sans-serif; font-weight: 400;">
            #                <p>Your username and password are provided below:</p>
            #                <p>Username: <b>{{ username }}</b></p>
            #                <p>Password: <b>{{ password }}</b></p>
            #                <p>Please click the link below to sign in:</p>
            #                <p><a href="http://192.168.130.23:3007/login">Sign In</a></p>
            #                <p>Regards,<br> Team Arham Share</p>
            #            </td>
            #        </tr>
            # 
            #        </tbody>
            #    </table>
           <div style=" font-family:Arial, Helvetica, sans-serif; color: var(--c-grey7, #8097A2); font-size: 13px; text-align: -webkit-center; padding-top: 20px;">This automated email was sent to {{ emailId }}. For any query contact us at +91261 6794000, or contact us at help@arhamshre.com.
            </div>

        </div>
        <div style="text-align: center; padding-top: 10px;background-image: url('https://ekyc.arhamshare.com/img//Footer.png'); background-repeat: no-repeat;background-size: 600px 100px; height:100px; width: 600px;">
           <div style="text-align: center; padding-top: 18px;">
              <a href="#"><img src="https://ekyc.arhamshare.com/img/Facebook.png" height="30" width="30" style="margin-left:-437px;"></a>
              <a href="#"><img src="https://ekyc.arhamshare.com/img/Instagram.png" height="30" width="30"></a>
              <a href="#"><img src="https://ekyc.arhamshare.com/img/youtube.png" height="30" width="30"></a>
              <a href="#"><img src="https://ekyc.arhamshare.com/img/In.png" height="30" width="30"></a> 
           </div>
        </div>
        <div class="footerDiv" style="color: #fff;
           background-color: #1e447e; 
           font-size: 12px; font-family:Arial, Helvetica, sans-serif;">
        </div>
     </div>
  </body>
</html>

`
}
export const certificate = getPath(getIniPath(esignDocsPath, true), CERTIFICATE);
export const tick = getPath(getIniPath(esignDocsPath, true), ESIGN_TICK);
export const jarFile = getPath(getIniPath(esignDocsPath, true), ESIGN_JAR);
export const coordinates = getPath(getIniPath(coordinatePath, true), coordinatetxtfile);
export const nomineeCoordinates = getPath(getIniPath(coordinatePath, true), { fileName: NOMINEE_MODIFICATION_COORDINATE });
export const profileCoordinates = getPath(getIniPath(coordinatePath, true), { fileName: PROFILE_MODIFICATION_COORDINATE });
export const accCloseCoordinates = getPath(getIniPath(coordinatePath, true), ACC_CLS_COORDINATE);
export const accCloseWithTransferCoordinates = getPath(getIniPath(coordinatePath, true), ACC_CLS_WTS_COORDINATE);
export const mtfcoordinates = getPath(getIniPath(coordinatePath, true), { fileName: MTF_COORDINATE });
