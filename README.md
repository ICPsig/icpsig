# ICPsig (Multisig dapp for internet computer)

ICPSig is an enterprise-grade multisig wallet. 
Organizations today often utilize multiple cryptocurrencies for conducting transactions, both inbound and outbound. However, they currently face a dearth of sophisticated tools that empower them to efficiently manage their treasuries across various chains and multisig wallets. This challenge necessitates the development of innovative, practical solutions that coalesce disparate books spanning multiple blockchain networks and wallets into a unified organizational system.
ICPSig endeavors to address this critical need by offering organizations a comprehensive suite of advanced, user-friendly solutions that harmonize their treasury management processes over the ICP Network. ICPSig paves the way for a more streamlined, efficient, and secure approach to digital asset management, thereby empowering organizations to navigate the complexities of the rapidly evolving crypto-financial landscape with confidence and dexterity.

# Production

ICPsig is live at https://wrv7o-yaaaa-aaaag-aceqa-cai.raw.icp0.io/

![icpsig_screenshot](https://github.com/ICPsig/icpsig/assets/874046/98ec8f24-a46e-4eb6-b666-a326f06c50f6)


## Running the project locally

To run project locally, you can use the following commands:

```bash
# Starts the replica, running in the background
dfx start --background

# Deploys your canisters to the replica and generates your candid interface
dfx deploy
```

Once the job completes, your application will be available at `http://localhost:4943?canisterId={asset_canister_id}`.

If you have made changes to your backend canister, you can generate a new candid interface with

```bash
npm run generate
```

at any time. This is recommended before starting the frontend development server, and will be run automatically any time you run `dfx deploy`.

If you are making frontend changes, you can start a development server with

```bash
npm start
```

Which will start a server at `http://localhost:8080`, proxying API requests to the replica at port 4943.


- set`DFX_NETWORK` to `ic` if you are using Webpack
- use your own preferred method to replace `process.env.DFX_NETWORK` in the autogenerated declarations
  - Setting `canisters -> {asset_canister_id} -> declarations -> env_override to a string` in `dfx.json` will replace `process.env.DFX_NETWORK` with the string in the autogenerated declarations
- Write your own `createActor` constructor
