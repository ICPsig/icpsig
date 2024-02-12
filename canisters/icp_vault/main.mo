import Array "mo:base/Array";
import RBTree "mo:base/RBTree";
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
import Blob "mo:base/Blob";

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
    to : Text;
    threshold: Nat;
    approvals : List.List<Principal>;
    amount : Nat;
    created_at : Int;
    completed: Bool
  };

  // var transactions : RBTree.RBTree<Text, Transaction> = RBTree.RBTree<Text, Transaction>(Text.compare);

  var transactions : HashMap.HashMap<Text, Transaction> = HashMap.HashMap(10, Text.equal, Text.hash);

  var vault_transations : HashMap.HashMap<Text, List.List<Text>> = HashMap.HashMap(10, Text.equal, Text.hash);

  var vaults_map : HashMap.HashMap<Text, Vault> = HashMap.HashMap(10, Text.equal, Text.hash);

  var signer_vaults : HashMap.HashMap<Principal, List.List<Text>> = HashMap.HashMap(10, Principal.equal, Principal.hash);

  var address_book : HashMap.HashMap<Principal, AddressBook> = HashMap.HashMap(10, Principal.equal, Principal.hash);

  let icp_ledger_canister = "ryjl3-tyaaa-aaaaa-aaaba-cai";

  let Ledger_ICP: Types.Actor = actor (icp_ledger_canister);

  /** Source of entropy for substantiating ULID multisig ids. */
  let idCreationEntropy_ = Source.Source(XorShift.toReader(XorShift.XorShift64(null)), 0);


  /** The classic canister principal getter.  */
  func getInvoiceCanisterId_() : Principal { Principal.fromActor(this) };

  public func getCanisterPrincipal(): async Principal {
    getInvoiceCanisterId_()
  };

  func fetch_transaction_from_id(transactionIdList: List.List<Text>): [Transaction] {

    let newList = List.map(transactionIdList, func (transactionId: Text): Transaction {
      switch(transactions.get(transactionId)){
        case null{
          return {
            id  = " ";
            from_vault = " ";
            transaction_owner = Principal.fromText(" ");
            to = " ";
            threshold= 0;
            approvals = List.nil<Principal>();
            amount =0;
            created_at = 0;
            completed = false;
          };
        };
        case(?tr){
          tr;
        }
      };
    });

    return List.toArray(newList);
  };

  func transfer_icrc1(
    vault : Text,
    destination : Text,
    amount : Nat,
    caller: Principal,
  ) : async Result.Result<(), Text> {

    let canister_subaccount = await get_blob_from_account_id(vault);
    let subaccount_blob = await get_blob_from_account_id(destination);
    let result = await Ledger_ICP.icrc1_transfer({
      memo = null;
      from_subaccount = ?canister_subaccount;
      to = {
        owner = getInvoiceCanisterId_();
        subaccount = ?subaccount_blob;
      };
      amount = amount;
      fee = null;
      created_at_time = null;
    });

    return switch(result){
      case(#Ok(result)){
        return #ok();
      };
      case(#Err(result)){
        return #err("Eror");
      }
    }
  };

  func transfer_icp(
    vault : Text,
    destination : Text,
    amount : Types.Tokens,
    caller: Principal,
  ) : async Result.Result<(), Text> {

    let canister_subaccount = await get_blob_from_account_id(vault);
    let destination_subaccount = await get_blob_from_account_id(destination);
    let fee = await Ledger_ICP.transfer_fee({});

    let result = await Ledger_ICP.transfer({
      memo = Nat64.fromNat(0);
      from_subaccount = ?canister_subaccount;
      to = destination_subaccount;
      amount = amount;
      fee = fee.transfer_fee;
      created_at_time = null;
    });

    return switch(result){
      case(#Ok(result)){
        return #ok();
      };
      case(#Err(result)){
        return #err("Eror");
      }
    }
  };

  public query func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  };

  // get addressbook
  public shared query func get_address_book(
    caller: Text,
  ) : async [Principal] {

    let from_address_book = address_book.get(Principal.fromText(caller));

    switch (from_address_book) {
      case null {throw Error.reject("Address book does not exist")};
      case (?from_address_book) {List.toArray(from_address_book) }
    }
  };

  // add adddress to multisig vault
  public shared func add_address_to_address_book(
    owner: Text,
    addressToAdd: Text,
  ) : async [Principal] {

    let caller = Principal.fromText(owner);
    let address = Principal.fromText(addressToAdd); 

    let from_address_book = switch (address_book.get(caller)) {
      case null { throw Error.reject("Address Book does not exist"); };
      case (?address_book) { address_book }
    };

    let is_address_exist = List.find(from_address_book, func(a: Principal) : Bool { a == address });

    switch (is_address_exist) {
      case null {
        let updated_address_book = List.push(address, from_address_book);
        address_book.put(caller, updated_address_book);
        return List.toArray(updated_address_book);
      };
      case (?is_address_exist) {
        throw Error.reject("Address is already added");
      }
    }
  };

  // create multisig vault
  public shared func create_vault(
    signatories : [Text],
    threshold : Nat,
    owner: Text,
  ) : async Text {
    let id = ULID.toText(idCreationEntropy_.new());
    let caller = Principal.fromText(owner);
    let canisterId = getInvoiceCanisterId_();
    let address : Text = Adapter.encodeAddress(Adapter.computeInvoiceSubaccountAddress(id, caller, canisterId));
    let signers: List.List<Principal> = List.map(List.push(owner, List.fromArray(signatories)), Principal.fromText);

    let vault : Vault = {
      signers = signers;
      threshold = threshold;
      created_at = Time.now();
    };

    vaults_map.put(address, vault);

    List.iterate(signers, func (s : Principal){
      let newVaults = switch (signer_vaults.get(s)) {
        case null { List.make(address) };
        case (?oldVaults) { List.push(address, oldVaults) };
      };

      signer_vaults.put(s, newVaults);
    });
    
    return address;
  };

  
  // get multisig vault
  public shared func get_multisig_balance(vault: Text): async Types.Tokens {
    let balance = await Ledger_ICP.account_balance_dfx({account = vault});
    return balance;
  };

  
  // get all vault by principal
  public shared query func get_all_vault_by_principle(owner: Text) : async [Text] {

    switch (signer_vaults.get(Principal.fromText(owner))) {
      case null { 
        return [];
       };
      case (?oldVaults) { 
        return List.toArray(oldVaults)
      };
    };
  };

  func get_nat8_from_account_id(accountId: Text) : async [Nat8] {
    switch(Adapter.decodeAddress(accountId)){
      case (#ok(identifier)) {
        return Blob.toArray(identifier);
      };
      case (#err){ throw Error.reject("Vault does not exist") }
    }
  };

  func get_blob_from_account_id(accountId: Text) : async Types.AccountIdentifier {
    switch(Adapter.decodeAddress(accountId)){
      case (#ok(identifier)) {
        return identifier;
      };
      case (#err){ throw Error.reject("Vault does not exist") }
    }
  };

  
  // public func get_principal_from_account_id(accountId: Text) : async Principal {
  //   let blob = await get_blob_from_account_id(accountId);
  //   Debug.print(debug_show(blob));
  //   let principal = Principal.fromBlob(blob);
  //   Debug.print(debug_show(Principal.toText(principal)));
  //   principal;
  // };

  // public query func get_all_vault() : async () {
  //   for ((key, value) in vaults_map.entries()) {
  //     Debug.print(debug_show(key #"\n"));
  //     Debug.print(debug_show(value));
  //     Debug.print(debug_show("\n"));
  //   };
  // };

  // public query func get_all_vault_transactions() : async () {
  //   for ((key, value) in vault_transations.entries()) {
  //     Debug.print(debug_show(key #"\n"));
  //     Debug.print(debug_show(List.toArray(value)));
  //     Debug.print(debug_show("\n"));
  //   };
  // };

  //  public query func get_all_onwer_specific_vault() : async () {
  //   for ((key, value) in signer_vaults.entries()) {
  //     Debug.print(debug_show(Principal.toText(key) #"\n"));
  //     Debug.print(debug_show(List.toArray(value)));
  //     Debug.print(debug_show("\n"));
  //   };
  // };

  // public query func get_all_transactions() : async () {
  //   for ((key, value) in transactions.entries()) {
  //     Debug.print(debug_show(key #"\n"));
  //     Debug.print(debug_show(value));
  //     Debug.print(debug_show("\n"));
  //   };
  // };

  // public shared ({ caller }) func get_caller(): async Principal {
  //   return caller;
  // };

  // add signatory
  public shared ({ caller }) func add_signatory(
    vault : Text,
    signatory : Text,
    threshold : Nat
  ) : async Bool {

    let from_vault = switch (vaults_map.get(vault)) {
      case null { throw Error.reject("Vault does not exist") };
      case (?vault_obj) { vault_obj }
    };

    let signers = from_vault.signers;
    let signer = List.find(signers, func(s: Principal) : Bool { s == caller });

    let owner = switch (signer) {
      case null {throw Error.reject("Vault does not belong to caller")};
      case (?s) {s}
    };

    let newSigners = List.push(Principal.fromText(signatory), signers);

    let newVault : Vault = {
      signers = newSigners;
      threshold = threshold;
      created_at = from_vault.created_at;
    };

    vaults_map.put(vault, newVault);

    return true;  
  
  };

  // remove signatory
  public shared ({ caller }) func remove_signatory(
    vault : Text,
    signatory : Principal,
    threshold : Nat
  ) : async Bool {

   let from_vault = switch (vaults_map.get(vault)) {
      case null { throw Error.reject("Vault does not exist"); };
      case (?vault_obj) { vault_obj }
    };

    let signers = from_vault.signers;
    let signer = List.find(signers, func(s: Principal) : Bool { s == caller });

    let owner = switch (signer) {
      case null {throw Error.reject("Vault does not belong to caller")};
      case (?s) {s}
    };
    let newSigners = List.filter(signers, func(s: Principal) : Bool { s != signatory });

    let newVault : Vault = {
      signers = newSigners;
      threshold = threshold;
      created_at = from_vault.created_at;
    };

    vaults_map.put(vault, newVault);

    return true;
  };

  // approve transaction
  public shared func approve_transaction(
    vault : Text,
    transactionId : Text,
    user: Text
  ) : async Bool {

    let caller = Principal.fromText(user);
    let vault_obj = switch (vaults_map.get(vault)){
      case null {
          throw Error.reject("Vault does not exist");
      };
      case (?v_obj){ v_obj}
    };
    
    let signers = vault_obj.signers;
    let signer = List.find(signers, func (a:Principal): Bool{ a == caller });
    let owner = switch (signer){
      case null {
        throw Error.reject("Vault does not belong to caller");
      };
      case (?signer) { signer }
    };
    let obj: Transaction = switch (transactions.get(transactionId)) {
      case null { throw Error.reject("Transaction does not exist"); };
      case (?obj) { obj };
    };
    if(obj.completed){
      throw Error.reject("Transaction is already completed"); 
    };
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
      // stop current
      let transfer_amount ={e8s = Nat64.fromNat(obj.amount)};
      let result = await transfer_icp(vault, newTransaction.to, transfer_amount, caller);
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

  // cancel transaction
  public shared func cancel_transaction(
    vault : Text,
    transactionId : Text,
    user: Text
  ) : async Bool {

    let caller = Principal.fromText(user);
    let vault_obj = switch (vaults_map.get(vault)){
      case null {
          throw Error.reject("Vault does not exist");
      };
      case (?v_obj){ v_obj}
    };
    
    let signers = vault_obj.signers;
    let signer = List.find(signers, func (a:Principal): Bool{ a == caller });
    let vault_member = switch (signer){
      case null {
        throw Error.reject("Vault does not belong to caller");
      };
      case (?signer) { signer }
    };
    let obj: Transaction = switch (transactions.get(transactionId)) {
      case null { throw Error.reject("Transaction does not exist"); };
      case (?obj) { obj };
    };
    if(obj.completed){
      throw Error.reject("Transaction is already completed"); 
    };
    let owner = obj.transaction_owner;
    if ( owner != caller ){
      throw Error.reject("Transaction is already completed"); 
    };

    transactions.delete(transactionId);
    return true;
  };

  // get transactions
  public shared query func get_transactions(
    vault : Text,
    user: Text
  ) : async [Transaction] {

    let caller = Principal.fromText(user);
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
  public shared func create_transactions(
    from_vault : Text,
    caller: Text,
    to : Text,
    amount : Nat,
  ) : async Bool {

    let vault_obj = switch (vaults_map.get(from_vault)) {
      case null {
        throw Error.reject("Vault does not exist");
      };
      case (?v_obj){
        v_obj
      }
    };

    let calllerPrincipal:Principal = Principal.fromText(caller);
    let signers = vault_obj.signers;
    let signer = List.find(signers, func (a: Principal): Bool{ a == calllerPrincipal });
    
    let owner = switch (signer) {
      case null {
        throw Error.reject("Vault does not belong to caller");
      };
      case (?signer){
        signer
      }
    };
    
    let id = ULID.toText(idCreationEntropy_.new());

    let newTransationId = switch (vault_transations.get(from_vault)) {
      case null { List.make(id) };
      case (?oldTransactions) { List.push(id, oldTransactions) };
    };

    vault_transations.put(from_vault, newTransationId);

    let newApprovals = List.make(calllerPrincipal);
    let newTransaction : Transaction = {
      id = id;
      from_vault = from_vault;
      to = to;
      transaction_owner = calllerPrincipal;
      threshold = vault_obj.threshold;
      approvals = newApprovals;
      amount = amount;
      created_at = Time.now();
      completed = false;
    };
    transactions.put(id, newTransaction);
    return false;
  };

}