// const CACHE_NAME = "localhost-v3"; // Change the version number
// const urltoCache = [];

// self.addEventListener("install", (e) => {
//   self.skipWaiting(); // Skip waiting for the updated service worker
//   console.log('installing');
//   e.waitUntil(
//     caches.open(CACHE_NAME).then(async (cache) => {
//       console.log("caches opened");
//       try {
//         ok = await cache.addAll(urltoCache);
//       } catch (err) {
//         console.error('sw: cache.addAll', err);
//         for (let i of urltoCache) {
//           try {
//             ok = await cache.add(i);
//           } catch (err) {
//             console.warn('sw: cache.add', i, err);
//           }
//         }
//       }
//       return ok;
//     }),
//   );
// });

// self.addEventListener("fetch", (e) => {
//   e.respondWith(
//     caches.match(e.request).then((res) => {
//       if (res) {
//         return res; // Return the cached resource if it exists
//       }
//       return fetch(e.request)
//         .then((response) => {
//           if (!response || response.status !== 200 || response.type !== "basic") {
//             return response;
//           }

//           const responseToCache = response.clone();

//           caches.open(CACHE_NAME).then((cache) => {
//             cache.put(e.request, responseToCache); // Cache the fetched response
//           });

//           return response;
//         })
//         .catch(() => caches.match("offline.html")); // Return the offline page if the network request fails
//     }),
//   );
// });

// self.addEventListener("activate", (e) => {
//   const cacheWhiteList = [CACHE_NAME];

//   e.waitUntil(
//     caches.keys().then((cachenames) =>
//       Promise.all(
//         cachenames.map((cachename) => {
//           if (!cacheWhiteList.includes(cachename)) {
//             return caches.delete(cachename);
//           }
//         })
//       )
//     )
//   );
// });