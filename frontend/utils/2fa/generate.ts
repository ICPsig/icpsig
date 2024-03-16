// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// import CryptoJS from "crypto-js";
import { encode } from "hi-base32";
import { nanoid } from "nanoid";
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export default function generateRandomBase32() {
  let token = nanoid(15);
  if (!isNaN(Number(token[0]))) {
    const newToken = token.split("");
    newToken[0] = letters[Number(token[0])];
    token = newToken.join("");
  }
  return encode(token).replace(/=/g, "").substring(0, 24);
}
