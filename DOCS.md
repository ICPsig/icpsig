# ICPsig

This project creates a multisig account on the Internet Computer. It allows you to create and manage your ICPsig account from multiple principals.

## Architecture

The project is composed of two parts:

- A frontend application that runs on the Internet Computer
- A backend canister dapp implementing multisig logic

The canister is used to create multisig accounts which are essentially subaccounts under multisig canister principal. Thus canister is the owner of the subaccounts and can manage them. The frontend application is used to interact with the canister and create subaccounts.

The user can create a subaccount by providing a list of principals that will be able to sign transactions for the subaccount. The user can also create a subaccount with a single principal and then add more principals later.

The user can also create a subaccount with a single principal and then add more principals later.

A signatory can create a transaction using either command line interface or the frontend application. The transaction is then signed by the signatories and submitted to the canister. The canister then executes the transaction and sends the funds to the receiver.

This canister supports the main ICP token using ledger canister. It also supports other tokens that implement the ICP ICRC1 standard.


