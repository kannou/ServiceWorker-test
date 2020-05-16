const ORIGIN = "/ServiceWorker-test/";
const CACHE_NAME = "v2";
var arrCacheList = [
	"res/blue.png",
	"res/money.m4a"
].map(function (val) {
	// リストの全要素の頭に文字列を追加
	return ORIGIN + val;
});


// Service Workerのinstallイベント
// 既にインストールが終わっている場合は発火しない。
self.addEventListener("install", function (event) {
	console.log("install event");

	// キャッシュする。
	// キャッシュが完了するまでインストールを完了しないようにするのがwaitUntil
	event.waitUntil(
		caches.open(CACHE_NAME).then(function (cache) {
			return cache.addAll(arrCacheList);
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
				return caches.open(CACHE_NAME).then(function (cache) {
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

