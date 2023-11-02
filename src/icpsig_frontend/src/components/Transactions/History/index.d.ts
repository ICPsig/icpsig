import React from 'react';
import { FC } from 'react';
interface IHistory {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    refetch: boolean;
}
declare const History: FC<IHistory>;
export default History;
