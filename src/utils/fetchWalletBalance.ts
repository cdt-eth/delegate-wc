import { fetchBalance } from '@wagmi/core';

// Format the balance 2-4 decimal places plus the symbol
export async function fetchWalletBalance(address: `0x${string}`) {
  const balance = await fetchBalance({ address });
  const formattedBalance = await parseFloat(balance.formatted).toFixed(
    Math.max(2, Math.min(4, (balance.formatted.split('.')[1] || '').length)),
  );
  return formattedBalance;
}
