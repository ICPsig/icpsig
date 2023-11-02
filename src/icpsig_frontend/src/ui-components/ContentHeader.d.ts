import { FC, ReactNode } from 'react';
interface IContentHeader {
    title?: ReactNode;
    subTitle?: ReactNode;
    rightElm?: ReactNode;
}
declare const ContentHeader: FC<IContentHeader>;
export default ContentHeader;
