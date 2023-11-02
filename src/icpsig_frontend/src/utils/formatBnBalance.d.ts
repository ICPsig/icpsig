import BN from 'bn.js';
interface Options {
    numberAfterComma?: number;
    withUnit?: boolean;
    withThousandDelimitor?: boolean;
}
export default function formatBnBalance(value: BN | string, options: Options, network: string): string;
export {};
