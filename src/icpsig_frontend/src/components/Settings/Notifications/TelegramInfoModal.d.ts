import React from 'react';
import { CHANNEL } from 'src/types';
declare const TelegramInfoModal: ({ getVerifyToken }: {
    getVerifyToken: (channel: CHANNEL) => Promise<string | undefined>;
}) => React.JSX.Element;
export default TelegramInfoModal;
