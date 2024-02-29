export const idlFactory = ({ IDL }) => {
  const List = IDL.Rec();
  const AddressBook = IDL.Record({
    'name' : IDL.Text,
    'role' : IDL.Text,
    'email' : IDL.Text,
    'address' : IDL.Text,
    'discord' : IDL.Text,
    'telegram' : IDL.Text,
  });
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
  const ReturnVault = IDL.Record({
    'admin' : IDL.Principal,
    'threshold' : IDL.Nat,
    'signers' : IDL.Vec(IDL.Principal),
    'name' : IDL.Text,
    'created_at' : IDL.Int,
  });
  const Signers = IDL.Opt(IDL.Tuple(IDL.Principal, List));
  const Vault = IDL.Record({
    'admin' : IDL.Principal,
    'threshold' : IDL.Nat,
    'signers' : Signers,
    'name' : IDL.Text,
    'created_at' : IDL.Int,
  });
  const Tokens = IDL.Record({ 'e8s' : IDL.Nat64 });
  const Multisig = IDL.Service({
    'add_address_to_address_book' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text],
        [IDL.Vec(AddressBook)],
        [],
      ),
    'add_signatory' : IDL.Func([IDL.Text, IDL.Text, IDL.Nat], [IDL.Bool], []),
    'approve_transaction' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'cancel_transaction' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'create_transactions' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Nat],
        [Transaction],
        [],
      ),
    'create_vault' : IDL.Func(
        [IDL.Text, IDL.Vec(IDL.Text), IDL.Nat],
        [IDL.Record({ 'multisig' : ReturnVault, 'address' : IDL.Text })],
        [],
      ),
    'getCanisterPrincipal' : IDL.Func([], [IDL.Principal], []),
    'get_address_book' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(AddressBook)],
        ['query'],
      ),
    'get_all_vault' : IDL.Func([IDL.Text], [IDL.Vec(Vault)], []),
    'get_all_vault_by_principle' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Record({
              'multisig' : IDL.Opt(ReturnVault),
              'address' : IDL.Text,
            })
          ),
        ],
        ['query'],
      ),
    'get_multisig_balance' : IDL.Func([IDL.Text], [Tokens], []),
    'get_transactions' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(Transaction)],
        ['query'],
      ),
    'greet' : IDL.Func([], [IDL.Text], ['query']),
    'remove_signatory' : IDL.Func(
        [IDL.Text, IDL.Principal, IDL.Nat],
        [IDL.Bool],
        [],
      ),
  });
  return Multisig;
};
export const init = ({ IDL }) => { return []; };
