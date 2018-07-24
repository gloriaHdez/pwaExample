//Asignar nombre y version de la cache
const CACHE_NAME = 'v1_cache_pwa';

	//configurar los ficheros que se van a guardar en la aplicacion para ver la aplicacion offline
	var urlsToCache = [
		'./',
		'./css/style.css',
		'./img/1.png',
		'./img/2.png',
		'./img/3.png',
		'./img/4.png',
     	'./img/5.png',
     	'./img/6.png',
     	'./img/facebook.png',
     	'./img/twitter.png',
     	'./img/instagram.png',

     	'./img/favicon-1024.png',
     	'./img/favicon-512.png',
     	'./img/favicon-384.png',
     	'./img/favicon-256.png',
     	'./img/favicon-192.png',
     	'./img/favicon-128.png',
     	'./img/favicon-96.png',
     	'./img/favicon-64.png',
     	'./img/favicon-32.png',
     	'./img/favicon-16.png',
     	'./js/jquery.min.js',
     	'./pwa.mp4',
   
	];

	//Evento intall: se encarga de instalar el service worker y almacenar en cache los archivos estaticos que estipulamos 
	self.addEventListener('install', e =>{

		e.waitUntil(
			caches.open(CACHE_NAME)
				  .then(cache =>{
				  	return cache.addAll(urlsToCache)
				  				.then(() =>{
				  					self.skipWaiting(); //esperar a que se guarden todos los archivos en cache
				  				})
				  				
				  })
				  .catch( err=>console.log("no se ha registrado el caché ", err))
			);
	});
	//Evento Activate : permite que la app funcione sin conexion

	self.addEventListener('activate', e=>{
		const cacheWhiteList =[CACHE_NAME];

		e.waitUntil(
			caches.keys()
				  .then(cacheNames =>{
				  	return Promise.all(
				  		cacheNames.map(cacheName=>{
				  			if(cacheWhiteList.indexOf(cacheName) === -1){
				  				//borrar los elementos que no necesitamos
				  				return caches.delete(cacheName);
				  			}
				  		})
				  		);
				  })
				  .then(()=>{
				  	//activa la cache en el dispositivo.
				  	self.clients.claim(); 
				  })
			);
	});



	//Evento fetch (consigue actualizar la informacion de la web que hay en internet)

	self.addEventListener('fetch', e=>{
		e.respondWith(
			caches.match(e.request)
				  .then(res=>{
				  	//devuelvo datos desde cache
				  	if(res){
				  		console.log("se encuentra en cache el recurso, lo devuelvo.");
				  			return res;
				  		}
				  		console.log("sno se encuentra en cache, se permite la peticion...");
				  		//si no esta en cache la recupero del servidor y se retorna.
				  		return fetch(e.request);
				  })

			);

	});