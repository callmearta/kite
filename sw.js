if(!self.define){let s,e={};const l=(l,i)=>(l=new URL(l+".js",i).href,e[l]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=l,s.onload=e,document.head.appendChild(s)}else s=l,importScripts(l),e()})).then((()=>{let s=e[l];if(!s)throw new Error(`Module ${l} didn’t register its module`);return s})));self.define=(i,n)=>{const r=s||("document"in self?document.currentScript.src:"")||location.href;if(e[r])return;let o={};const t=s=>l(s,r),u={module:{uri:r},exports:o,require:t};e[r]=Promise.all(i.map((s=>u[s]||t(s)))).then((s=>(n(...s),o)))}}define(["./workbox-7369c0e1"],(function(s){"use strict";self.addEventListener("message",(s=>{s.data&&"SKIP_WAITING"===s.data.type&&self.skipWaiting()})),s.precacheAndRoute([{url:"192x192.png",revision:"9e2ded6a0daebc8184cc30a37facb794"},{url:"512x512.png",revision:"4fcd67e522cd7dc3d743f200121dc169"},{url:"assets/back-b19dc910.svg",revision:null},{url:"assets/block-2846eaf3.svg",revision:null},{url:"assets/close-77e6a59b.svg",revision:null},{url:"assets/comments-716da6dc.svg",revision:null},{url:"assets/copy-541cddaf.svg",revision:null},{url:"assets/delete-ccf62ee2.svg",revision:null},{url:"assets/dots-30f922cf.svg",revision:null},{url:"assets/edit-88140560.svg",revision:null},{url:"assets/github-2e929cfe.svg",revision:null},{url:"assets/home-b3e39978.svg",revision:null},{url:"assets/home-fill-15798e3d.svg",revision:null},{url:"assets/image-21b146da.svg",revision:null},{url:"assets/index-12278ad0.css",revision:null},{url:"assets/index-88dd79c1.js",revision:null},{url:"assets/kite-87421cee.png",revision:null},{url:"assets/LatoLatin-Bold-27640163.woff2",revision:null},{url:"assets/LatoLatin-Bold-74dc638c.ttf",revision:null},{url:"assets/LatoLatin-Bold-7cebe978.woff",revision:null},{url:"assets/LatoLatin-Bold-eca63e89.eot",revision:null},{url:"assets/LatoLatin-Regular-9c46f792.woff",revision:null},{url:"assets/LatoLatin-Regular-c6c970b1.eot",revision:null},{url:"assets/LatoLatin-Regular-d785334a.ttf",revision:null},{url:"assets/like-791a9b05.svg",revision:null},{url:"assets/like-fill-14a81da3.svg",revision:null},{url:"assets/logout-56ccdf88.svg",revision:null},{url:"assets/moon-d2a28694.svg",revision:null},{url:"assets/notification-14024e06.svg",revision:null},{url:"assets/notification-fill-3f0e647f.svg",revision:null},{url:"assets/profile-fa80f802.svg",revision:null},{url:"assets/profile-fill-6e48a45a.svg",revision:null},{url:"assets/quote-2653d51b.svg",revision:null},{url:"assets/reply-fill-07cc6b62.svg",revision:null},{url:"assets/repost-1a5f44be.svg",revision:null},{url:"assets/repost-fill-ad478ace.svg",revision:null},{url:"assets/search-58f55681.svg",revision:null},{url:"assets/settings-73598a9e.svg",revision:null},{url:"assets/settings-fill-849749ca.svg",revision:null},{url:"assets/sun-9b99a747.svg",revision:null},{url:"assets/Vazir-7ecb985c.eot",revision:null},{url:"assets/Vazir-b8d13d28.ttf",revision:null},{url:"assets/Vazir-Bold-1925b834.woff",revision:null},{url:"assets/Vazir-Bold-7decedd0.eot",revision:null},{url:"assets/Vazir-Bold-97d21936.ttf",revision:null},{url:"assets/Vazir-Bold-c61dd695.woff2",revision:null},{url:"assets/Vazir-f566645a.woff",revision:null},{url:"assets/Vazir-Light-4645bf18.woff",revision:null},{url:"assets/Vazir-Light-bdc1459f.ttf",revision:null},{url:"assets/Vazir-Light-c705be9f.eot",revision:null},{url:"assets/Vazir-Light-ec4a433f.woff2",revision:null},{url:"assets/workbox-window.prod.es5-dc90f814.js",revision:null},{url:"index.html",revision:"cc78b0b40758f4284e656d727cde468f"},{url:"kite.png",revision:"b32eef494106a5764543946e5970e1f9"},{url:"vite.svg",revision:"8e3a10e157f75ada21ab742c022d5430"},{url:"192x192.png",revision:"9e2ded6a0daebc8184cc30a37facb794"},{url:"512x512.png",revision:"4fcd67e522cd7dc3d743f200121dc169"},{url:"manifest.webmanifest",revision:"4d98c1e31b11d52bf2cf382b197b95fb"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html")))}));
