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
import XorShift "mo:rand/XorShift";
import Source "mo:ulid/Source";
import ULID "mo:ulid/ULID";

import Token "./Token";
import Types "./Types";
import Adapter "./Adapter";

shared ({ caller = installer_ }) actor class Multisig() = this {

  public type Signers = List.List<Principal>;

  public type Vault = {
    signers : Signers;
    threshold : Nat64.Nat64;
    created_at : Int;
  };

  var vaults_map : HashMap.HashMap<Text, Vault> = HashMap.HashMap(10, Text.equal, Text.hash);

  var signer_vaults : HashMap.HashMap<Principal, List.List<Text>> = HashMap.HashMap(10, Principal.equal, Principal.hash);

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
          case (?token) {
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
  }


  // add signatory

  // remove signatory

  // create transaction

  // approve transaction

  //reject transaction

};
