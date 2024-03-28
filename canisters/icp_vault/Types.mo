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

  public type UtxoStatus = {
    #ValueTooSmall : Utxo;
    #Tainted : Utxo;
    #Minted : { minted_amount : Nat64; block_index : Nat64; utxo : Utxo };
    #Checked : Utxo;
  };

  public type UpdateBalanceError = {
    #GenericError : { error_message : Text; error_code : Nat64 };
    #TemporarilyUnavailable : Text;
    #AlreadyProcessing;
    #NoNewUtxos : {
      required_confirmations : Nat32;
      pending_utxos : ?[PendingUtxo];
      current_confirmations : ?Nat32;
    };
  };

  public type PendingUtxo = {
    confirmations : Nat32;
    value : Nat64;
    outpoint : { txid : Blob; vout : Nat32 };
  };

   public type RetrieveBtcWithApprovalArgs = {
    from_subaccount : ?Blob;
    address : Text;
    amount : Nat64;
  };

   public type RetrieveBtcWithApprovalError = {
    #MalformedAddress : Text;
    #GenericError : { error_message : Text; error_code : Nat64 };
    #TemporarilyUnavailable : Text;
    #InsufficientAllowance : { allowance : Nat64 };
    #AlreadyProcessing;
    #AmountTooLow : Nat64;
    #InsufficientFunds : { balance : Nat64 };
  };

   public type CKBTC_Actor = actor {
    get_btc_address : shared {
        owner : ?Principal;
        subaccount : ?Blob;
      } -> async Text;
    get_deposit_fee : shared query () -> async Nat64;
    get_withdrawal_account : shared () -> async Account;
    retrieve_btc_with_approval : shared RetrieveBtcWithApprovalArgs -> async {
        #Ok : { block_index : Nat64 };
        #Err : RetrieveBtcWithApprovalError;
      };
    update_balance : shared {
        owner : ?Principal;
        subaccount : ?Blob;
      } -> async { #Ok : [UtxoStatus]; #Err : UpdateBalanceError };
  };

  public type SignRequest = {
    to:Text;
    gas: Nat;
    value: Nat;
    max_priority_fee_per_gas:Nat;
    data:?Text;
    max_fee_per_gas:Nat;
    chain_id: Nat;
    nonce: Nat;
    vault: Text;
  };

   public type ETH_TRANSACTION_Actor = actor {
    eth_address_of : shared (Text) -> async Text;
    sign_transaction :shared (SignRequest) -> async  (Text);
    eth_address_of_public_key: shared (Blob) -> async (Text);
    generate_transaction_hash:shared (SignRequest) -> async  (Blob);
    generate_signed_hash:shared (Blob, Blob, Blob, SignRequest) -> async (Text)
  };

  public type RetrieveBtcArgs = { address : Text; amount : Nat64 };
  
  public type RetrieveBtcError = {
    #MalformedAddress : Text;
    #GenericError : { error_message : Text; error_code : Nat64 };
    #TemporarilyUnavailable : Text;
    #AlreadyProcessing;
    #AmountTooLow : Nat64;
    #InsufficientFunds : { balance : Nat64 };
  };


  public type TransferFee = { transfer_fee : Tokens };

  public type Account = { owner : Principal; subaccount : ?Subaccount };


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

  public type Icrc1UserAccount = {
    to : Account;
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


  // BTC

  public type SendRequest = {
        destination_address : Text;
        amount_in_satoshi : Satoshi;
    };

    public type ECDSAPublicKeyReply = {
        public_key : Blob;
        chain_code : Blob;
    };

    public type EcdsaKeyId = {
        curve : EcdsaCurve;
        name : Text;
    };

    public type EcdsaCurve = {
        #secp256k1;
    };

    public type SignWithECDSAReply = {
        signature : Blob;
    };

    public type ECDSAPublicKey = {
        canister_id : ?Principal;
        derivation_path : [Blob];
        key_id : EcdsaKeyId;
    };

    public type SignWithECDSA = {
        message_hash : Blob;
        derivation_path : [Blob];
        key_id : EcdsaKeyId;
    };

    public type Satoshi = Nat64;
    public type MillisatoshiPerVByte = Nat64;
    public type Cycles = Nat;
    public type BitcoinAddress = Text;
    public type BlockHash = [Nat8];
    public type Page = [Nat8];
    
    /// The type of Bitcoin network the dapp will be interacting with.
    public type Network = {
        #mainnet;
        #testnet;
        #regtest;
    };

    /// The type of Bitcoin network as defined by the Bitcoin Motoko library
    /// (Note the difference in casing compared to `Network`)
    public type NetworkCamelCase = {
        #Mainnet;
        #Testnet;
        #Regtest;
    };

    public func network_to_network_camel_case(network: Network) : NetworkCamelCase {
        switch (network) {
            case (#regtest) {
                #Regtest
            };
            case (#testnet) {
                #Testnet
            };
            case (#mainnet) {
                #Mainnet
            };
        }
    };

    /// A reference to a transaction output.
    public type OutPoint = {
        txid : Blob;
        vout : Nat32;
    };

    /// An unspent transaction output.
    public type Utxo = {
        outpoint : OutPoint;
        value : Satoshi;
        height : Nat32;
    };

    /// A request for getting the balance for a given address.
    public type GetBalanceRequest = {
        address : BitcoinAddress;
        network : Network;
        min_confirmations : ?Nat32;
    };

    /// A filter used when requesting UTXOs.
    public type UtxosFilter = {
        #MinConfirmations : Nat32;
        #Page : Page;
    };

    /// A request for getting the UTXOs for a given address.
    public type GetUtxosRequest = {
        address : BitcoinAddress;
        network : Network;
        filter : ?UtxosFilter;
    };

    /// The response returned for a request to get the UTXOs of a given address.
    public type GetUtxosResponse = {
        utxos : [Utxo];
        tip_block_hash : BlockHash;
        tip_height : Nat32;
        next_page : ?Page;
    };

    /// A request for getting the current fee percentiles.
    public type GetCurrentFeePercentilesRequest = {
        network : Network;
    };

    public type SendTransactionRequest = {
        transaction : [Nat8];
        network : Network;
    };
};
