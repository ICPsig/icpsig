// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export const FIREBASE_FUNCTIONS_URL =
	process.env.REACT_APP_ENV === 'dev' ? process.env.REACT_APP_FIREBASE_FUNCTIONS_URL_DEV : 'https://us-central1-polkasafe-a8042.cloudfunctions.net';
export const NOTIFICATION_FUNCTION_URL = 'https://us-central1-polkasafe-a8042.cloudfunctions.net';
