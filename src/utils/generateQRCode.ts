import QRCode from 'qrcode';
import { darkMode } from '../lib/stores/DarkModeStore';
import type { Writable } from 'svelte/store';

type DarkModeStore = Writable<boolean>;

export async function generateQRCode(uri: string): Promise<string> {
  let qrCodeUrl = '';
  let isDarkMode;

  // Subscribe to the store value
  const unsubscribe = darkMode.subscribe((value: boolean) => {
    isDarkMode = value;
  });

  try {
    let qrCodeUrl = await QRCode.toDataURL(uri, {
      color: {
        dark: isDarkMode ? '#ffffff' : '#2B2B2B',
        light: isDarkMode ? '#2B2B2B' : '#ffffff',
      },
    });
    return qrCodeUrl;
  } catch (err) {
    console.error(err);
  }

  // Unsubscribe after getting the value to avoid memory leaks
  unsubscribe();

  return qrCodeUrl;
}
