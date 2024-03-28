import { I2FASettings } from "@frontend/types";
import { TOTP } from "otpauth";

export const verify2FASecret = (
  authCode: number,
  userData: I2FASettings,
  address: string,
) => {
  if (Number.isNaN(authCode)) return { error: "invalid auth code" };

  try {
    if (!userData?.base32_secret) return { error: "user don't have secret," };

    const totp = new TOTP({
      algorithm: "SHA1",
      digits: 6,
      issuer: "ICPSig",
      label: address,
      period: 30,
      secret: userData?.base32_secret,
    });

    const isValidToken =
      totp.validate({
        token: String(authCode).replaceAll(/\s/g, ""),
        window: 1,
      }) !== null;

    if (!isValidToken) return { error: "Invalid 2fa" };

    return { data: "success" };
  } catch (err: unknown) {
    console.error("Error in verify2FA : ", err);
    return { error: "Error in verify 2FA" };
  }
};
