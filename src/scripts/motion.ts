const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Section entrances: each part rises in turn, once.
const sections = document.querySelectorAll<HTMLElement>('.reveal');
if (reduced || !('IntersectionObserver' in window)) {
  sections.forEach((section) => section.classList.add('in'));
} else {
  sections.forEach((section) => {
    [...section.children].forEach((child, i) => {
      (child as HTMLElement).style.setProperty('--delay', `${Math.min(i, 6) * 70}ms`);
    });
  });
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px' }
  );
  sections.forEach((section) => observer.observe(section));
}

// The dashboard picture slowly crossfades through the replay.
const frames = [...document.querySelectorAll<HTMLImageElement>('#fade img')];
if (frames.length > 1 && !reduced) {
  let current = 0;
  frames[0].classList.add('on');
  setInterval(() => {
    if (document.hidden) return;
    frames[current].classList.remove('on');
    current = (current + 1) % frames.length;
    frames[current].classList.add('on');
  }, 6000);
}

// The demo loop waits for a click under reduced motion, and only plays while on screen.
document.querySelectorAll<HTMLVideoElement>('video.clip').forEach((video) => {
  if (reduced) {
    video.removeAttribute('autoplay');
    video.pause();
    video.controls = true;
    return;
  }
  if (!('IntersectionObserver' in window)) return;
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) video.play().catch(() => {});
    else video.pause();
  }).observe(video);
});
