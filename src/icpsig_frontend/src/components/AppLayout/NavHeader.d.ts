import React, { FC } from 'react';
interface Props {
    className?: string;
    sideDrawer: boolean;
    setSideDrawer: React.Dispatch<React.SetStateAction<boolean>>;
    showSubmenu?: boolean;
    onClick?: VoidFunction;
}
declare const NavHeader: FC<Props>;
export default NavHeader;
