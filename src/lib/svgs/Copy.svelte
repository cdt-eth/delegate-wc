<script>
  import { darkMode } from '../stores/DarkModeStore';
</script>

<svg
  aria-hidden="true"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  ><path
    d="M14 9.5V7C14 5.89543 13.1046 5 12 5H7C5.89543 5 5 5.89543 5 7V12C5 13.1046 5.89543 14 7 14H9.5"
    stroke={$darkMode ? '#fff' : '#000'}
    stroke-width="2"
  /><rect
    x="10"
    y="10"
    width="9"
    height="9"
    rx="2"
    stroke={$darkMode ? '#fff' : '#000'}
    stroke-width="2"
  />
</svg>
