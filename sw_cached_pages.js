//how to cache:

//create constant cache for example:
const cacheName = 'v2';


//this is array of asset that we wanna cache
const cacheAssets = [
    'index.html',
    'about.html',
    '/css/style.css',
    '/js/main.js'
];

// call install Event

self.addEventListener('install', e => {
    console.log('Service Worker: Installed');

    //telling the browser to wait untull our promise is finish to get rid on service worker
    e.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                console.log('Service Worker: Caching Files ');
                cache.addAll(cacheAssets);
            })
            .then(() => self.skipWaiting())
    );
})


// call activate Event
self.addEventListener('activate', e => {
    console.log('Service Worker: Activated');

    //remove unwanted cahces
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        console.log('Service Worker: Clearing old cache');
                        return caches.delete(cache);
                    }
                })
            )
        })
    )
});


// call fetch Event
self.addEventListener('fetch', e => {
    console.log('Service Worker: Fetching');
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});