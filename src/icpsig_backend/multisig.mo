module {
  public type Transaction = {
    id: Nat;
    to: Principal;
    amount: Nat;
    confirmations: [Principal];
  };

  public type MultisigWallet = {
    signers: [Principal];
    requiredConfirmations: Nat;
    transactions: [Transaction];
  };

  // var wallet: ?MultisigWallet = null;
  // var nextTxId: Nat = 0;

  // public func initialize(signers: [Principal], requiredConfirmations: Nat) : async () {
  //   wallet := ?{signers = signers; requiredConfirmations = requiredConfirmations; transactions = []};
  // };

  // public func submitTransaction(to: Principal, amount: Nat) : async Nat {
  //   let newTransaction = {id = nextTxId; to = to; amount = amount; confirmations = []};
  //   wallet?.transactions := wallet?.transactions ++ [newTransaction];
  //   nextTxId += 1;
  //   return newTransaction.id;
  // };

  // public func confirmTransaction(transactionId: Nat) : async Bool {
  //   let caller = Principal.fromActor(msg.caller);

  //   for (transaction in wallet?.transactions.vals()) {
  //     if (transaction.id == transactionId) {
  //       if (Array.contains<Principal>(caller, transaction.confirmations) or (not Array.contains<Principal>(caller, wallet?.signers))) {
  //         return false;
  //       };
  //       transaction.confirmations := transaction.confirmations ++ [caller];
  //       return true;
  //     };
  //   };
  //   return false;
  // };

  // public func executeTransaction(transactionId: Nat) : async Bool {
  //   for (transaction in wallet?.transactions.vals()) {
  //     if (transaction.id == transactionId) {
  //       if (Array.size<Principal>(transaction.confirmations) < wallet?.requiredConfirmations) {
  //         return false;
  //       };
  //       // Execute the transaction logic here.
  //       // For example, send funds to another canister, etc.
  //       // Remove the transaction from pending list if needed.
  //       return true;
  //     };
  //   };
  //   return false;
  // };
};
