/****ICP ledger canister related types.**
  Comments are copied from https://github.com/dfinity/ic/blob/master/rs/rosetta-api/icp_ledger/ledger.did
  _**Note** both the ICP adapter and actor supertype are dependent on these type declarations._  */
module Types {

  public type Actor = actor {
    transfer : shared TransferArgs -> async TransferResult;
    account_balance : shared query AccountBalanceArgs -> async Tokens;
    icrc1_transfer : shared Icrc1TransferArg -> async TransferResult;
    account_balance_dfx : shared query TextccountBalanceArgs -> async Tokens;
    transfer_fee : shared query {} -> async TransferFee;
    icrc1_fee : shared query () -> async Nat;
  };
  public type TransferFee = { transfer_fee : Tokens };

  public type Account = { owner : Principal; subaccount : ?Blob };


  /** AccountIdentifier is a 32-byte array.
   The first 4 bytes is big-endian encoding of a CRC32 checksum of the last 28 bytes. */
  public type AccountIdentifier = Blob;

  /** Subaccount is an arbitrary 32-byte byte array.
    Ledger uses subaccounts to compute the source address, which enables one
    principal to control multiple ledger accounts.   */
  public type Subaccount = Blob;

  /** Amount of tokens, measured in 10^-8 of a token.  */
  public type Tokens = { e8s : Nat64 };

  /**  Number of nanoseconds from the UNIX epoch in UTC timezone.  */
  public type TimeStamp = { timestamp_nanos : Nat64 };

  /** An arbitrary number associated with a transaction.
    The caller can set it in a `transfer` call as a correlation identifier.  */
  public type Memo = Nat64;

  /** Sequence number of a block produced by the ledger.  */
  public type BlockIndex = Nat64;

  /** Arguments for the `account_balance` call.  */
  public type AccountBalanceArgs = { account : AccountIdentifier };
  public type TextccountBalanceArgs = { account : Text };

  /** Arguments for the `transfer` call.  */
  public type TransferArgs = {
    to : Blob;
    fee : Tokens;
    memo : Nat64;
    from_subaccount : ?Blob;
    created_at_time : ?TimeStamp;
    amount : Tokens;
  };

  public type Icrc1TransferArg = {
    to : Account;
    fee : ?Nat;
    memo : ?Blob;
    from_subaccount : ?Blob;
    created_at_time : ?Nat64;
    amount : Nat;
  };

  /** ICP Ledger specific Result type, note the o and e of Ok and Err are capitalized.  */
  public type Result<T, E> = { #Ok : T; #Err : E };

  /** Result type returned from a `transfer` call.  */
  public type TransferResult = Result<BlockIndex, TransferError>;

  /** Error Err type returned from an unsuccessful `transfer` call.  */
  public type TransferError = {
    #GenericError : { message : Text; error_code : Nat };
    #TemporarilyUnavailable;
    #BadBurn : { min_burn_amount : Nat };
    #Duplicate : { duplicate_of : Nat };
    #BadFee : { expected_fee : Nat };
    #CreatedInFuture : { ledger_time : Nat64 };
    #TooOld;
    #InsufficientFunds : { balance : Nat };
  };
};
