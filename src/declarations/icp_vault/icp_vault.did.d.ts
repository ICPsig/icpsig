import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AddressBook {
  'name' : string,
  'role' : string,
  'email' : string,
  'address' : string,
  'discord' : string,
  'telegram' : string,
}
export type List = [] | [[Principal, List]];
export interface Multisig {
  'add_address_to_address_book' : ActorMethod<
    [string, string, string, string, string, string],
    Array<AddressBook>
  >,
  'add_signatory' : ActorMethod<[string, string, bigint], boolean>,
  'approve_transaction' : ActorMethod<[string, string], boolean>,
  'cancel_transaction' : ActorMethod<[string, string], boolean>,
  'create_transactions' : ActorMethod<
    [string, string, bigint, string, string],
    Transaction
  >,
  'create_vault' : ActorMethod<
    [string, Array<string>, bigint],
    { 'multisig' : ReturnVault, 'address' : string }
  >,
  'getCanisterPrincipal' : ActorMethod<[], Principal>,
  'get_2FA_data' : ActorMethod<[], TowFAType>,
  'get_address_book' : ActorMethod<[string], Array<AddressBook>>,
  'get_all_vault' : ActorMethod<[string], Array<Vault>>,
  'get_all_vault_balace' : ActorMethod<
    [],
    Array<
      { 'balance' : { 'icp' : bigint, 'ckbtc' : bigint }, 'address' : string }
    >
  >,
  'get_all_vault_by_principle' : ActorMethod<
    [],
    Array<{ 'multisig' : [] | [ReturnVault], 'address' : string }>
  >,
  'get_ckbtc_balance' : ActorMethod<[string, Principal], bigint>,
  'get_multisig_balance' : ActorMethod<
    [string],
    { 'icp' : bigint, 'ckbtc' : bigint }
  >,
  'get_transactions' : ActorMethod<[string], Array<Transaction>>,
  'greet' : ActorMethod<[], string>,
  'remove_signatory' : ActorMethod<[string, Principal, bigint], boolean>,
  'save_2FA_data' : ActorMethod<
    [string, string, boolean, boolean, string],
    TowFAType
  >,
}
export interface ReturnVault {
  'admin' : Principal,
  'threshold' : bigint,
  'signers' : Array<Principal>,
  'name' : string,
  'created_at' : bigint,
}
export type Signers = [] | [[Principal, List]];
export interface TowFAType {
  'url' : string,
  'verified' : boolean,
  'base32_secret' : string,
  'enabled' : boolean,
  'tfaToken' : string,
}
export interface Transaction {
  'id' : string,
  'to' : string,
  'threshold' : bigint,
  'from_vault' : string,
  'completed' : boolean,
  'created_at' : bigint,
  'toPrincipal' : Principal,
  'transaction_owner' : Principal,
  'currencyType' : string,
  'amount' : bigint,
  'approvals' : List,
}
export interface Vault {
  'admin' : Principal,
  'threshold' : bigint,
  'signers' : Signers,
  'name' : string,
  'created_at' : bigint,
}
export interface _SERVICE extends Multisig {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: ({ IDL }: { IDL: IDL }) => IDL.Type[];
