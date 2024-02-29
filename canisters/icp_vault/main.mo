import Array "mo:base/Array";
import RBTree "mo:base/RBTree";
import Int "mo:base/Int";
import Error "mo:base/Error";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
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
import Ledger_ICP "canister:icp_ledger_canister";
import Token "./Token";
import Types "./Types";
import Adapter "./Adapter";
import Account "./Account";
import Blob "mo:base/Blob";
import Bool "mo:base/Bool";
import AccountIdentifierBlob "mo:principal/blob/AccountIdentifier";

shared ({ caller = installer_ }) actor class Multisig() = this {

  public type Signers = List.List<Principal>;

  public type AddressBook = {
    name: Text;
    address: Text;
    telegram: Text;
    email: Text;
    discord: Text;
    role: Text;
  };

  public type Vault = {
    name: Text;
    signers : Signers;
    threshold : Nat;
    created_at : Int;
    admin: Principal
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

  stable var transactions : Trie.Trie<Text, Transaction> = Trie.empty();
  stable var vault_transations : Trie.Trie<Text, List.List<Text>> = Trie.empty();
  stable var vaults_map : Trie.Trie<Text, Vault> = Trie.empty();
  stable var vaults_ids_map : Trie.Trie<Text, Text> = Trie.empty();
  stable var signer_vaults : Trie.Trie<Principal, List.List<Text>> = Trie.empty();
  stable var address_book : Trie.Trie<Principal, List.List<AddressBook>> = Trie.empty();

  let icp_ledger_canister = "ryjl3-tyaaa-aaaaa-aaaba-cai";

  // let Ledger_ICP: Types.Actor = actor (icp_ledger_canister);

  /** Source of entropy for substantiating ULID multisig ids. */
  let idCreationEntropy_ = Source.Source(XorShift.toReader(XorShift.XorShift64(null)), 0);


  /** The classic canister principal getter.  */
  func getInvoiceCanisterId_() : Principal { Principal.fromActor(this) };

  public func getCanisterPrincipal(): async Principal {
    getInvoiceCanisterId_()
  };

  func fetch_transaction_from_id(transactionIdList: List.List<Text>): [Transaction] {

    let newList = List.map(transactionIdList, func (transactionId: Text): Transaction {
      switch(Trie.get(transactions, textKey(transactionId), Text.equal)){
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

  // func transfer_icrc1(
  //   vault : Text,
  //   destination : Text
  // ) : async Result.Result<Nat, Text> {

  //   // let canister_subaccount = await get_nat8_from_account_id(vault);
  //   // let subaccount_blob = await get_nat8_from_account_id("0f7e058b7b63c8f676a6475a5760d6c979c5cf0dde86b31c6536e00376c625a5");

  //   let canister_subaccount = await get_blob_from_account_id(vault);
  //   let subaccount_blob = await get_blob_from_account_id("0f7e058b7b63c8f676a6475a5760d6c979c5cf0dde86b31c6536e00376c625a5");

  //   let balance = await Ledger_ICP.account_balance({account = canister_subaccount});
  //   Debug.print(debug_show(balance));

  //   let result = await Ledger_ICP.icrc1_transfer({
  //     memo = null;
  //     from_subaccount = ?canister_subaccount;
  //     to = {
  //       owner = Principal.fromText("3uv7j-mpb7v-i2g6n-u6jru-vkqgv-jizlq-oxz6z-tri6y-4a6f4-t5n4r-oae");
  //       subaccount = ?subaccount_blob;
  //     };
  //     amount = 10000: Nat;
  //     fee = null;
  //     created_at_time = null;
  //   });

  //   Debug.print(debug_show(result));
  //   return switch(result){
  //     case(#Ok(result)){
  //       return #ok(result);
  //     };
  //     case(#Err(result)){
  //       return #err("error");
  //     }
  //   }
  // };

  func transfer_icp(
    vault : Text,
    destination : Text,
    owner: Principal,
    amount: Nat,
  ) : async Bool {

    // let canister_subaccount = await get_nat8_from_account_id(vault);
    // let destination_subaccount = await get_nat8_from_account_id(destination);
    let id = switch (Trie.get(vaults_ids_map, textKey(vault), Text.equal)) {
        case null { "" };
        case (?v_id) { v_id };
      };

    let canister_subaccount = await get_blob_from_account_id(vault);
    let destination_subaccount = if (Text.contains(destination, #text "-")) {
      Account.accountIdentifier(Principal.fromText(destination), Account.defaultSubaccount());
    } else { await get_blob_from_account_id(destination) };
    // Account.principalToSubaccount(owner, id)
    // Blob.toArray(Account.principalToSubaccount(owner, id))
    let fee = await Ledger_ICP.transfer_fee({});
    let balance = await Ledger_ICP.account_balance({account = canister_subaccount});
    let result = await Ledger_ICP.transfer({
      memo = Nat64.fromNat(0);
      from_subaccount = ?Account.principalToSubaccount(owner, id);
      to = destination_subaccount;
      amount = { e8s = Nat64.fromNat(amount) };
      fee = fee.transfer_fee;
      created_at_time = null;
    });

    switch (result) {
      case (#Ok(blockIndex)) {
        Debug.print("Paid reward to in block " # debug_show blockIndex);
      };
      case (#Err(#InsufficientFunds { balance })) {
        throw Error.reject("Top me up! The balance is only " # debug_show balance # " e8s: and ID: " # debug_show id # " " # debug_show Principal.toText(owner) # debug_show vault);
      };
      case (#Err(other)) {
        throw Error.reject("Unexpected error: " # debug_show other);
      };
    };

    return true;
  };

  public query ({caller}) func greet() : async Text {
    return "Hello, "# Principal.toText(caller) # "!";
  };

  private func key(p: Principal): Trie.Key<Principal>{
    { key=p; hash= Principal.hash(p) }
  };

  private func textKey(t: Text): Trie.Key<Text>{
    { key=t; hash = Text.hash(t) }
  };

  // get addressbook
  public shared query ({caller}) func get_address_book(address: Text):async [AddressBook] {
    switch(Trie.get(address_book, key(caller), Principal.equal)){
      case null {
        let newAddress: AddressBook = {
          name = "My address";
          address = Principal.toText(caller);
          telegram  = "";
          email = "";
          discord = "";
          role = "";
        };
        let newAddressList = List.make(newAddress);
        address_book := Trie.put(
          address_book,
          key(caller),
          Principal.equal,
          newAddressList,
        ).0;
        Array.reverse(List.toArray(newAddressList));
      };
      case (?book){
        Array.reverse(List.toArray(book));
      }
    }
  };

  // add adddress to multisig vault
  public shared ({caller}) func add_address_to_address_book(
    addressToAdd: Text,
    name: Text,
    telegram: Text,
    email: Text,
    discord: Text,
    role: Text
  ) : async [AddressBook] {
    let userAddressBook = Trie.get(address_book, key(caller), Principal.equal);
    let newAddress: AddressBook = {
      name;
      address = addressToAdd;
      telegram = telegram;
      email = email;
      discord = discord;
      role = role;
    };
    
    switch (userAddressBook){
      case null {
        let callerAddress: AddressBook = {
          name = "My address";
          address = Principal.toText(caller);
          telegram  = "";
          email = "";
          discord = "";
          role = "";
        };
        let addressbookNewAddress = List.make(callerAddress);
        let newAddressList = List.push(newAddress, addressbookNewAddress);

        address_book := Trie.put(
          address_book,
          key(caller),
          Principal.equal,
          newAddressList,
        ).0;
        Array.reverse(List.toArray(newAddressList));
      };
      case (?addressBook) {
        let isAlreadyAdded = List.find(addressBook, func(a:AddressBook): Bool{ a.address == addressToAdd});

        if(isAlreadyAdded != null){
          throw Error.reject(addressToAdd #" is already exist in addressbook");
        };
        
        let newAddressList = List.push(newAddress, addressBook);
        address_book := Trie.replace(
          address_book,
          key(caller),
          Principal.equal,
          ?newAddressList
        ).0;
        Array.reverse(List.toArray(newAddressList));
      }
    };
  };

  // create multisig vault
  public shared ({caller}) func create_vault(
    name:Text,
    signatories : [Text],
    threshold : Nat,
  ) : async { address: Text; multisig: ReturnVault} {
    var signers: List.List<Principal> = List.map(List.fromArray(signatories), Principal.fromText);
    let id = ULID.toText(idCreationEntropy_.new());
    let canisterId = getInvoiceCanisterId_();
    // let address: Text = Adapter.encodeAddress(Adapter.computeInvoiceSubaccount(id, caller));
    let address : Text = Adapter.encodeAddress(Account.accountIdentifier(canisterId, Account.principalToSubaccount(caller, id)));

    vaults_ids_map := Trie.put(vaults_ids_map, textKey(address), Text.equal, id).0;

    let haveCaller = List.find(signers, func (s:Principal):Bool { s == caller });

    if(haveCaller == null){
      signers := List.push(caller, signers);
    };

    let vault : Vault = {
      name;
      signers = signers;
      threshold = threshold;
      created_at = Time.now();
      admin = caller;
    };

    vaults_map := Trie.put(vaults_map, textKey(address), Text.equal, vault).0;

    List.iterate(signers, func (s : Principal){
      let newVaults = switch (Trie.get(signer_vaults, key(s), Principal.equal)) {
        case null { List.make(address) };
        case (?oldVaults) { List.push(address, oldVaults) };
      };
      signer_vaults := Trie.put(signer_vaults, key(s), Principal.equal, newVaults).0;
    });

    return {
      address;
      multisig = {
        name;
        signers = List.toArray(signers);
        threshold = threshold;
        created_at = Time.now();
        admin = caller;
      }
    };
  };

  
  // get multisig vault
  public shared func get_multisig_balance(vault: Text): async Types.Tokens {
    let balance = await Ledger_ICP.account_balance_dfx({account = vault});
    return balance;
  };

  public type ReturnVault = {
    name: Text;
    signers : [Principal];
    threshold : Nat;
    created_at : Int;
    admin: Principal
  };

  func get_vault_data(vault: Text):{ address: Text; multisig: ?ReturnVault} {
    switch (Trie.get(vaults_map, textKey(vault), Text.equal)) {
      case null { 
        return { address = vault; multisig = null }
      };
      case (?vaultData) { 
        let multisig = {
          name= vaultData.name;
          signers = List.toArray(vaultData.signers);
          threshold = vaultData.threshold;
          created_at = vaultData.created_at;
          admin= vaultData.admin
        };
        return {address = vault; multisig = ?multisig} 
      };
    };
  };

  
  // get all vault by principal
  public shared query ({caller}) func get_all_vault_by_principle() : async [{ address: Text; multisig: ?ReturnVault}] {
    switch (Trie.get(signer_vaults, key(caller), Principal.equal)) {
      case null { 
        return [];
       };
      case (?oldVaults) {
        var vaultList = List.nil<{ address: Text; multisig: ?ReturnVault}>();
        List.iterate(oldVaults, func (vault : Text){
          vaultList := List.push(get_vault_data(vault), vaultList);
        });
        List.toArray(vaultList)
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
      case (#err){ throw Error.reject("Error in decoding the Addresses") }
    }
  };

  // add signatory
  public shared ({ caller }) func add_signatory(
    vault : Text,
    signatory : Text,
    threshold : Nat
  ) : async Bool {

    let from_vault = switch (Trie.get(vaults_map, textKey(vault), Text.equal)) {
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
      name = from_vault.name;
      signers = newSigners;
      threshold = threshold;
      created_at = from_vault.created_at;
      admin = from_vault.admin;
    };
    vaults_map := Trie.replace(
          vaults_map,
          textKey(vault),
          Text.equal,
          ?newVault
        ).0;

    return true;  
  
  };

  // remove signatory
  public shared ({ caller }) func remove_signatory(
    vault : Text,
    signatory : Principal,
    threshold : Nat
  ) : async Bool {

   let from_vault = switch (Trie.get(vaults_map, textKey(vault), Text.equal)) {
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
      name = from_vault.name;
      signers = newSigners;
      threshold = threshold;
      created_at = from_vault.created_at;
      admin = from_vault.admin;
    };

    vaults_map := Trie.replace(
          vaults_map,
          textKey(vault),
          Text.equal,
          ?newVault
        ).0;

    return true;
  };

  // approve transaction
  public shared ({caller}) func approve_transaction(
    vault : Text,
    transactionId : Text
  ) : async Bool {
    let vault_obj = switch (Trie.get(vaults_map, textKey(vault), Text.equal)){
      case null {
          throw Error.reject("Vault does not exist: " # vault );
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
    
    let obj: Transaction = switch (Trie.get(transactions, textKey(transactionId), Text.equal)) {
      case null { throw Error.reject("Transaction does not exist"); };
      case (?obj) { obj };
    };

    if(obj.completed){
      throw Error.reject("Transaction is already completed"); 
    };

    let approvals = obj.approvals;
    let isApprovedAlready = switch(List.find(approvals, func (a:Principal): Bool{ a == caller })){
      case null {
        false;
      };
      case (?approvedCaller){
        throw Error.reject("Transaction is already Approved by this user"); 
      }
    };

    let newApprovals = List.push(caller, approvals);

    if(List.size(newApprovals) == obj.threshold){
      let result = await transfer_icp(vault : Text, obj.to : Text, vault_obj.admin: Principal, obj.amount)
    };
    
    let newTransaction : Transaction = {
      id = obj.id;
      from_vault = obj.from_vault;
      to = obj.to;
      transaction_owner = obj.transaction_owner;
      threshold = obj.threshold;
      approvals = newApprovals;
      amount = obj.amount;
      created_at = obj.created_at;
      completed = if(List.size(newApprovals) == obj.threshold){ true } else{ false };
    };

    transactions := Trie.replace(
        transactions,
        textKey(transactionId),
        Text.equal,
        ?newTransaction
      ).0;
    
    return true;
  };

   public shared ({caller}) func get_all_vault(
    vault : Text
  ) : async  [Vault]  {
    switch (Trie.get(vaults_map, textKey(vault), Text.equal)) {
      case null { 
        return [];
       };
      case (?oldVaults) {
        [oldVaults]
      };
    };
  };

  // cancel transaction
  public shared ({caller}) func cancel_transaction(
    vault : Text,
    transactionId : Text,
  ) : async Bool {
    let vault_obj = switch (Trie.get(vaults_map, textKey(vault), Text.equal)){
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
    let obj: Transaction = switch (Trie.get(transactions, textKey(transactionId), Text.equal)) {
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
    transactions := Trie.remove(transactions, textKey(transactionId), Text.equal).0;
    return true;
  };

  // get transactions
  public shared query ({caller}) func get_transactions(
    vault : Text
  ) : async [Transaction] {
    switch (Trie.get(vault_transations, textKey(vault), Text.equal)){
      case null {
          return [];
      };
      case (?t_list){
        return fetch_transaction_from_id(t_list);
      };
    };
  };

  // create transaction 
  public shared ({caller})  func create_transactions(
    from_vault : Text,
    to : Text,
    amount : Nat,
  ) : async Transaction {

    let vault_obj = switch (Trie.get(vaults_map, textKey(from_vault), Text.equal)) {
      case null {
        throw Error.reject("Vault does not exist");
      };
      case (?v_obj){
        v_obj
      }
    };
    let signers = vault_obj.signers;
    let signer = List.find(signers, func (a: Principal): Bool{ a == caller });
    
    let owner = switch (signer) {
      case null {
        throw Error.reject("Vault does not belong to caller");
      };
      case (?signer){
        signer
      }
    };
    
    let id = ULID.toText(idCreationEntropy_.new());

    let newTransationWithId = switch (Trie.get(vault_transations, textKey(from_vault), Text.equal)) {
      case null { List.make(id) };
      case (?oldTransactions) { List.push(id, oldTransactions) };
    };

    vault_transations := Trie.put(vault_transations, textKey(from_vault), Text.equal, newTransationWithId).0;

    let newApprovals = List.make(caller);
    let newTransaction : Transaction = {
      id = id;
      from_vault = from_vault;
      to = to;
      transaction_owner = caller;
      threshold = vault_obj.threshold;
      approvals = newApprovals;
      amount = amount;
      created_at = Time.now();
      completed = false;
    };
    transactions := Trie.put(transactions, textKey(id), Text.equal, newTransaction).0;
    return newTransaction;
  };

}