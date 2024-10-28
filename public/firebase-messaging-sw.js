self.addEventListener('install', function(){
    console.log('fcm sw install...');
    self.skipWaiting();
})

self.addEventListener('push',function(e){
    console.log(e, 'push event....');
})