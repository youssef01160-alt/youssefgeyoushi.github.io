// Phones get a vertical cut reframed per shot; wider screens get the 16:9 loop
(function (v) {
  var phone = window.matchMedia('(max-width: 680px)').matches;
  v.poster = phone ? 'media/hero-mobile.jpg' : 'media/hero.jpg';
  v.src = phone ? 'media/hero-mobile.mp4' : 'media/hero.mp4';
})(document.currentScript.previousElementSibling);
