import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type AccountIdentifier = Uint8Array | number[];
export type List = [] | [[Principal, List]];
export type List_1 = [] | [[string, List_1]];
export interface Multisig {
  'add_address' : ActorMethod<[Principal, Principal], List>,
  'add_signatory' : ActorMethod<[string, Principal, bigint], boolean>,
  'approve_transaction' : ActorMethod<[string, string, Principal], boolean>,
  'cancel_transaction' : ActorMethod<[Principal, string, string], boolean>,
  'create_transactions' : ActorMethod<
    [string, Principal, AccountIdentifier, Tokens],
    boolean
  >,
  'create_vault' : ActorMethod<[List_1, bigint, string], string>,
  'get_address_book' : ActorMethod<[Principal], List>,
  'get_all_vault_by_principle' : ActorMethod<[string], Array<string>>,
  'get_multisig_balance' : ActorMethod<[string], Tokens>,
  'get_transactions' : ActorMethod<
    [Principal, string],
    Array<[] | [Transaction]>
  >,
  'greet' : ActorMethod<[string], string>,
  'remove_signatory' : ActorMethod<[string, Principal, bigint], boolean>,
  'whoami' : ActorMethod<[], Principal>,
}
export interface Tokens { 'e8s' : bigint }
export interface Transaction {
  'id' : string,
  'to' : AccountIdentifier,
  'threshold' : bigint,
  'from_vault' : string,
  'completed' : boolean,
  'created_at' : bigint,
  'transaction_owner' : Principal,
  'amount' : Tokens,
  'approvals' : List,
}
export interface _SERVICE extends Multisig {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: ({ IDL }: { IDL: IDL }) => IDL.Type[];
