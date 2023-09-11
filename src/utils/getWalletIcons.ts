import metamaskLogo from '../assets/metamask.svg';
import walletConnectLogo from '../assets/walletconnectLogo.png';

export function getWalletIcon(index: number) {
  switch (index) {
    case 0:
      return metamaskLogo;
    case 1:
      return walletConnectLogo;
    default:
      return walletConnectLogo;
  }
}
