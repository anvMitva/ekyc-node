// @ts-nocheck
import { decryptWithJwt } from "../utils/encryption.js";
import logger from "../logger/winston.logger.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export async function verifyUser(req, res, next) {
  try {
    const authToken = req.headers["authorization"];
    if (!authToken) {
      logger.error("Authorization token missing");
      return res
        .status(403)
        .json(new ApiResponse(403, null, "Authorization token missing"));
    }

    let payload;
    try {
      payload = decryptWithJwt(authToken);

      req.user = payload;
      req.authToken = authToken;

      next();
    } catch (error) {
      logger.error(`Error in token verification: ${error.message}`);
      return res
        .status(401)
        .json(new ApiResponse(401, null, "Invalid or expired token"));
    }
  } catch (error) {
    logger.error(`Error in verifying user: ${error.message}`);
    return res
      .status(error.status)
      .json(
        new ApiResponse(error.status || 500, null, error.response.data.message || error.message || "Authorization failed")
      );
  }
}

