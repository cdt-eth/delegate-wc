<svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
  <line
    stroke="currentColor"
    x1="1"
    y1="6"
    x2="12"
    y2="6"
    stroke-width="2"
    stroke-linecap="round"
    class="on-hover"
  />
  <path
    stroke="currentColor"
    d="M7.51431 1.5L11.757 5.74264M7.5 10.4858L11.7426 6.24314"
    stroke-width="2"
    stroke-linecap="round"
    class="point"
  />
</svg>

<style>
  .point {
    transition: all 75ms ease 0s;
    transform: translateX(-3px) !important;
  }
  .on-hover {
    opacity: 0 !important;
  }
  :global(.arrowBtn:hover .on-hover) {
    opacity: 1 !important;
  }
  :global(.arrowBtn:hover .point) {
    transform: translateX(0px) !important;
  }
</style>
