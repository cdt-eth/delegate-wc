import { writable } from 'svelte/store';

export const defaultState = {
  title: 'Requesting Connection',
  subtitle: 'Open the Metamask browser extension to connect your wallet.',
  showSpinner: true,
  errorCircle: false,
  shakeAnimation: false,
};

export const revisitingState = {
  title: 'Login to MetaMask',
  subtitle: 'To continue, please login to your MetaMask extension.',
  showSpinner: false,
  errorCircle: false,
  shakeAnimation: false,
};

export const errorState = {
  title: 'Request Cancelled',
  subtitle: 'You cancelled the request. Click above to try again.',
  showSpinner: false,
  errorCircle: true,
  shakeAnimation: true,
};

export const metamaskStateStore = writable(defaultState);
