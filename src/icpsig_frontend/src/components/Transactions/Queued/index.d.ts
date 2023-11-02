import React, { FC } from 'react';
interface IQueued {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    refetch: boolean;
    setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}
declare const Queued: FC<IQueued>;
export default Queued;
