export default function convertE8sToNumber(amount: BigInt) {
  console.log(Number(amount));
  return (Number(amount) / 100000000).toFixed(4);
}
