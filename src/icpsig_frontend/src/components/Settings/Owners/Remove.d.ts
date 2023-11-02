import React from 'react';
declare const RemoveOwner: ({ addressToRemove, oldThreshold, oldSignatoriesLength, onCancel }: {
    addressToRemove: string;
    oldThreshold: number;
    oldSignatoriesLength: number;
    onCancel: () => void;
}) => React.JSX.Element;
export default RemoveOwner;
