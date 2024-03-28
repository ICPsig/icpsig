export default function convertToE8s(amount: number) {
  return BigInt(amount * 100000000);
}
