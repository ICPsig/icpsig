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
    'toPrincipal' : IDL.Principal,
    'transaction_owner' : IDL.Principal,
    'currencyType' : IDL.Text,
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
  const TowFAType = IDL.Record({
    'url' : IDL.Text,
    'verified' : IDL.Bool,
    'base32_secret' : IDL.Text,
    'enabled' : IDL.Bool,
    'tfaToken' : IDL.Text,
  });
  const Signers = IDL.Opt(IDL.Tuple(IDL.Principal, List));
  const Vault = IDL.Record({
    'admin' : IDL.Principal,
    'threshold' : IDL.Nat,
    'signers' : Signers,
    'name' : IDL.Text,
    'created_at' : IDL.Int,
  });
  const SignRequest = IDL.Record({
    'to' : IDL.Text,
    'gas' : IDL.Nat,
    'value' : IDL.Nat,
    'vault' : IDL.Text,
    'max_priority_fee_per_gas' : IDL.Nat,
    'data' : IDL.Opt(IDL.Text),
    'max_fee_per_gas' : IDL.Nat,
    'chain_id' : IDL.Nat,
    'nonce' : IDL.Nat,
  });
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
        [IDL.Text, IDL.Text, IDL.Nat, IDL.Text, IDL.Text],
        [Transaction],
        [],
      ),
    'create_vault' : IDL.Func(
        [IDL.Text, IDL.Vec(IDL.Text), IDL.Nat],
        [IDL.Record({ 'multisig' : ReturnVault, 'address' : IDL.Text })],
        [],
      ),
    'getCanisterPrincipal' : IDL.Func([], [IDL.Principal], []),
    'get_2FA_data' : IDL.Func([], [TowFAType], ['query']),
    'get_ETH_address' : IDL.Func([IDL.Text], [IDL.Text], []),
    'get_address_book' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(AddressBook)],
        ['query'],
      ),
    'get_all_vault' : IDL.Func([IDL.Text], [IDL.Vec(Vault)], []),
    'get_all_vault_balace' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Record({
              'balance' : IDL.Record({ 'icp' : IDL.Nat64, 'ckbtc' : IDL.Nat }),
              'address' : IDL.Text,
            })
          ),
        ],
        [],
      ),
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
    'get_btc_address' : IDL.Func([IDL.Text], [IDL.Text], []),
    'get_ckbtc_balance' : IDL.Func([IDL.Text, IDL.Principal], [IDL.Nat], []),
    'get_eth_address_from_vault' : IDL.Func(
        [IDL.Text],
        [
          IDL.Variant({
            'Ok' : IDL.Record({ 'address' : IDL.Text }),
            'Err' : IDL.Text,
          }),
        ],
        [],
      ),
    'get_eth_balance' : IDL.Func([IDL.Text, IDL.Principal], [IDL.Nat], []),
    'get_multisig_balance' : IDL.Func(
        [IDL.Text],
        [IDL.Record({ 'icp' : IDL.Nat64, 'ckbtc' : IDL.Nat })],
        [],
      ),
    'get_subaccount' : IDL.Func([IDL.Text], [IDL.Vec(IDL.Nat8)], ['query']),
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
    'retrive_btc_from_ckBtc' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Nat64],
        [IDL.Record({ 'block' : IDL.Nat64, 'isSuccess' : IDL.Bool })],
        [],
      ),
    'save_2FA_data' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Bool, IDL.Bool, IDL.Text],
        [TowFAType],
        [],
      ),
    'sign' : IDL.Func(
        [SignRequest, IDL.Text],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'signed_hash' : IDL.Text,
              'signature_hex' : IDL.Text,
            }),
            'Err' : IDL.Text,
          }),
        ],
        [],
      ),
    'sign_eth_transaction' : IDL.Func([SignRequest], [IDL.Text], []),
    'update_btc_to_ckBtc' : IDL.Func([IDL.Text], [IDL.Bool], []),
  });
  return Multisig;
};
export const init = ({ IDL }) => { return []; };
