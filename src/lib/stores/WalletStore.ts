import { writable } from 'svelte/store';
import { disconnect } from '@wagmi/core';

interface WalletState {
  address: string | null;
  ensName: string | null;
  avatarUrl: string | null;
  balance: string | null;
  connector: string | undefined;
  chain: string | undefined;
  chainId: number;
  status: 'connecting' | 'reconnecting' | 'connected' | 'disconnected' | null;
  provider?: any | null;
}

const initialState: WalletState = {
  address: null,
  ensName: null,
  avatarUrl: null,
  balance: null,
  connector: undefined,
  chain: undefined,
  chainId: 1,
  status: 'disconnected',
  provider: null,
};

export const walletStore = writable<WalletState>(initialState);

export const disconnectWallet = async () => {
  try {
    await disconnect();
    console.log('Successfully disconnected');
    walletStore.set(initialState);
  } catch {
    console.log('Error disconnecting');
  }
};
