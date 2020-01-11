//how to cache:

//create constant cache for example:
const cacheName = 'v1';

// call install Event

self.addEventListener('install', e => {
    console.log('Service Worker: Installed');

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
    e.respondWith(
        fetch(e.request)
            .then(res => {
                // make copy/clone of response
                const resClone = res.clone();
                //Open cache
                caches
                    .open(cacheName)
                    .then(cache => {
                        //add response to cache
                        cache.put(e.request, resClone);
                    });
                return res;
            })
            .catch(err => caches.match(e.request).then(res => res))
    );
});