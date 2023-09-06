import { writable } from 'svelte/store';

// Initialize the darkMode store with the value from localStorage
export const darkMode = writable(localStorage.getItem('dark-mode') === 'true');

// Update localStorage and toggle the dark class on the document whenever the darkMode store value changes
darkMode.subscribe(value => {
  document.documentElement.classList.toggle('dark', value);
  localStorage.setItem('dark-mode', value.toString());
});
