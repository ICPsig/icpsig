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

import Token "./Token";
import Types "./Types";
import Adapter "./Adapter";

shared ({ caller = installer_ }) actor class Multisig() = this {

  public type Signers = List.List<Principal>;

  public type AddressBook = List.List<Text>;

  public type Vault = {
    signers : Signers;
    threshold : Nat64.Nat64;
    created_at : Int;
  };

  public type Transaction = {
    id : Text;
    from_vault : Text;
    to : Text;
    threshold: Nat64.Nat64;
    approvals : List.List<Principal>;
    amount : Types.Tokens;
    created_at : Int;
  };

  var transactions : List.List<Transaction> = List.nil<Transaction>();

  var vaults_map : HashMap.HashMap<Text, Vault> = HashMap.HashMap(10, Text.equal, Text.hash);

  var signer_vaults : HashMap.HashMap<Principal, List.List<Text>> = HashMap.HashMap(10, Principal.equal, Principal.hash);

  var address_book : HashMap.HashMap<Text, AddressBook> = HashMap.HashMap(10, Text.equal, Text.hash);

  let icp_ledger_canister = "sgymv-uiaaa-aaaaa-aaaia-cai";

  let Ledger_ICP: Types.Actor = actor (icp_ledger_canister);

  /** Source of entropy for substantiating ULID multisig ids. */
  let idCreationEntropy_ = Source.Source(XorShift.toReader(XorShift.XorShift64(null)), 0);


  /** The classic canister principal getter.  */
  func getInvoiceCanisterId_() : Principal { Principal.fromActor(this) };

  public query func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  };

  public shared (msg) func whoami() : async Principal {
    msg.caller
  };

  // add adddress to multisig vault
  public shared ({ caller }) func add_address(
    user_address: Text,
    address: Text,
  ) : async List.List<Text> {
    let from_address_book = address_book.get(user_address);

    switch (from_address_book) {
      case null { throw Error.reject("Address does not exist"); };
      case (?from_address_book) {
        let is_address_exist = List.find(from_address_book, func(a: Text) : Bool { a == address });

        switch (is_address_exist) {
          case null {
            let updated_address_book = List.push(address, from_address_book);
            address_book.put(user_address, updated_address_book);
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
  // public shared ({ caller }) func get_address_book(
  //   user_address: Text,
  // ) : async List.List<Text> {
  //   let from_address_book = address_book.get(user_address);
  //   switch (from_address_book) {
  //     case null {throw Error.reject("Address book does not exist")};
  //     case (?from_address_book) {
  //       return from_address_book;
  //     }
  //   }
  // };

  // create multisig vault
  public shared ({ caller }) func create_vault() : async Text {
    let id = ULID.toText(idCreationEntropy_.new());

    let canisterId = getInvoiceCanisterId_();
    let address : Text = Adapter.encodeAddress(Adapter.computeInvoiceSubaccountAddress(id, caller, canisterId));

    let vault : Vault = {
      signers = List.make(caller);
      threshold = 1;
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

  public shared ({ caller }) func transfer(
    vault : Text,
    destination: Types.AccountIdentifier,
    amount : Types.Tokens
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

  // add signatory
  public shared ({ caller }) func add_signatory(
    vault : Text,
    signatory : Principal,
    threshold : Nat64.Nat64
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
    threshold : Nat64.Nat64
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

  approve transaction
  public shared ({ caller }) func approve_transaction(
    vault : Text,
    transaction : Text
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
            let transaction_obj = transactions.find(func(t: Transaction) : Bool { t.id == transaction });

            switch (transaction_obj) {
              case null { throw Error.reject("Transaction does not exist"); };
              case (?transaction_obj) {
                let approvals = transaction_obj.approvals;
                let newApprovals = List.push(caller, approvals);

                let newTransaction : Transaction = {
                  id = transaction_obj.id;
                  from_vault = transaction_obj.from_vault;
                  to = transaction_obj.to;
                  threshold = transaction_obj.threshold;
                  approvals = newApprovals;
                  amount = transaction_obj.amount;
                  created_at = transaction_obj.created_at;
                };

                transactions_map.put(transaction, newTransaction);

                return true;
              };
            };

            return true;
          };
        };
      };
    };
  };

  // reject transaction
  public shared ({ caller }) func reject_transaction(
    id: Nat64.Nat64,
    vault : Text,
    transaction : Text
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
            let transaction_obj = transactions.find(func(t: Transaction) : Bool { t.id == transaction });

            switch (transaction_obj) {
              case null { throw Error.reject("Transaction does not exist"); };
              case (?transaction_obj) {
                let approvals = transaction_obj.approvals;
                let newApprovals = List.filter(approvals, func(a: Principal) : Bool { a != caller });

                let newTransaction : Transaction = {
                  id = transaction_obj.id;
                  from_vault = transaction_obj.from_vault;
                  to = transaction_obj.to;
                  threshold = transaction_obj.threshold;
                  approvals = newApprovals;
                  amount = transaction_obj.amount;
                  created_at = transaction_obj.created_at;
                };

                transactions_map.put(transaction, newTransaction);

                return true;
              };
            };

            return true;
          };
        };
      };
    };
  };

};
