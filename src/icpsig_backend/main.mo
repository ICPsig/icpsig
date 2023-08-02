import Multisig "multisig";

actor {
  public func initialize(signers: [Principal], requiredConfirmations: Nat) : async () {
    Multisig.initialize(signers, requiredConfirmations);
  };

  public func submitTransaction(to: Principal, amount: Nat) : async Nat {
    return await Multisig.submitTransaction(to, amount);
  };

  public func confirmTransaction(transactionId: Nat) : async Bool {
    return await Multisig.confirmTransaction(transactionId);
  };

  public func executeTransaction(transactionId: Nat) : async Bool {
    return await Multisig.executeTransaction(transactionId);
  };
};
