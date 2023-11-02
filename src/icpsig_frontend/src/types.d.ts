import { Dispatch, SetStateAction } from 'react';
import { tokenSymbol } from './global/networkConstants';
import { IdentityBackendService } from './services';
export declare enum CHANNEL {
    EMAIL = "email",
    TELEGRAM = "telegram",
    DISCORD = "discord",
    ELEMENT = "element",
    SLACK = "slack",
    IN_APP = "in_app"
}
export interface IUserNotificationChannelPreferences {
    name: CHANNEL;
    enabled: boolean;
    handle: string;
    verified: boolean;
    verification_token?: string;
}
export interface IUserNotificationTriggerPreferences {
    name: string;
    enabled: boolean;
    [index: string]: any;
}
export interface IUserNotificationPreferences {
    channelPreferences: {
        [index: string]: IUserNotificationChannelPreferences;
    };
    triggerPreferences: {
        [index: string]: IUserNotificationTriggerPreferences;
    };
}
export declare enum Triggers {
    CANCELLED_TRANSACTION = "cancelledTransaction",
    CREATED_PROXY = "createdProxy",
    EDIT_MULTISIG_USERS_EXECUTED = "editMultisigUsersExecuted",
    EDIT_MULTISIG_USERS_START = "editMultisigUsersStart",
    EXECUTED_PROXY = "executedProxy",
    EXECUTED_TRANSACTION = "executedTransaction",
    INIT_MULTISIG_TRANSFER = "initMultisigTransfer",
    SCHEDULED_APPROVAL_REMINDER = "scheduledApprovalReminder",
    APPROVAL_REMINDER = "approvalReminder"
}
export interface IDropdownOptions {
    optionName: string;
    archieved?: boolean;
}
export declare enum EFieldType {
    ATTACHMENT = "Attachment",
    SINGLE_SELECT = "Single-select",
    TEXT = "Text"
}
export interface ITransactionCategorySubfields {
    [subfield: string]: {
        subfieldName: string;
        subfieldType: EFieldType;
        required: boolean;
        dropdownOptions?: IDropdownOptions[];
    };
}
export interface ITransactionFields {
    [field: string]: {
        fieldName: string;
        fieldDesc: string;
        subfields: ITransactionCategorySubfields;
    };
}
export interface UserDetailsContextType {
    loggedInWallet: any;
    activeMultisig: string;
    address: string;
    createdAt: Date;
    fetchUserData?: any;
    fetchMultisigTransactionData?: any;
    multisigAddresses: IMultisigAddress[];
    multisigSettings: {
        [multisigAddress: string]: IMultisigSettings;
    };
    addressBook: IAddressBookItem[];
    setUserDetailsContextState: Dispatch<SetStateAction<UserDetailsContextType>>;
    activeMultisigData?: any;
    activeMultisigTxs?: any[];
    setLoading?: any;
    loading?: boolean;
    setActiveMultisigData: any;
    updateCurrentMultisigData: any;
    login?: () => any;
    notification_preferences?: any;
    connectAddress?: any;
    identityBackend: IdentityBackendService;
    setIdentityBackend: any;
    transactionFields: ITransactionFields;
}
export declare enum Wallet {
    WEB3AUTH = "web3-auth"
}
export interface AccountMeta {
    genesisHash: string | undefined;
    name: string;
    source: string;
}
export interface Account {
    address: string;
    meta: AccountMeta;
}
export type TokenSymbol = (typeof tokenSymbol)[keyof typeof tokenSymbol];
export interface ChainProps {
    blockTime: number;
    logo?: any;
    ss58Format: number;
    tokenDecimals: number;
    tokenSymbol: TokenSymbol;
    chainId: number;
    rpcEndpoint: string;
    existentialDeposit: string;
}
export type ChainPropType = {
    [network: string]: {
        blockExplorer: string;
        chainId: string;
        chainNamespace: string;
        decimals: number;
        displayName: string;
        rpcTarget: string;
        ticker: string;
        tickerName: string;
        logo: string;
    };
};
export interface IAddressBookItem {
    name: string;
    address: string;
    email?: string;
    discord?: string;
    telegram?: string;
    roles?: string[];
    nickName?: string;
}
interface IMultisigSettings {
    deleted: boolean;
    name: string;
}
export interface IUser {
    address: string;
    email: string | null;
    addressBook?: IAddressBookItem[];
    created_at: Date;
    multisigAddresses: IMultisigAddress[];
    multisigSettings: {
        [multisigAddress: string]: IMultisigSettings;
    };
    notification_preferences: IUserNotificationPreferences;
    transactionFields?: ITransactionFields;
}
export interface IMultisigAddress {
    address: string;
    name: string;
    signatories: string[];
    network: string;
    created_at: Date;
    updated_at?: Date;
    threshold: number;
    proxy?: string;
    disabled?: boolean;
    type?: 'fund' | 'sent';
}
export interface IUserResponse extends IUser {
    multisigAddresses: IMultisigAddress[];
}
export interface IAsset {
    name: string;
    logoURI: string;
    symbol: string;
    balance_usd: string;
    balance_token: string;
}
export interface ITxNotification {
    [address: string]: {
        lastNotified: Date;
    };
}
export interface IQueueItem {
    callData: string;
    callHash: string;
    network: string;
    status: 'Approval' | 'Cancelled' | 'Executed';
    created_at: Date;
    approvals: string[];
    threshold: number;
    note?: string;
    notifications?: ITxNotification;
}
export interface ITransaction {
    callData?: string;
    callHash: string;
    created_at: any;
    block_number: number;
    from: string;
    to: string | string[];
    id: string;
    token: string;
    amount_usd: number;
    amount_token: number;
    network: string;
    note?: string;
    notifications?: {
        [address: string]: {
            lastNotified: Date;
        };
    };
    type?: string;
    txHash?: string;
    executor?: string;
    transactionFields?: {
        category: string;
        subfields: {
            [subfield: string]: {
                name: string;
                value: string;
            };
        };
    };
}
export interface INotification {
    id: string;
    addresses: string[];
    created_at: Date;
    message: string;
    link?: string;
    type: 'sent' | 'recieved' | 'cancelled' | 'info';
    network: string;
}
export declare enum NotificationStatus {
    SUCCESS = "success",
    ERROR = "error",
    WARNING = "warning",
    INFO = "info"
}
export interface ISharedAddressBookRecord {
    name: string;
    address: string;
    email?: string;
    discord?: string;
    telegram?: string;
    roles?: string[];
}
export interface ISharedAddressBooks {
    records: {
        [address: string]: ISharedAddressBookRecord;
    };
    roles?: string[];
    multisig: string;
}
export interface IAllAddresses {
    [address: string]: {
        name: string;
        address: string;
        shared?: boolean;
        nickName?: string;
        email?: string;
        discord?: string;
        telegram?: string;
        roles?: string[];
    };
}
export {};
