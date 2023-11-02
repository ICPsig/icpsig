import React from 'react';
interface Props {
    note: string;
    callHash: string;
    setUpdatedNote: React.Dispatch<React.SetStateAction<string>>;
}
declare const EditNote: ({ note, callHash, setUpdatedNote }: Props) => React.JSX.Element;
export default EditNote;
