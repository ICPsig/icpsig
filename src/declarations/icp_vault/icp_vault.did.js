export const idlFactory = ({ IDL }) => {
  const List = IDL.Rec();
  const Tokens = IDL.Record({ 'e8s' : IDL.Nat64 });
  List.fill(IDL.Opt(IDL.Tuple(IDL.Principal, List)));
  const Transaction = IDL.Record({
    'id' : IDL.Text,
    'to' : IDL.Text,
    'threshold' : IDL.Nat,
    'from_vault' : IDL.Text,
    'completed' : IDL.Bool,
    'created_at' : IDL.Int,
    'transaction_owner' : IDL.Principal,
    'amount' : IDL.Nat,
    'approvals' : List,
  });
  const Multisig = IDL.Service({
    'add_address_to_address_book' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Vec(IDL.Principal)],
        [],
      ),
    'add_signatory' : IDL.Func([IDL.Text, IDL.Text, IDL.Nat], [IDL.Bool], []),
    'approve_transaction' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text],
        [IDL.Bool],
        [],
      ),
    'cancel_transaction' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text],
        [IDL.Bool],
        [],
      ),
    'create_transactions' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Nat],
        [IDL.Bool],
        [],
      ),
    'create_vault' : IDL.Func(
        [IDL.Vec(IDL.Text), IDL.Nat, IDL.Text],
        [IDL.Text],
        [],
      ),
    'getCanisterPrincipal' : IDL.Func([], [IDL.Principal], []),
    'get_address_book' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(IDL.Principal)],
        ['query'],
      ),
    'get_all_vault_by_principle' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(IDL.Text)],
        ['query'],
      ),
    'get_multisig_balance' : IDL.Func([IDL.Text], [Tokens], []),
    'get_transactions' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Vec(Transaction)],
        ['query'],
      ),
    'greet' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'remove_signatory' : IDL.Func(
        [IDL.Text, IDL.Principal, IDL.Nat],
        [IDL.Bool],
        [],
      ),
  });
  return Multisig;
};
export const init = ({ IDL }) => { return []; };
