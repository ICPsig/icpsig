import React, { FC } from 'react';
interface IMultisigDropdownProps {
    className?: string;
    activeAddress: 'Proxy' | 'Multisig';
    setActiveAddress: React.Dispatch<React.SetStateAction<'Proxy' | 'Multisig'>>;
}
declare const MultisigDropdown: FC<IMultisigDropdownProps>;
export default MultisigDropdown;
