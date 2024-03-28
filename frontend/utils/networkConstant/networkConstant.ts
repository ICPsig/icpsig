import { Erc20Contract } from "../eth/servcieTypes";

export const NETWORK: any = "mainnet";

const ERC20_CONTRACT_ADDRESS_UNISWAP: Erc20Contract = {
  address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  exchange: "ethereum",
};

const ERC20_CONTRACTS_SEPOLIA: Erc20Contract[] = [
  {
    address: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0",
    exchange: "ethereum",
  },
  {
    address: "0x29f2D40B0605204364af54EC677bD022dA425d03",
    exchange: "ethereum",
  },
  ERC20_CONTRACT_ADDRESS_UNISWAP,
];

const ERC20_CONTRACTS_PRODUCTION: Erc20Contract[] = [
  {
    // USDC
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    exchange: "ethereum",
  },
  {
    // USDT
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    exchange: "ethereum",
  },
  {
    // DAI
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    exchange: "ethereum",
  },
  {
    // 1INCH
    address: "0x111111111117dc0aa78b770fa6a738034120c302",
    exchange: "ethereum",
  },
  ERC20_CONTRACT_ADDRESS_UNISWAP,
];

export const ERC20_CONTRACTS: Erc20Contract[] =
  NETWORK == "mainnet" ? ERC20_CONTRACTS_PRODUCTION : ERC20_CONTRACTS_SEPOLIA;

// https://ethereum.org/en/developers/docs/standards/tokens/erc-20/
export const ERC20_ABI = [
  "function name() public view returns (string)",
  "function symbol() public view returns (string)",
  "function decimals() public view returns (uint8)",
  "function totalSupply() public view returns (uint256)",
  "function balanceOf(address _owner) public view returns (uint256 balance)",
  "function transfer(address _to, uint256 _value) public returns (bool success)",
  "function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)",
  "function approve(address _spender, uint256 _value) public returns (bool success)",
  "function allowance(address _owner, address _spender) public view returns (uint256 remaining)",
  "event Transfer(address indexed _from, address indexed _to, uint256 _value)",
  "event Approval(address indexed _owner, address indexed _spender, uint256 _value)",
];

// We assumed that ERC20 approve contract function prefix is 0x095ea7b3
// https://sepolia.etherscan.io/address/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984#writeContract#F1
export const ERC20_APPROVE_HASH = "0x095ea7b3";

// Use when UNPREDICTABLE_GAS_LIMIT error are thrown while fetching the fee data.
// See: https://docs.ethers.org/v5/troubleshooting/errors/#help-UNPREDICTABLE_GAS_LIMIT
export const ERC20_FALLBACK_FEE = 500_000n;

export const ETH_BASE_FEE = 21_000n;
export const ETH_CHAIN_ID = BigInt(11155111);
export const ETHEREUM_DEFAULT_DECIMALS = 18;
