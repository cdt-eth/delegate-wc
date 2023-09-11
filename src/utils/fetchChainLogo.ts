import defaultLogo from '../assets/chains/default.jpeg';
import ethereumLogo from '../assets/chains/ethereum.svg';
import goerliLogo from '../assets/chains/goerli.webp';
import sepoliaLogo from '../assets/chains/sepolia.webp';
import arbitrumoneLogo from '../assets/chains/arbitrumone.png';
import arbitrumgoerliLogo from '../assets/chains/arbitrumgoerli.png';
import avalancheLogo from '../assets/chains/avalanche.png';
import avalanchefujiLogo from '../assets/chains/avalanchefuji.png';
import baseLogo from '../assets/chains/base.webp';
import basegoerliLogo from '../assets/chains/basegoerli.jpeg';
import bnbsmartchainLogo from '../assets/chains/bnbsmartchain.png';
import binancesmartchaintestnetLogo from '../assets/chains/binancesmartchaintestnet.webp';
import cantoLogo from '../assets/chains/canto.png';
import celoLogo from '../assets/chains/celo.png';
import alfajoresLogo from '../assets/chains/alfajores.jpeg';
import fantomLogo from '../assets/chains/fantom.png';
import fantomtestnetLogo from '../assets/chains/fantomtestnet.png';
import gnosisLogo from '../assets/chains/gnosis.png';
import gnosischiadoLogo from '../assets/chains/gnosischiado.jpeg';
import klaytnLogo from '../assets/chains/klaytn.png';
import opmainnetLogo from '../assets/chains/opmainnet.png';
import optimismgoerliLogo from '../assets/chains/optimismgoerli.png';
import polygonLogo from '../assets/chains/polygon.svg';
import polygonmumbaiLogo from '../assets/chains/polygonmumbai.jpeg';
import zoraLogo from '../assets/chains/zora.png';
import zoragoerlitestnetLogo from '../assets/chains/zoragoerlitestnet.svg';

export type Option = {
  name: string;
  chainId: number;
  logo: string;
};

export function fetchChainLogo(chain: string) {
  const imageName = chain.toLowerCase().replace(/\s+/g, '');

  let logo;

  switch (imageName) {
    case 'ethereum':
      logo = ethereumLogo;
      break;
    case 'goerli':
      logo = goerliLogo;
      break;
    case 'sepolia':
      logo = sepoliaLogo;
      break;
    case 'arbitrumone':
      logo = arbitrumoneLogo;
      break;
    case 'arbitrumgoerli':
      logo = arbitrumgoerliLogo;
      break;
    case 'avalanche':
      logo = avalancheLogo;
      break;
    case 'avalanchefuji':
      logo = avalanchefujiLogo;
      break;
    case 'base':
      logo = baseLogo;
      break;
    case 'basegoerli':
      logo = basegoerliLogo;
      break;
    case 'bnbsmartchain':
      logo = bnbsmartchainLogo;
      break;
    case 'binancesmartchaintestnet':
      logo = binancesmartchaintestnetLogo;
      break;
    case 'canto':
      logo = cantoLogo;
      break;
    case 'celo':
      logo = celoLogo;
      break;
    case 'alfajores':
      logo = alfajoresLogo;
      break;
    case 'fantom':
      logo = fantomLogo;
      break;
    case 'fantomtestnet':
      logo = fantomtestnetLogo;
      break;
    case 'gnosis':
      logo = gnosisLogo;
      break;
    case 'gnosischiado':
      logo = gnosischiadoLogo;
      break;
    case 'klaytn':
      logo = klaytnLogo;
      break;
    case 'opmainnet':
      logo = opmainnetLogo;
      break;
    case 'optimismgoerli':
      logo = optimismgoerliLogo;
      break;
    case 'polygon':
      logo = polygonLogo;
      break;
    case 'polygonmumbai':
      logo = polygonmumbaiLogo;
      break;
    case 'zora':
      logo = zoraLogo;
      break;
    case 'zoragoerlitestnet':
      logo = zoragoerlitestnetLogo;
      break;
    default:
      logo = defaultLogo;
  }

  return logo;
}
