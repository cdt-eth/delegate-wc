export function copyToClipboard(text: string | null, copied: boolean) {
  if (!text) return;
  navigator.clipboard.writeText(text);
  copied = true;

  setTimeout(() => {
    copied = false;
  }, 300);
  return copied;
}
