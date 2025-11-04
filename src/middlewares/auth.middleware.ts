import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest, JwtPayload } from "../types/auth.js";
import { decryptWithJwt } from "../utils/encryption.js";
import logger from "../logger/winston.logger.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export async function verifyUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> {
  try {
    const authToken = req.headers["authorization"];
    if (!authToken) {
      logger.error("Authorization token missing");
      return res
        .status(403)
        .json(new ApiResponse(403, null, "Authorization token missing"));
    }

    let payload: JwtPayload;
    try {
      payload = decryptWithJwt(authToken) as unknown as JwtPayload;

      req.user = payload;
      req.authToken = authToken;

      next();
    } catch (error) {
      const err = error as Error;
      logger.error(`Error in token verification: ${err.message}`);
      return res
        .status(401)
        .json(new ApiResponse(401, null, "Invalid or expired token"));
    }
  } catch (error) {
    const err = error as any;
    logger.error(`Error in verifying user: ${err.message}`);
    return res
      .status(err.status || 500)
      .json(
        new ApiResponse(
          err.status || 500,
          null,
          err.response?.data?.message || err.message || "Authorization failed"
        )
      );
  }
}

