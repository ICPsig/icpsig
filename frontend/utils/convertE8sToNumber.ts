export default function convertE8sToNumber(amount: BigInt) {
  if (isNaN(Number(amount))) {
    return (0).toFixed(4);
  }
  return (Number(amount) / 100000000).toFixed(4);
}
