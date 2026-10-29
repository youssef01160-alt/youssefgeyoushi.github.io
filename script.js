// Nav background + floating WhatsApp once the page scrolls
const nav = document.querySelector('.nav');
const wa = document.querySelector('.wa-float');
const onScroll = () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
  wa.classList.toggle('show', window.scrollY > window.innerHeight * 0.8);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu
const menuBtn = document.querySelector('.menu-btn');
const setMenu = open => {
  nav.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
};
menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => setMenu(false)));

document.getElementById('year').textContent = new Date().getFullYear();

// Duplicate the credits so the marquee loops seamlessly
const track = document.querySelector('.marquee-track');
track.innerHTML += track.innerHTML;
track.querySelectorAll('img, span').forEach((el, i, all) => { if (i >= all.length / 2) el.setAttribute('aria-hidden', 'true'); });

// Lightbox player
const lb = document.getElementById('lightbox');
const lbVideo = document.getElementById('lb-video');
const lbTitle = document.getElementById('lb-title');
let lastFocus = null;

function openVideo(src, title) {
  lastFocus = document.activeElement;
  lbVideo.src = src;
  lbTitle.textContent = title || '';
  lb.hidden = false;
  document.body.style.overflow = 'hidden';
  lbVideo.play().catch(() => {});
  lb.querySelector('.lb-close').focus();
}
function closeVideo() {
  lbVideo.pause();
  lbVideo.removeAttribute('src');
  lbVideo.load();
  lb.hidden = true;
  document.body.style.overflow = '';
  if (lastFocus) lastFocus.focus();
}

document.querySelectorAll('[data-play]').forEach(el => {
  const open = () => openVideo(el.dataset.play, el.dataset.title);
  el.addEventListener('click', open);
  el.addEventListener('keydown', e => {
    if (el.tagName !== 'BUTTON' && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(); }
  });
});
lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lb-close')) closeVideo(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !lb.hidden) closeVideo(); });

// AI cards: play muted previews only while on screen
const previews = document.querySelectorAll('.card.ai video');
const io = new IntersectionObserver(entries => {
  entries.forEach(({ target, isIntersecting }) => {
    if (isIntersecting) { target.preload = 'auto'; target.play().catch(() => {}); }
    else target.pause();
  });
}, { threshold: 0.4 });
previews.forEach(v => io.observe(v));

// Before/After badge follows the clip (the "after" half starts at data-switch seconds)
document.querySelectorAll('video[data-switch]').forEach(v => {
  const badge = v.parentElement.querySelector('.badge');
  const at = parseFloat(v.dataset.switch);
  v.addEventListener('timeupdate', () => {
    const after = v.currentTime >= at;
    badge.textContent = after ? 'After' : 'Before';
    badge.classList.toggle('after', after);
  });
});

// Fade sections in on scroll
const reveal = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); reveal.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.section-head, .reel, .card, .phone, .service, .tools, .about, .contact-inner').forEach(el => {
  el.classList.add('reveal');
  reveal.observe(el);
});
