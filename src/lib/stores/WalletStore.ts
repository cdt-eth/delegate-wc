import { writable } from 'svelte/store';
import { disconnect } from '@wagmi/core';

interface WalletState {
  address: string | null;
  connector: string | undefined;
  chain: string | undefined;
  status: 'connecting' | 'reconnecting' | 'connected' | 'disconnected' | null;
  provider?: any | null;
}

const initialState: WalletState = {
  address: null,
  connector: undefined,
  chain: undefined,
  status: 'disconnected',
  provider: null,
};

export const walletStore = writable<WalletState>(initialState);

export const disconnectWallet = async () => {
  try {
    const result = await disconnect();
    console.log('Successfully disconnected:', result);
    walletStore.set(initialState);
  } catch {
    console.log('Error disconnecting');
  }
};
