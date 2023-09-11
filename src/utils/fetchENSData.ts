import { fetchEnsAvatar, fetchEnsName } from '@wagmi/core';

// Fetch relevant data after successful connection
export async function fetchEnsData(address: `0x${string}`) {
  const ensData = { ensName: null, avatarUrl: null };

  try {
    const ensName = await fetchEnsName({ address });

    if (ensName) {
      const avatarUrl = await fetchEnsAvatar({ name: ensName });
      Object.assign(ensData, { ensName, avatarUrl });
    }
  } catch (error) {
    console.error('Error fetching ENS data:', error);
  }

  return ensData;
}
