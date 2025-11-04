// @ts-nocheck
import express from "express";
import { sendOtp } from "../controllers/newKyc.controller.js";
import { validate } from "../validators/validate.js";
import { newKycSchema } from "../validators/newKyc.validators.js";

const router = express.Router();

router.route("/send-otp").post(validate({ body: newKycSchema }), sendOtp);
// router.route("/resend-otp").get(getAccountData);
// router.route("/verify-otp").get(getAccountData);

export default router;

