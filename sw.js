if(!self.define){let s,e={};const l=(l,i)=>(l=new URL(l+".js",i).href,e[l]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=l,s.onload=e,document.head.appendChild(s)}else s=l,importScripts(l),e()})).then((()=>{let s=e[l];if(!s)throw new Error(`Module ${l} didn’t register its module`);return s})));self.define=(i,r)=>{const n=s||("document"in self?document.currentScript.src:"")||location.href;if(e[n])return;let a={};const u=s=>l(s,n),o={module:{uri:n},exports:a,require:u};e[n]=Promise.all(i.map((s=>o[s]||u(s)))).then((s=>(r(...s),a)))}}define(["./workbox-7369c0e1"],(function(s){"use strict";self.addEventListener("message",(s=>{s.data&&"SKIP_WAITING"===s.data.type&&self.skipWaiting()})),s.precacheAndRoute([{url:"192x192.png",revision:"bcd76e6d9ae98a066404826b11a949c5"},{url:"512x512.png",revision:"13e697aadb1a4634d060927fc292591a"},{url:"assets/arrow-d3d4beb2.svg",revision:null},{url:"assets/back-b19dc910.svg",revision:null},{url:"assets/block-2846eaf3.svg",revision:null},{url:"assets/close-77e6a59b.svg",revision:null},{url:"assets/comments-716da6dc.svg",revision:null},{url:"assets/copy-541cddaf.svg",revision:null},{url:"assets/delete-ccf62ee2.svg",revision:null},{url:"assets/dots-30f922cf.svg",revision:null},{url:"assets/edit-88140560.svg",revision:null},{url:"assets/eye-closed-6dca6935.svg",revision:null},{url:"assets/eye-open-3024e508.svg",revision:null},{url:"assets/firehose-a648011d.svg",revision:null},{url:"assets/github-2e929cfe.svg",revision:null},{url:"assets/home-d673a3f4.svg",revision:null},{url:"assets/home-fill-4291e846.svg",revision:null},{url:"assets/image-a1468fa8.svg",revision:null},{url:"assets/index-26b28599.js",revision:null},{url:"assets/index-5908e9de.css",revision:null},{url:"assets/LatoLatin-Bold-27640163.woff2",revision:null},{url:"assets/LatoLatin-Bold-74dc638c.ttf",revision:null},{url:"assets/LatoLatin-Bold-7cebe978.woff",revision:null},{url:"assets/LatoLatin-Bold-eca63e89.eot",revision:null},{url:"assets/LatoLatin-Regular-9c46f792.woff",revision:null},{url:"assets/LatoLatin-Regular-c6c970b1.eot",revision:null},{url:"assets/LatoLatin-Regular-d785334a.ttf",revision:null},{url:"assets/like-791a9b05.svg",revision:null},{url:"assets/like-fill-14a81da3.svg",revision:null},{url:"assets/logout-56ccdf88.svg",revision:null},{url:"assets/mic-08d8e71d.svg",revision:null},{url:"assets/mic-fill-e2a26438.svg",revision:null},{url:"assets/moon-d2a28694.svg",revision:null},{url:"assets/notification-14024e06.svg",revision:null},{url:"assets/notification-fill-1397fd84.svg",revision:null},{url:"assets/pause-199faf79.svg",revision:null},{url:"assets/pin-cc9b09a3.svg",revision:null},{url:"assets/play-96b9ef93.svg",revision:null},{url:"assets/profile-fa80f802.svg",revision:null},{url:"assets/profile-fill-0c96bc1a.svg",revision:null},{url:"assets/quote-2653d51b.svg",revision:null},{url:"assets/reply-fill-9ac54bc9.svg",revision:null},{url:"assets/repost-1a5f44be.svg",revision:null},{url:"assets/repost-fill-ad478ace.svg",revision:null},{url:"assets/search-58f55681.svg",revision:null},{url:"assets/settings-73598a9e.svg",revision:null},{url:"assets/settings-fill-bc8a8e20.svg",revision:null},{url:"assets/sun-9b99a747.svg",revision:null},{url:"assets/Vazir-7ecb985c.eot",revision:null},{url:"assets/Vazir-b8d13d28.ttf",revision:null},{url:"assets/Vazir-Bold-1925b834.woff",revision:null},{url:"assets/Vazir-Bold-7decedd0.eot",revision:null},{url:"assets/Vazir-Bold-97d21936.ttf",revision:null},{url:"assets/Vazir-Bold-c61dd695.woff2",revision:null},{url:"assets/Vazir-f566645a.woff",revision:null},{url:"assets/Vazir-Light-4645bf18.woff",revision:null},{url:"assets/Vazir-Light-bdc1459f.ttf",revision:null},{url:"assets/Vazir-Light-c705be9f.eot",revision:null},{url:"assets/Vazir-Light-ec4a433f.woff2",revision:null},{url:"assets/workbox-window.prod.es5-dc90f814.js",revision:null},{url:"index.html",revision:"344d43c2e2e139039e6441afbe526b33"},{url:"kite.png",revision:"ece5ec70057e63c02c41eef768a19fd7"},{url:"vite.svg",revision:"8e3a10e157f75ada21ab742c022d5430"},{url:"192x192.png",revision:"bcd76e6d9ae98a066404826b11a949c5"},{url:"512x512.png",revision:"13e697aadb1a4634d060927fc292591a"},{url:"manifest.webmanifest",revision:"4d98c1e31b11d52bf2cf382b197b95fb"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html")))}));
