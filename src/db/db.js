let commonActions = obj => {
	let openRequest = window.indexedDB.open("db", 1);
	openRequest.onupgradeneeded = function() {
		let db = openRequest.result;
		if (!db.objectStoreNames.contains('table')) { 
			db.createObjectStore('table',{keyPath: 'id'}); 
		}		
	};
	openRequest.onerror = function (err) {
		console.log(err);
	}
	openRequest.onsuccess = function (event) {
		let db = openRequest.result;
		let trans = db.transaction("table","readwrite");
		let news = trans.objectStore("table");
        news.put(obj);        
    }
}

export let addToDb = obj => {
	commonActions(obj);
}
