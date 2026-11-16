(() => {
  const root = document.documentElement;
  const touch = matchMedia('(pointer: coarse)');

  function fit() {
    const width = root.clientWidth;
    const height = Math.min(window.innerHeight, window.visualViewport?.height || window.innerHeight);
    root.style.setProperty('--view-height', height + 'px');
    const compact = touch.matches || Math.min(width, height) <= 520 || width <= 760;
    const portrait = compact && height >= width;
    const wasPortraitLayout = root.classList.contains('portrait-game');
    root.classList.toggle('portrait-game', portrait);
    root.classList.toggle('compact-game', compact && !portrait);
    // Safari 15 has no container units. Measure the padded game surface instead.
    const surface = document.querySelector('.site-wrap');
    const style = getComputedStyle(surface);
    const contentWidth = surface.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    const contentHeight = surface.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
    root.style.setProperty('--content-width', contentWidth + 'px');
    root.style.setProperty('--content-height', contentHeight + 'px');
    document.querySelector('#input-hint').textContent = touch.matches
      ? 'Drag to aim · lift to drop'
      : 'Move to aim · click to drop';

    const scale = Math.min((width - 24) / 1180, (height - 16) / 800, 1.5);
    root.style.setProperty('--ui-scale', String(Math.max(0.1, scale)));
    if (wasPortraitLayout !== portrait) {
      window.dispatchEvent(new Event('potato:viewport'));
    }
  }

  fit();
  window.addEventListener('resize', fit);
  window.visualViewport?.addEventListener('resize', fit);
  window.addEventListener('orientationchange', () => requestAnimationFrame(fit));
  if (touch.addEventListener) touch.addEventListener('change', fit);
  else touch.addListener(fit);
})();
