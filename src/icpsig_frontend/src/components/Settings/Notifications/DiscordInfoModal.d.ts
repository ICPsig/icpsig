import React from 'react';
import { CHANNEL } from 'src/types';
declare const DiscordInfoModal: ({ getVerifyToken }: {
    getVerifyToken: (channel: CHANNEL) => Promise<string | void>;
}) => React.JSX.Element;
export default DiscordInfoModal;
