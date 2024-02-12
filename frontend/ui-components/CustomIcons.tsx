// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";
import React from "react";
import { ReactComponent as HistorySVG } from "@frontend/assets/History.svg";
import { ReactComponent as AddSVG } from "@frontend/assets/icons/add.svg";
import { ReactComponent as AddBoxSVG } from "@frontend/assets/icons/add-box.svg";
import { ReactComponent as AddressBookSVG } from "@frontend/assets/icons/address-book.svg";
import { ReactComponent as AppsSVG } from "@frontend/assets/icons/apps.svg";
import { ReactComponent as ArrowDownLeftSVG } from "@frontend/assets/icons/arrow-down-left.svg";
import { ReactComponent as ArrowRightSVG } from "@frontend/assets/icons/arrow-right.svg";
import { ReactComponent as ArrowUpRightSVG } from "@frontend/assets/icons/arrow-up-right.svg";
import { ReactComponent as AssetsSVG } from "@frontend/assets/icons/assets.svg";
import { ReactComponent as BellIconSVG } from "@frontend/assets/icons/bell-icon.svg";
import { ReactComponent as BrainSVG } from "@frontend/assets/icons/brain-icon.svg";
import { ReactComponent as ChainSVG } from "@frontend/assets/icons/chain-icon.svg";
import { ReactComponent as CheckOutlinedSVG } from "@frontend/assets/icons/CheckOutlined.svg";
import { ReactComponent as Circle3DotsSVG } from "@frontend/assets/icons/circle-3-dots.svg";
import { ReactComponent as CircleArrowDownSVG } from "@frontend/assets/icons/circle-arrow-down.svg";
import { ReactComponent as CircleArrowUpSVG } from "@frontend/assets/icons/circle-arrow-up.svg";
import { ReactComponent as CircleCheckSVG } from "@frontend/assets/icons/circle-check.svg";
import { ReactComponent as CirclePlusSVG } from "@frontend/assets/icons/circle-plus.svg";
import { ReactComponent as CircleWatchSVG } from "@frontend/assets/icons/circle-watch.svg";
import { ReactComponent as CloseSVG } from "@frontend/assets/icons/close-icon.svg";
import { ReactComponent as CopySVG } from "@frontend/assets/icons/copy.svg";
import { ReactComponent as CopyGreySVG } from "@frontend/assets/icons/copy-icon-grey.svg";
import { ReactComponent as CreateMultisigSVG } from "@frontend/assets/icons/createMultisig.svg";
import { ReactComponent as DashDotSVG } from "@frontend/assets/icons/dash-dot.svg";
import { ReactComponent as DatePickerSVG } from "@frontend/assets/icons/date-picker-icon.svg";
import { ReactComponent as DeleteSVG } from "@frontend/assets/icons/delete.svg";
import { ReactComponent as DiscSVG } from "@frontend/assets/icons/disc.svg";
import { ReactComponent as DiscordIconSVG } from "@frontend/assets/icons/discord-icon.svg";
import { ReactComponent as DocsSVG } from "@frontend/assets/icons/document.svg";
import { ReactComponent as DollarSVG } from "@frontend/assets/icons/dollar.svg";
import { ReactComponent as DonateSVG } from "@frontend/assets/icons/donate.svg";
import { ReactComponent as EditSVG } from "@frontend/assets/icons/edit.svg";
import { ReactComponent as ElementIconSVG } from "@frontend/assets/icons/element-icon.svg";
import { ReactComponent as ExportArrowSVG } from "@frontend/assets/icons/export-arrow.svg";
import { ReactComponent as ExternalLinkSVG } from "@frontend/assets/icons/external-link.svg";
import { ReactComponent as HomeSVG } from "@frontend/assets/icons/home.svg";
import { ReactComponent as ImportArrowSVG } from "@frontend/assets/icons/import-arrow.svg";
import { ReactComponent as KeySVG } from "@frontend/assets/icons/key.svg";
import { ReactComponent as LineSVG } from "@frontend/assets/icons/line.svg";
import { ReactComponent as LinkSVG } from "@frontend/assets/icons/link.svg";
import { ReactComponent as MailIconSVG } from "@frontend/assets/icons/mail-icon.svg";
import { ReactComponent as MenuSVG } from "@frontend/assets/icons/menu.svg";
import { ReactComponent as MultisigLockSVG } from "@frontend/assets/icons/multisig-lock.svg";
import { ReactComponent as NoNotificationSVG } from "@frontend/assets/icons/no-notification.svg";
import { ReactComponent as NoQueuedTransactionSVG } from "@frontend/assets/icons/no-queued-transaction.svg";
import { ReactComponent as NoTransactionSVG } from "@frontend/assets/icons/no-transaction.svg";
import { ReactComponent as NotificationSVG } from "@frontend/assets/icons/notification.svg";
import { ReactComponent as NotifyMailSVG } from "@frontend/assets/icons/notify-mail.svg";
import { ReactComponent as OutlineCheckSVG } from "@frontend/assets/icons/outline-check.svg";
import { ReactComponent as OutlineCloseSVG } from "@frontend/assets/icons/outline-close.svg";
import { ReactComponent as PasteSVG } from "@frontend/assets/icons/paste-icon.svg";
import { ReactComponent as PencilSVG } from "@frontend/assets/icons/pencil.svg";
import { ReactComponent as PencilNotificationSVG } from "@frontend/assets/icons/pencil-notification.svg";
import { ReactComponent as PolkadotLogoTextSVG } from "@frontend/assets/icons/polkadot-logo-text.svg";
import { ReactComponent as PolkasafeSVG } from "@frontend/assets/icons/polkasafe.svg";
import { ReactComponent as PolkasafeLogoSVG } from "@frontend/assets/icons/polkasafe-logo.svg";
import { ReactComponent as PolkasafeTextSVG } from "@frontend/assets/icons/polkasafe-text.svg";
import { ReactComponent as PSSVG } from "@frontend/assets/icons/ps-icon.svg";
import { ReactComponent as QRSVG } from "@frontend/assets/icons/qr.svg";
import { ReactComponent as RightArrowOutlinedSVG } from "@frontend/assets/icons/RightArrowOutlined.svg";
import { ReactComponent as SearchSVG } from "@frontend/assets/icons/search.svg";
import { ReactComponent as SettingsSVG } from "@frontend/assets/icons/settings.svg";
import { ReactComponent as ShareSVG } from "@frontend/assets/icons/share-icon.svg";
import { ReactComponent as SharedIconSVG } from "@frontend/assets/icons/Shared.svg";
import { ReactComponent as SlackIconSVG } from "@frontend/assets/icons/slack-icon.svg";
import { ReactComponent as SquareDownArrowSVG } from "@frontend/assets/icons/square-down-arrow.svg";
import { ReactComponent as SubscanSVG } from "@frontend/assets/icons/subscan.svg";
import { ReactComponent as TelegramIconSVG } from "@frontend/assets/icons/telegram-icon.svg";
import { ReactComponent as TransactionSVG } from "@frontend/assets/icons/transaction.svg";
import { ReactComponent as TrashSVG } from "@frontend/assets/icons/trash.svg";
import { ReactComponent as UploadBoxSVG } from "@frontend/assets/icons/upload-box.svg";
import { ReactComponent as UserPlusSVG } from "@frontend/assets/icons/user-plus.svg";
import { ReactComponent as WalletSVG } from "@frontend/assets/icons/wallet-icon.svg";
import { ReactComponent as WarningSVG } from "@frontend/assets/icons/warning.svg";
import { ReactComponent as WarningCircleSVG } from "@frontend/assets/icons/warning-circle.svg";
import { ReactComponent as WarningRoundedSVG } from "@frontend/assets/icons/warning-rounded.svg";
import { ReactComponent as KusamaSVG } from "@frontend/assets/parachains-icons/kusama.svg";
import { ReactComponent as PolkadotSVG } from "@frontend/assets/parachains-icons/polkadot.svg";
import { ReactComponent as QueueSVG } from "@frontend/assets/Queue.svg";
import { ReactComponent as PolkadotWalletSVG } from "@frontend/assets/wallet/polkadotjs-icon.svg";
import { ReactComponent as SubWalletSVG } from "@frontend/assets/wallet/subwallet-icon.svg";
import { ReactComponent as PasswordFilledSVG } from "@frontend/assets/icons/password-filled.svg";
import { ReactComponent as PasswordOutlinedSVG } from "@frontend/assets/icons/password-outlined.svg";
import { ReactComponent as CKBTC } from "@frontend/assets/icons/ckbtc.svg";
import Icon from "@frontend/ui-components/CustomIcon";

export const AddIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={AddSVG} {...props} />
);

export const AddressBookIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={AddressBookSVG} {...props} />
);

export const AppsIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={AppsSVG} {...props} />
);

export const AssetsIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={AssetsSVG} {...props} />
);

export const ArrowDownLeftIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={ArrowDownLeftSVG} {...props} />
);

export const ArrowRightIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={ArrowRightSVG} {...props} />
);

export const ArrowUpRightIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={ArrowUpRightSVG} {...props} />
);

export const Circle3DotsIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={Circle3DotsSVG} {...props} />
);

export const CircleArrowDownIcon = (
  props: Partial<CustomIconComponentProps>,
) => <Icon component={CircleArrowDownSVG} {...props} />;

export const CircleArrowUpIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={CircleArrowUpSVG} {...props} />
);

export const CircleCheckIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={CircleCheckSVG} {...props} />
);

export const CirclePlusIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={CirclePlusSVG} {...props} />
);

export const CircleWatchIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={CircleWatchSVG} {...props} />
);

export const CopyIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={CopySVG} {...props} />
);

export const DatePickerIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={DatePickerSVG} {...props} />
);

export const DeleteIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={DeleteSVG} {...props} />
);

export const DollarIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={DollarSVG} {...props} />
);

export const DonateIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={DonateSVG} {...props} />
);

export const EditIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={EditSVG} {...props} />
);

export const ExternalLinkIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={ExternalLinkSVG} {...props} />
);

export const HomeIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={HomeSVG} {...props} />
);

export const KeyIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={KeySVG} {...props} />
);

export const LineIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={LineSVG} {...props} />
);

export const MenuIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={MenuSVG} {...props} />
);

export const NoTransactionIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={NoTransactionSVG} {...props} />
);

export const NoQueuedTransactionIcon = (
  props: Partial<CustomIconComponentProps>,
) => <Icon component={NoQueuedTransactionSVG} {...props} />;

export const NotificationIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={NotificationSVG} {...props} />
);

export const NoNotificationIcon = (
  props: Partial<CustomIconComponentProps>,
) => <Icon component={NoNotificationSVG} {...props} />;

export const OutlineCheckIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={OutlineCheckSVG} {...props} />
);

export const OutlineCloseIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={OutlineCloseSVG} {...props} />
);

export const PencilNotificationIcon = (
  props: Partial<CustomIconComponentProps>,
) => <Icon component={PencilNotificationSVG} {...props} />;

export const PasteIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={PasteSVG} {...props} />
);

export const PencilIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={PencilSVG} {...props} />
);

export const SearchIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={SearchSVG} {...props} />
);

export const SquareDownArrowIcon = (
  props: Partial<CustomIconComponentProps>,
) => <Icon component={SquareDownArrowSVG} {...props} />;

export const SettingsIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={SettingsSVG} {...props} />
);

export const TransactionIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={TransactionSVG} {...props} />
);

export const TrashIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={TrashSVG} {...props} />
);

export const UserPlusIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={UserPlusSVG} {...props} />
);

export const WarningIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={WarningSVG} {...props} />
);

export const WarningRoundedIcon = (
  props: Partial<CustomIconComponentProps>,
) => <Icon component={WarningRoundedSVG} {...props} />;

export const WarningCircleIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={WarningCircleSVG} {...props} />
);

export const WalletIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={WalletSVG} {...props} />
);

export const MultisigLockIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={MultisigLockSVG} {...props} />
);

export const PolkadotLogoTextIcon = (
  props: Partial<CustomIconComponentProps>,
) => <Icon component={PolkadotLogoTextSVG} {...props} />;

export const PolkasafeIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={PolkasafeSVG} {...props} />
);

export const PolkasafeLogoIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={PolkasafeLogoSVG} {...props} />
);

export const PolkasafeTextIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={PolkasafeTextSVG} {...props} />
);

export const SubscanIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={SubscanSVG} {...props} />
);

export const QRIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={QRSVG} {...props} />
);
export const PSIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={PSSVG} {...props} />
);
export const ChainIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={ChainSVG} {...props} />
);
export const BrainIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={BrainSVG} {...props} />
);

// PARACHAINS ICONS

export const KusamaIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={KusamaSVG} {...props} />
);

export const PolkadotIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={PolkadotSVG} {...props} />
);
export const CloseIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={CloseSVG} {...props} />
);
export const ImportArrowIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={ImportArrowSVG} {...props} />
);
export const ExportArrowIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={ExportArrowSVG} {...props} />
);
export const ShareIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={ShareSVG} {...props} />
);
export const CopyGreyIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={CopyGreySVG} {...props} />
);
export const UploadBoxIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={UploadBoxSVG} {...props} />
);
export const AddBoxIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={AddBoxSVG} {...props} />
);
export const DashDotIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={DashDotSVG} {...props} />
);
export const CreateMultisigIcon = (
  props: Partial<CustomIconComponentProps>,
) => <Icon component={CreateMultisigSVG} {...props} />;
export const LinkIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={LinkSVG} {...props} />
);
export const NotifyMail = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={NotifyMailSVG} {...props} />
);
export const RightArrowOutlined = (
  props: Partial<CustomIconComponentProps>,
) => <Icon component={RightArrowOutlinedSVG} {...props} />;
export const CheckOutlined = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={CheckOutlinedSVG} {...props} />
);
export const Disc = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={DiscSVG} {...props} />
);

export const HistoryIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={HistorySVG} {...props} />
);

export const QueueIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={QueueSVG} {...props} />
);

export const PolkadotWalletIcon = (
  props: Partial<CustomIconComponentProps>,
) => <Icon component={PolkadotWalletSVG} {...props} />;

export const SubWalletIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={SubWalletSVG} {...props} />
);

export const BellIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={BellIconSVG} {...props} />
);

export const MailIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={MailIconSVG} {...props} />
);

export const TelegramIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={TelegramIconSVG} {...props} />
);

export const DiscordIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={DiscordIconSVG} {...props} />
);

export const ElementIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={ElementIconSVG} {...props} />
);

export const SlackIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={SlackIconSVG} {...props} />
);

export const DocsIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={DocsSVG} {...props} />
);

export const SharedIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={SharedIconSVG} {...props} />
);

export const PasswordOutlinedIcon: React.FC<
  Partial<CustomIconComponentProps>
> = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={PasswordOutlinedSVG} {...props} />
);

export const PasswordFilledIcon: React.FC<Partial<CustomIconComponentProps>> = (
  props: Partial<CustomIconComponentProps>,
) => <Icon component={PasswordFilledSVG} {...props} />;

export const CKBTCIcon: React.FC<Partial<CustomIconComponentProps>> = (
  props: Partial<CustomIconComponentProps>,
) => <Icon component={CKBTC} {...props} />;
