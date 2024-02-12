import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type List = [] | [[Principal, List]];
export interface Multisig {
  'add_address_to_address_book' : ActorMethod<
    [string, string],
    Array<Principal>
  >,
  'add_signatory' : ActorMethod<[string, string, bigint], boolean>,
  'approve_transaction' : ActorMethod<[string, string, string], boolean>,
  'cancel_transaction' : ActorMethod<[string, string, string], boolean>,
  'create_transactions' : ActorMethod<
    [string, string, string, bigint],
    boolean
  >,
  'create_vault' : ActorMethod<[Array<string>, bigint, string], string>,
  'getCanisterPrincipal' : ActorMethod<[], Principal>,
  'get_address_book' : ActorMethod<[string], Array<Principal>>,
  'get_all_vault_by_principle' : ActorMethod<[string], Array<string>>,
  'get_multisig_balance' : ActorMethod<[string], Tokens>,
  'get_transactions' : ActorMethod<[string, string], Array<Transaction>>,
  'greet' : ActorMethod<[string], string>,
  'remove_signatory' : ActorMethod<[string, Principal, bigint], boolean>,
}
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
export interface _SERVICE extends Multisig {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: ({ IDL }: { IDL: IDL }) => IDL.Type[];
