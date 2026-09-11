(function () {
  'use strict';
  var loader = document.currentScript;
  var id = loader && loader.dataset ? loader.dataset.gtmId : '';
  if (!id || window.__mathabahGtmLoaded) return;
  window.__mathabahGtmLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(id);
  document.head.appendChild(script);
})();
