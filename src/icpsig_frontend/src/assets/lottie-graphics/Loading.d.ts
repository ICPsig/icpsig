import { ReactElement } from 'react';
interface Props {
    message?: string;
    width?: number;
    noWaitMessage?: boolean;
}
declare function LoadingLottie({ message, width, noWaitMessage }: Props): ReactElement;
export default LoadingLottie;
