// Service Workerのinstallイベント
// 既にインストールが終わっている場合は発火しない。
self.addEventListener("install", function (event) {
	console.log("install event");

	// キャッシュする。
	// キャッシュが完了するまでインストールを完了しないようにするのがwaitUntil
	event.waitUntil(
		caches.open("v1").then(function (cache) {
			return cache.addAll([
				"/ServiceWorker-test/res/blue.png"
			]);
		})
	);
});

// activateイベント
// SWを既に有効にしてある場合は発火しない。
self.addEventListener("activate", function (event) {
	console.info("activate", event);
});

// fetchイベント
// activated状態なら、このイベントが発火する。
self.addEventListener("fetch", function (event) {
	console.log("fetch: " + event);

	event.respondWith(
		// responseをここでインターセプトする
		// キャッシュストレージに一致するデータがあるかどうかの確認
		caches.match(event.request).then(function (cacheStorage) {
			// 既にキャッシュがあるならそれを返す
			if (cacheStorage) return cacheStorage;

			// リクエストを作る
			fetch(event.request).then(function (response) {
				return caches.open("v1").then(function (cache) {
					// レスポンスをキャッシュする
					// これで、次のレスポンスの際にはキャッシュから返せるようにする
					cache.put(event.request, response.clone());

					// もともとのレスポンスをそのまま返す
					return response;
				});
			});
		})

	);
});

