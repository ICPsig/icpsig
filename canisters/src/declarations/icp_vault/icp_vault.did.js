export const idlFactory = ({ IDL }) => {
  const List = IDL.Rec();
  const List_1 = IDL.Rec();
  List.fill(IDL.Opt(IDL.Tuple(IDL.Principal, List)));
  const AccountIdentifier = IDL.Vec(IDL.Nat8);
  const Tokens = IDL.Record({ 'e8s' : IDL.Nat64 });
  List_1.fill(IDL.Opt(IDL.Tuple(IDL.Text, List_1)));
  const Transaction = IDL.Record({
    'id' : IDL.Text,
    'to' : AccountIdentifier,
    'threshold' : IDL.Nat,
    'from_vault' : IDL.Text,
    'completed' : IDL.Bool,
    'created_at' : IDL.Int,
    'transaction_owner' : IDL.Principal,
    'amount' : Tokens,
    'approvals' : List,
  });
  const Multisig = IDL.Service({
    'add_address' : IDL.Func([IDL.Principal, IDL.Principal], [List], []),
    'add_signatory' : IDL.Func(
        [IDL.Text, IDL.Principal, IDL.Nat],
        [IDL.Bool],
        [],
      ),
    'approve_transaction' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Principal],
        [IDL.Bool],
        [],
      ),
    'cancel_transaction' : IDL.Func(
        [IDL.Principal, IDL.Text, IDL.Text],
        [IDL.Bool],
        [],
      ),
    'create_transactions' : IDL.Func(
        [IDL.Text, IDL.Principal, AccountIdentifier, Tokens],
        [IDL.Bool],
        ['query'],
      ),
    'create_vault' : IDL.Func([List_1, IDL.Nat, IDL.Text], [IDL.Text], []),
    'get_address_book' : IDL.Func([IDL.Principal], [List], ['query']),
    'get_all_vault_by_principle' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(IDL.Text)],
        ['query'],
      ),
    'get_multisig_balance' : IDL.Func([IDL.Text], [Tokens], []),
    'get_transactions' : IDL.Func(
        [IDL.Principal, IDL.Text],
        [IDL.Vec(IDL.Opt(Transaction))],
        ['query'],
      ),
    'greet' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'remove_signatory' : IDL.Func(
        [IDL.Text, IDL.Principal, IDL.Nat],
        [IDL.Bool],
        [],
      ),
    'whoami' : IDL.Func([], [IDL.Principal], []),
  });
  return Multisig;
};
export const init = ({ IDL }) => { return []; };
