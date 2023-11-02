import React, { Dispatch, SetStateAction } from 'react';
type Props = {
    className?: string;
    currentPage: number;
    setPage: Dispatch<SetStateAction<number>>;
    totalDocs: number;
    defaultPageSize: number;
};
export default function Pagination({ className, currentPage, setPage, totalDocs, defaultPageSize }: Props): React.JSX.Element;
export {};
