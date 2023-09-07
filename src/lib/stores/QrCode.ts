import { writable } from 'svelte/store';

const qrCodeUri = writable<string>('');

export default qrCodeUri;
