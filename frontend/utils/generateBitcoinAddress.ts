function generateRandomString(length) {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Generate a fake Bitcoin-like address
export function generateBitcoinAddress() {
  const addressPrefix = "bc1."; // Bitcoin addresses typically start with '1'
  const addressBody = generateRandomString(32); // 32 characters for the body of the address

  return addressPrefix + addressBody;
}
