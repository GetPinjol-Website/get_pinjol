self.addEventListener("install",i=>{i.waitUntil(self.skipWaiting())});self.addEventListener("activate",i=>{i.waitUntil(self.clients.claim())});
