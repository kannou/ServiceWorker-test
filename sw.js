// sw.jsファイルが更新されていると、ServiceWorkerが更新される。
// これでinstalling状態になる。
// 既にSWがinstallされている場合は、installing状態の後にwaiting状態に移行する。
// その後でページが閉じられたりすると、waiting > activating > activated と移行する。
// つまりwebアプリの更新をかけたあとは、普通にやるとユーザ側で操作しないとリソースの更新ができないといことになる。

// activatedになった後でも、SWは

// 更新がない & インストール済の場合は、installing > activated と移行する



const ORIGIN = "/ServiceWorker-test/";
const CACHE_NAME = "cache-v2";
var arrCacheList = [
	"index.html",
	"app.js",
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

	// 古いキャッシュを削除する。
	event.waitUntil(
		caches.keys().then(function (cacheNames) {
			return Promise.all(
				cacheNames.map(function (cacheName) {
					if (cacheName != CACHE_NAME) {
						return caches.delete(cacheName);
					}
				})
			);
		})
	);


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
			var fetchRequest = event.request.clone();
			fetch(fetchRequest).then(function (response) {
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

