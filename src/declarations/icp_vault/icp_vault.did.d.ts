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
  'create_transactions' : ActorMethod<[string, string, bigint], Transaction>,
  'create_vault' : ActorMethod<
    [string, Array<string>, bigint],
    { 'multisig' : ReturnVault, 'address' : string }
  >,
  'getCanisterPrincipal' : ActorMethod<[], Principal>,
  'get_address_book' : ActorMethod<[string], Array<AddressBook>>,
  'get_all_vault' : ActorMethod<[string], Array<Vault>>,
  'get_all_vault_by_principle' : ActorMethod<
    [],
    Array<{ 'multisig' : [] | [ReturnVault], 'address' : string }>
  >,
  'get_multisig_balance' : ActorMethod<[string], Tokens>,
  'get_transactions' : ActorMethod<[string], Array<Transaction>>,
  'greet' : ActorMethod<[], string>,
  'remove_signatory' : ActorMethod<[string, Principal, bigint], boolean>,
}
export interface ReturnVault {
  'admin' : Principal,
  'threshold' : bigint,
  'signers' : Array<Principal>,
  'name' : string,
  'created_at' : bigint,
}
export type Signers = [] | [[Principal, List]];
export interface Tokens { 'e8s' : bigint }
export interface Transaction {
  'id' : string,
  'to' : string,
  'threshold' : bigint,
  'from_vault' : string,
  'completed' : boolean,
  'created_at' : bigint,
  'transaction_owner' : Principal,
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
