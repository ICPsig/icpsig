import Array "mo:base/Array";
import Int "mo:base/Int";
import Error "mo:base/Error";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Nat64 "mo:base/Nat64";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Trie "mo:base/Trie";
import Nat "mo:base/Nat";
import XorShift "mo:rand/XorShift";
import Source "mo:ulid/Source";
import ULID "mo:ulid/ULID";
import Debug "mo:base/Debug";

import Token "./Token";
import Types "./Types";
import Adapter "./Adapter";

shared ({ caller = installer_ }) actor class Multisig() = this {

  public type Signers = List.List<Principal>;

  public type AddressBook = List.List<Principal>;

  public type Vault = {
    signers : Signers;
    threshold : Nat;
    created_at : Int;
  };

  public type Transaction = {
    id : Text;
    from_vault : Text;
    transaction_owner : Principal;
    to : Types.AccountIdentifier;
    threshold: Nat;
    approvals : List.List<Principal>;
    amount : Types.Tokens;
    created_at : Int;
    completed: Bool
  };

  var transactions : HashMap.HashMap<Text, Transaction> = HashMap.HashMap(10, Text.equal, Text.hash);

  var vault_transations : HashMap.HashMap<Text, List.List<Text>> = HashMap.HashMap(10, Text.equal, Text.hash);

  var vaults_map : HashMap.HashMap<Text, Vault> = HashMap.HashMap(10, Text.equal, Text.hash);

  var signer_vaults : HashMap.HashMap<Principal, List.List<Text>> = HashMap.HashMap(10, Principal.equal, Principal.hash);

  var address_book : HashMap.HashMap<Principal, AddressBook> = HashMap.HashMap(10, Principal.equal, Principal.hash);

  let icp_ledger_canister = "sgymv-uiaaa-aaaaa-aaaia-cai";

  let Ledger_ICP: Types.Actor = actor (icp_ledger_canister);

  /** Source of entropy for substantiating ULID multisig ids. */
  let idCreationEntropy_ = Source.Source(XorShift.toReader(XorShift.XorShift64(null)), 0);


  /** The classic canister principal getter.  */
  func getInvoiceCanisterId_() : Principal { Principal.fromActor(this) };

  func fetch_transaction_from_id(transactionIdList: List.List<Text>): [?Transaction] {

    let newList = List.map(transactionIdList, func (transactionId: Text): ?Transaction {
      return transactions.get(transactionId);
    });

    return List.toArray(newList);
  };

  func transfer(
    vault : Text,
    destination : Types.AccountIdentifier,
    amount : Types.Tokens,
    caller: Principal,
  ) : async Types.TransferResult {

    let from_vault = vaults_map.get(vault);

    switch (from_vault) {
      case null { throw Error.reject("Vault does not exist"); };
      case (?vault) {
        let signers = vault.signers;
        let signer = List.find(signers, func(s: Principal) : Bool { s == caller });

        switch (signer) {
          case null {
            throw Error.reject("Vault does not belong to caller");
          };
          case (?s) {
            let transferArgs : Types.TransferArgs = {
              memo = Nat64.fromNat(0);
              from_subaccount = null;
              to = destination;
              amount = amount;
              fee = { e8s = 10_000 };
              created_at_time = ?{ timestamp_nanos = Nat64.fromNat(Int.abs(Time.now())) };
            };

            let result = await Ledger_ICP.transfer(transferArgs);

            return result;
          };
        };
      };
    };
  };

  public query func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  };

  public shared (msg) func whoami() : async Principal {
    msg.caller
  };

  // add adddress to multisig vault
  public shared ({ caller }) func add_address(
    caller: Principal,
    address: Principal,
  ) : async List.List<Principal> {
    let from_address_book = address_book.get(caller);

    switch (from_address_book) {
      case null { throw Error.reject("Address Book does not exist"); };
      case (?from_address_book) {
        let is_address_exist = List.find(from_address_book, func(a: Principal) : Bool { a == address });

        switch (is_address_exist) {
          case null {
            let updated_address_book = List.push(address, from_address_book);
            address_book.put(caller, updated_address_book);
            return updated_address_book;
          };
          case (?is_address_exist) {
            throw Error.reject("Address is already added");
          }
        }
      }
    }
  };

  // get addressbook
  public shared query func get_address_book(
    caller: Principal,
  ) : async List.List<Principal> {
    let from_address_book = address_book.get(caller);
    switch (from_address_book) {
      case null {throw Error.reject("Address book does not exist")};
      case (?from_address_book) {
        return from_address_book;
      }
    }
  };

  // create multisig vault
  public shared func create_vault(
    signatory : List.List<Principal>,
    threshold : Nat,
    caller: Principal,
  ) : async Text {
    let id = ULID.toText(idCreationEntropy_.new());

    let canisterId = getInvoiceCanisterId_();
    let address : Text = Adapter.encodeAddress(Adapter.computeInvoiceSubaccountAddress(id, caller, canisterId));

    let vault : Vault = {
      signers = signatory;
      threshold = threshold;
      created_at = Time.now();
    };

    vaults_map.put(address, vault);

    let newVaults = switch (signer_vaults.get(caller)) {
      case null { List.make(address) };
      case (?oldVaults) { List.push(address, oldVaults) };
    };

    signer_vaults.put(caller, newVaults);

    return address;
  };

  public shared query func get_all_vault_by_principle(owner: Principal) : async List.List<Text>{
    switch (signer_vaults.get(owner)) {
      case null { 
        return null
       };
      case (?oldVaults) { 
        return oldVaults
      };
    };
  };

  // add signatory
  public shared ({ caller }) func add_signatory(
    vault : Text,
    signatory : Principal,
    threshold : Nat
  ) : async Bool {
    let from_vault = vaults_map.get(vault);

    switch (from_vault) {
      case null { throw Error.reject("Vault does not exist"); };
      case (?vault_obj) {
        let signers = vault_obj.signers;
        let signer = List.find(signers, func(s: Principal) : Bool { s == caller });

        switch (signer) {
          case null {
            throw Error.reject("Vault does not belong to caller");
          };
          case (?s) {
            let newSigners = List.push(signatory, signers);

            let newVault : Vault = {
              signers = newSigners;
              threshold = threshold;
              created_at = vault_obj.created_at;
            };

            vaults_map.put(vault, newVault);

            return true;
          };
        };
      };
    };
  };

  // remove signatory
  public shared ({ caller }) func remove_signatory(
    vault : Text,
    signatory : Principal,
    threshold : Nat
  ) : async Bool {
    let from_vault = vaults_map.get(vault);

    switch (from_vault) {
      case null { throw Error.reject("Vault does not exist"); };
      case (?vault_obj) {
        let signers = vault_obj.signers;
        let signer = List.find(signers, func(s: Principal) : Bool { s == caller });

        switch (signer) {
          case null {
            throw Error.reject("Vault does not belong to caller");
          };
          case (?s) {
            let newSigners = List.filter(signers, func(s: Principal) : Bool { s != signatory });

            let newVault : Vault = {
              signers = newSigners;
              threshold = threshold;
              created_at = vault_obj.created_at;
            };

            vaults_map.put(vault, newVault);

            return true;
          };
        };
      };
    };
  };

  // approve transaction
  public shared func approve_transaction(
    vault : Text,
    transactionId : Text,
    caller: Principal
  ) : async Bool {
    let vault_obj = vaults_map.get(vault);
    switch (vault_obj){
      case null {
          throw Error.reject("Vault does not exist");
      };
      case (?v_obj){
        let signers = v_obj.signers;
        let signer = List.find(signers, func (a:Principal): Bool{ a == caller });
        switch (signer){
          case null {
            throw Error.reject("Vault does not belong to caller");
          };
          case (?signer){
            let transactions_obj = transactions.get(transactionId);
            switch (transactions_obj) {
              case null { throw Error.reject("Transaction does not exist"); };
              case (?obj) {
                let approvals = obj.approvals;
                let newApprovals = List.push(caller, approvals);

                if(obj.threshold == List.size(newApprovals)){
                  let newTransaction : Transaction = {
                    id = obj.id;
                    from_vault = obj.from_vault;
                    to = obj.to;
                    transaction_owner = obj.transaction_owner;
                    threshold = obj.threshold;
                    approvals = newApprovals;
                    amount = obj.amount;
                    created_at = obj.created_at;
                    completed = true;
                  };
                  transactions.put(transactionId, newTransaction);
                  let result = await transfer(vault, newTransaction.to, newTransaction.amount, caller);
                  Debug.print(debug_show (result));
                }else{
                  let newTransaction : Transaction = {
                    id = obj.id;
                    from_vault = obj.from_vault;
                    to = obj.to;
                    transaction_owner = obj.transaction_owner;
                    threshold = obj.threshold;
                    approvals = newApprovals;
                    amount = obj.amount;
                    created_at = obj.created_at;
                    completed = false;
                  };
                  transactions.put(transactionId, newTransaction);
                };
                return true;
              };
            };
          };
        };
      };
    };
  };

  // cancel transaction
  public shared func cancel_transaction(
    caller: Principal,
    vault : Text,
    transactionId : Text
  ) : async Bool {
    let vault_obj = vaults_map.get(vault);
    switch (vault_obj){
      case null {
          throw Error.reject("Vault does not exist");
      };
      case (?v_obj){
        let signers = v_obj.signers;
        let signer = List.find(signers, func (a:Principal): Bool{ a == caller });
        switch (signer){
          case null {
            throw Error.reject("Vault does not belong to caller");
          };
          case (?signer){
            let transactions_obj = transactions.get(transactionId);
            switch (transactions_obj) {
              case null { throw Error.reject("Transaction does not exist"); };
              case (?obj) {
                let owner = obj.transaction_owner;
                if ( owner == caller ){
                  transactions.delete(transactionId);
                  return true;
                }else{
                  return false;
                }
              };
            };
          };
        };
      };
    };
  };

  // get transactions
  public shared query func get_transactions(
    caller: Principal,
    vault : Text,
  ) : async [?Transaction] {
    switch (vault_transations.get(vault)){
      case null {
          return [];
      };
      case (?t_list){
        return fetch_transaction_from_id(t_list);
      };
    };
  };

  // create transaction 
  public shared query func create_transactions(
    from_vault : Text,
    caller: Principal,
    to : Types.AccountIdentifier,
    amount : Types.Tokens,
  ) : async Bool {
    let vault_obj = vaults_map.get(from_vault);
    switch (vault_obj){
      case null {
          throw Error.reject("Vault does not exist");
      };
      case (?v_obj){
        let signers = v_obj.signers;
        let signer = List.find(signers, func (a:Principal): Bool{ a == caller });
        switch (signer){
          case null {
            throw Error.reject("Vault does not belong to caller");
          };
          case (?signer){
            let id = ULID.toText(idCreationEntropy_.new());
            let newTransationId = switch (vault_transations.get(from_vault)) {
              case null { List.make(id) };
              case (?oldTransactions) { List.push(id, oldTransactions) };
            };
            vault_transations.put(from_vault, newTransationId);
            let newApprovals = List.make(caller);
            let newTransaction : Transaction = {
              id = id;
              from_vault = from_vault;
              to = to;
              transaction_owner = caller;
              threshold = v_obj.threshold;
              approvals = newApprovals;
              amount = amount;
              created_at = Time.now();
              completed = false;
            };
            transactions.put(id, newTransaction);
            return true;
          };
        };
      };
    };
  };
}
