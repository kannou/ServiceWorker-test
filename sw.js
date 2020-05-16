// Service Workerのinstallイベント
self.addEventListener("install", function (event) {
	console.log("install event");
});

// activateイベント
self.addEventListener("activate", function (event) {
	console.info("activate", event);
});
