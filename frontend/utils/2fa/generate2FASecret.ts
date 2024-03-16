import { I2FASettings } from "@frontend/types";
import { TOTP } from "otpauth";
import generateRandomBase32 from "./generate";

export const get2FASecret = (userPrincipal: string) => {
  try {
    const base32_secret = generateRandomBase32();

    const totp = new TOTP({
      algorithm: "SHA1",
      digits: 6,
      issuer: "ICPSig",
      label: userPrincipal,
      period: 30,
      secret: base32_secret,
    });

    const otpauth_url = totp.toString();

    const two_factor_auth: I2FASettings = {
      base32_secret,
      enabled: false,
      url: otpauth_url,
      verified: false,
    };

    return two_factor_auth;
  } catch (err: unknown) {
    console.log(err);
    return {
      err,
      base32_secret: "",
      enabled: false,
      url: "",
      verified: false,
    };
  }
};
