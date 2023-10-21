import Blob "mo:base/Blob";
import Nat64 "mo:base/Nat64";
import Result "mo:base/Result";
import AccountIdentifierBlob "mo:principal/blob/AccountIdentifier";

import { icpAdapter } "./Adapter";
import Types "./Types";


/****Core module composing the uniform interface between types adapting token-ledger canister
  actors to types processed for and expected by the invoice canister caller.**
  \
  If adding support for more ICP based or ICRC1 standard tokens, first add a new tag that will
  correspond to the token to support in the `SupportedToken<T1, T2>` variant declaration below.
  \
  When this declaration is modified, it will trigger the Motoko VSCode extension to indicate
  all the other places that need to be edited to complete integration for support of that token.
  These include all the methods of this module and the four relevant Invoice Canister API methods:
    `get_caller_balance()`,
    `verify_invoice()`,
    `transfer()` and
    `recover_invoice_subaccount_balance()`.
  \
  Each method of `./SupportedToken.mo` contains a switch that will need an added case
  for the new tag; the four API methods in `Invoice.mo` also have switches that need an added case,
  however the logic of those cases involve adding the correct actor supertype calls. In all cases,
  the existing implementation can be used as a guide to copy the logic from just be sure to
  correctly update all references to the new tag.
  \
  It is recommended to first start by adding the case to `getTokenVerbose()` as the transfer fee
  assigned in that tag's TokenVerbose will be used to execute transactions correctly by the
  Invoice Canister.
  \
  Note that when the `SupportedToken<T1, T2>` declaration (from `./Types.mo`) is modified, it will
  trigger the Motoko VSCode extension to indicate all the other places that need to be edited to
  complete integration for support of that token. After the methods in this file have been completed,
  the last changes to make are the four relevant API methods in `Invoice.mo`.  */
module Token {

  // Redeclared to visually distinguish the code below.
  let ICP_Adapter = icpAdapter;

  /** Corresponding supported token type canister expected amount types. */
  public type Amount = Types.Tokens;

  /** Corresponding supported token type canister expected address types. */
  public type Address = Types.AccountIdentifier;

  /** Corresponding supported token type canister expected TransferArgs types. */
  public type TransferArgs = Types.TransferArgs;

  /** Corresponding supported token type canister expected TransferResult types. */
  public type TransferResult = Types.TransferResult;

  /** Corresponding supported token type canister expected TransferSuccess types. */
  public type TransferSuccess = Types.BlockIndex;

  /** Corresponding supported token type canister expected TransferErr types. */
  public type TransferErr = Types.TransferError;

  /****Sum type for converting between human parsable and canister expected address types.***/
  public type RecipientAddress = Address;

  /****Hard coded token specific information record.**
    At least the fee must be correctly defined for additional tokens in `getTokenVerbose()` below.
    It is strongly encouraged to set the other fields correctly as well, in particular the `Url`
    can point to the token-ledger canister's url of the ICP dashboard.  */
  public type TokenVerbose = {
    symbol : Text;
    name : Text;
    decimals : Int;
    fee : Nat;
    meta : ?{
      Issuer : Text;
      Url : Text;
    };
  };

  /****Additional supported tokens **must** at least have their correct transfer fee defined here.***/
  public func getTokenVerbose() : TokenVerbose {
    return {
      symbol = "_ICP";
      name = "Internet Computer Protocol Token";
      decimals = 8 : Int;
      fee = 10_000;
      meta = ?{
        Issuer = "e8s - For Demonstration Purposes";
        Url = "https://internetcomputer.org/docs/current/developer-docs/integrations/ledger/interact-with-ledger";
      };
    };
  };

  /****Returns the transaction fee as immutably defined in the `getTokenVerbose` for the given token type.***/
  public func getTransactionFee() : Nat {
    // This method requires no modification when a
    // new tag is added when integrating a new token.
    let { fee } = getTokenVerbose();
    fee;
  };


  /****Encodes a given address into text **without** validation.**
    _For addresses computed by the invoice canister in a way **known** to be rigorously tested._  */
  public func encodeAddress(a : Address) : Text {
    return ICP_Adapter.encodeAddress(a);
  };

  /****Returns the corresponding token address for an invoice subaccount.***/
  public func getInvoiceSubaccountAddress({
    id : Text;
    creator : Principal;
    canisterId : Principal;
  }) : Address {
    return ICP_Adapter.computeInvoiceSubaccountAddress(id, creator, canisterId);
  };

  /****Returns the corresponding token address encoded as text of the invoice subaccount address
    computed from the given invoice id, creator's principal and invoice canister id.**
    _Specifically used when creating an invoice._  */
  public func getEncodedInvoiceSubaccountAddress({
    id : Text;
    creator : Principal;
    canisterId : Principal;
  }) : Text {
    return ICP_Adapter.encodeAddress(ICP_Adapter.computeInvoiceSubaccountAddress(id, creator, canisterId));
  };

  /****Returns the corresponding token address for an invoice creator's subaccount.***/
  public func getCreatorSubaccountAddress({
    creator : Principal;
    canisterId : Principal;
  }) : Address {
    return ICP_Adapter.computeCreatorSubaccountAddress(creator, canisterId);
  };


  /****Computes the default subaccount for the address type given by `tokenType` for the given principal.***/
  public func getDefaultSubaccountAddress(
    p : Principal,
  ) : { asAddress : Address; asText : Text } {

    let stAddress = AccountIdentifierBlob.fromPrincipal(p, null);
    return { asAddress = stAddress; asText = encodeAddress(stAddress) };
  };
};
