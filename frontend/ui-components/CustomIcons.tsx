// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon"
import React from "react"
import HistorySVG from "@frontend/assets/History.svg"
import AddSVG from "@frontend/assets/icons/add.svg"
import AddBoxSVG from "@frontend/assets/icons/add-box.svg"
import AddressBookSVG from "@frontend/assets/icons/address-book.svg"
import AppsSVG from "@frontend/assets/icons/apps.svg"
import ArrowDownLeftSVG from "@frontend/assets/icons/arrow-down-left.svg"
import ArrowRightSVG from "@frontend/assets/icons/arrow-right.svg"
import ArrowUpRightSVG from "@frontend/assets/icons/arrow-up-right.svg"
import AssetsSVG from "@frontend/assets/icons/assets.svg"
import BellIconSVG from "@frontend/assets/icons/bell-icon.svg"
import BrainSVG from "@frontend/assets/icons/brain-icon.svg"
import ChainSVG from "@frontend/assets/icons/chain-icon.svg"
import CheckOutlinedSVG from "@frontend/assets/icons/CheckOutlined.svg"
import Circle3DotsSVG from "@frontend/assets/icons/circle-3-dots.svg"
import CircleArrowDownSVG from "@frontend/assets/icons/circle-arrow-down.svg"
import CircleArrowUpSVG from "@frontend/assets/icons/circle-arrow-up.svg"
import CircleCheckSVG from "@frontend/assets/icons/circle-check.svg"
import CirclePlusSVG from "@frontend/assets/icons/circle-plus.svg"
import CircleWatchSVG from "@frontend/assets/icons/circle-watch.svg"
import CloseSVG from "@frontend/assets/icons/close-icon.svg"
import CopySVG from "@frontend/assets/icons/copy.svg"
import CopyGreySVG from "@frontend/assets/icons/copy-icon-grey.svg"
import CreateMultisigSVG from "@frontend/assets/icons/createMultisig.svg"
import DashDotSVG from "@frontend/assets/icons/dash-dot.svg"
import DatePickerSVG from "@frontend/assets/icons/date-picker-icon.svg"
import DeleteSVG from "@frontend/assets/icons/delete.svg"
import DiscSVG from "@frontend/assets/icons/disc.svg"
import DiscordIconSVG from "@frontend/assets/icons/discord-icon.svg"
// import DocsSVG from "@frontend/assets/icons/document.svg"
import DollarSVG from "@frontend/assets/icons/dollar.svg"
import DonateSVG from "@frontend/assets/icons/donate.svg"
import EditSVG from "@frontend/assets/icons/edit.svg"
import ElementIconSVG from "@frontend/assets/icons/element-icon.svg"
import ExportArrowSVG from "@frontend/assets/icons/export-arrow.svg"
import ExternalLinkSVG from "@frontend/assets/icons/external-link.svg"
import HomeSVG from "@frontend/assets/icons/home.svg"
import ImportArrowSVG from "@frontend/assets/icons/import-arrow.svg"
import KeySVG from "@frontend/assets/icons/key.svg"
import LineSVG from "@frontend/assets/icons/line.svg"
import LinkSVG from "@frontend/assets/icons/link.svg"
import MailIconSVG from "@frontend/assets/icons/mail-icon.svg"
import MenuSVG from "@frontend/assets/icons/menu.svg"
import MultisigLockSVG from "@frontend/assets/icons/multisig-lock.svg"
import NoNotificationSVG from "@frontend/assets/icons/no-notification.svg"
import NoQueuedTransactionSVG from "@frontend/assets/icons/no-queued-transaction.svg"
import NoTransactionSVG from "@frontend/assets/icons/no-transaction.svg"
import NotificationSVG from "@frontend/assets/icons/notification.svg"
import NotifyMailSVG from "@frontend/assets/icons/notify-mail.svg"
import OutlineCheckSVG from "@frontend/assets/icons/outline-check.svg"
import OutlineCloseSVG from "@frontend/assets/icons/outline-close.svg"
import PasteSVG from "@frontend/assets/icons/paste-icon.svg"
import PencilSVG from "@frontend/assets/icons/pencil.svg"
import PencilNotificationSVG from "@frontend/assets/icons/pencil-notification.svg"
import PolkadotLogoTextSVG from "@frontend/assets/icons/polkadot-logo-text.svg"
import PolkasafeSVG from "@frontend/assets/icons/polkasafe.svg"
import PolkasafeLogoSVG from "@frontend/assets/icons/polkasafe-logo.svg"
import PolkasafeTextSVG from "@frontend/assets/icons/polkasafe-text.svg"
import PSSVG from "@frontend/assets/icons/ps-icon.svg"
import QRSVG from "@frontend/assets/icons/qr.svg"
import RightArrowOutlinedSVG from "@frontend/assets/icons/RightArrowOutlined.svg"
import SearchSVG from "@frontend/assets/icons/search.svg"
import SettingsSVG from "@frontend/assets/icons/settings.svg"
import ShareSVG from "@frontend/assets/icons/share-icon.svg"
import SharedIconSVG from "@frontend/assets/icons/Shared.svg"
import SlackIconSVG from "@frontend/assets/icons/slack-icon.svg"
import SquareDownArrowSVG from "@frontend/assets/icons/square-down-arrow.svg"
import SubscanSVG from "@frontend/assets/icons/subscan.svg"
import TelegramIconSVG from "@frontend/assets/icons/telegram-icon.svg"
import TransactionSVG from "@frontend/assets/icons/transaction.svg"
import TrashSVG from "@frontend/assets/icons/trash.svg"
import UploadBoxSVG from "@frontend/assets/icons/upload-box.svg"
import UserPlusSVG from "@frontend/assets/icons/user-plus.svg"
// import WalletSVG from "@frontend/assets/icons/wallet-icon.svg"
import WarningSVG from "@frontend/assets/icons/warning.svg"
import WarningCircleSVG from "@frontend/assets/icons/warning-circle.svg"
import KusamaSVG from "@frontend/assets/parachains-icons/kusama.svg"
import PolkadotSVG from "@frontend/assets/parachains-icons/polkadot.svg"
import QueueSVG from "@frontend/assets/Queue.svg"
import PolkadotWalletSVG from "@frontend/assets/wallet/polkadotjs-icon.svg"
import SubWalletSVG from "@frontend/assets/wallet/subwallet-icon.svg"
import PasswordFilledSVG from "@frontend/assets/icons/password-filled.svg"
import PasswordOutlinedSVG from "@frontend/assets/icons/password-outlined.svg"
import Icon from "./CustomIcon"

export const AddIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={AddSVG} {...props} />
)

export const AddressBookIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={AddressBookSVG} {...props} />
)

export const AppsIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={AppsSVG} {...props} />
)

export const AssetsIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={AssetsSVG} {...props} />
)

export const ArrowDownLeftIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={ArrowDownLeftSVG} {...props} />
)

export const ArrowRightIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={ArrowRightSVG} {...props} />
)

export const ArrowUpRightIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={ArrowUpRightSVG} {...props} />
)

export const Circle3DotsIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={Circle3DotsSVG} {...props} />
)

export const CircleArrowDownIcon = (
  props: Partial<CustomIconComponentProps>,
) => <Icon component={CircleArrowDownSVG} {...props} />

export const CircleArrowUpIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={CircleArrowUpSVG} {...props} />
)

export const CircleCheckIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={CircleCheckSVG} {...props} />
)

export const CirclePlusIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={CirclePlusSVG} {...props} />
)

export const CircleWatchIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={CircleWatchSVG} {...props} />
)

export const CopyIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={CopySVG} {...props} />
)

export const DatePickerIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={DatePickerSVG} {...props} />
)

export const DeleteIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={DeleteSVG} {...props} />
)

export const DollarIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={DollarSVG} {...props} />
)

export const DonateIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={DonateSVG} {...props} />
)

export const EditIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={EditSVG} {...props} />
)

export const ExternalLinkIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={ExternalLinkSVG} {...props} />
)

export const HomeIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={HomeSVG} {...props} />
)

export const KeyIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={KeySVG} {...props} />
)

export const LineIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={LineSVG} {...props} />
)

export const MenuIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={MenuSVG} {...props} />
)

export const NoTransactionIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={NoTransactionSVG} {...props} />
)

export const NoQueuedTransactionIcon = (
  props: Partial<CustomIconComponentProps>,
) => <Icon component={NoQueuedTransactionSVG} {...props} />

export const NotificationIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={NotificationSVG} {...props} />
)

export const NoNotificationIcon = (
  props: Partial<CustomIconComponentProps>,
) => <Icon component={NoNotificationSVG} {...props} />

export const OutlineCheckIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={OutlineCheckSVG} {...props} />
)

export const OutlineCloseIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={OutlineCloseSVG} {...props} />
)

export const PencilNotificationIcon = (
  props: Partial<CustomIconComponentProps>,
) => <Icon component={PencilNotificationSVG} {...props} />

export const PasteIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={PasteSVG} {...props} />
)

export const PencilIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={PencilSVG} {...props} />
)

export const SearchIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={SearchSVG} {...props} />
)

export const SquareDownArrowIcon = (
  props: Partial<CustomIconComponentProps>,
) => <Icon component={SquareDownArrowSVG} {...props} />

export const SettingsIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={SettingsSVG} {...props} />
)

export const TransactionIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={TransactionSVG} {...props} />
)

export const TrashIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={TrashSVG} {...props} />
)

export const UserPlusIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={UserPlusSVG} {...props} />
)

export const WarningIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={WarningSVG} {...props} />
)

// export const WarningRoundedIcon = (
//   props: Partial<CustomIconComponentProps>,
// ) => <Icon component={WarningRoundedSVG} {...props} />

export const WarningCircleIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={WarningCircleSVG} {...props} />
)

// export const WalletIcon = (props: Partial<CustomIconComponentProps>) => (
//   <Icon component={WalletSVG} {...props} />
// )

export const MultisigLockIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={MultisigLockSVG} {...props} />
)

export const PolkadotLogoTextIcon = (
  props: Partial<CustomIconComponentProps>,
) => <Icon component={PolkadotLogoTextSVG} {...props} />

export const PolkasafeIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={PolkasafeSVG} {...props} />
)

export const PolkasafeLogoIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={PolkasafeLogoSVG} {...props} />
)

export const PolkasafeTextIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={PolkasafeTextSVG} {...props} />
)

export const SubscanIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={SubscanSVG} {...props} />
)

export const QRIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={QRSVG} {...props} />
)
export const PSIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={PSSVG} {...props} />
)
export const ChainIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={ChainSVG} {...props} />
)
export const BrainIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={BrainSVG} {...props} />
)

// PARACHAINS ICONS

export const KusamaIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={KusamaSVG} {...props} />
)

export const PolkadotIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={PolkadotSVG} {...props} />
)
export const CloseIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={CloseSVG} {...props} />
)
export const ImportArrowIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={ImportArrowSVG} {...props} />
)
export const ExportArrowIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={ExportArrowSVG} {...props} />
)
export const ShareIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={ShareSVG} {...props} />
)
export const CopyGreyIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={CopyGreySVG} {...props} />
)
export const UploadBoxIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={UploadBoxSVG} {...props} />
)
export const AddBoxIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={AddBoxSVG} {...props} />
)
export const DashDotIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={DashDotSVG} {...props} />
)
export const CreateMultisigIcon = (
  props: Partial<CustomIconComponentProps>,
) => <Icon component={CreateMultisigSVG} {...props} />
export const LinkIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={LinkSVG} {...props} />
)
export const NotifyMail = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={NotifyMailSVG} {...props} />
)
export const RightArrowOutlined = (
  props: Partial<CustomIconComponentProps>,
) => <Icon component={RightArrowOutlinedSVG} {...props} />
export const CheckOutlined = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={CheckOutlinedSVG} {...props} />
)
export const Disc = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={DiscSVG} {...props} />
)

export const HistoryIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={HistorySVG} {...props} />
)

export const QueueIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={QueueSVG} {...props} />
)

export const PolkadotWalletIcon = (
  props: Partial<CustomIconComponentProps>,
) => <Icon component={PolkadotWalletSVG} {...props} />

export const SubWalletIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={SubWalletSVG} {...props} />
)

export const BellIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={BellIconSVG} {...props} />
)

export const MailIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={MailIconSVG} {...props} />
)

export const TelegramIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={TelegramIconSVG} {...props} />
)

export const DiscordIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={DiscordIconSVG} {...props} />
)

export const ElementIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={ElementIconSVG} {...props} />
)

export const SlackIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={SlackIconSVG} {...props} />
)

// export const DocsIcon = (props: Partial<CustomIconComponentProps>) => (
//   <Icon component={DocsSVG} {...props} />
// )

export const SharedIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={SharedIconSVG} {...props} />
)

export const PasswordOutlinedIcon: React.FC<
  Partial<CustomIconComponentProps>
> = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={PasswordOutlinedSVG} {...props} />
)

export const PasswordFilledIcon: React.FC<Partial<CustomIconComponentProps>> = (
  props: Partial<CustomIconComponentProps>,
) => <Icon component={PasswordFilledSVG} {...props} />
