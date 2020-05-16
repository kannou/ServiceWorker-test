const ORIGIN = "/ServiceWorker-test";

// if (!navigator.serviceWorker) return;

// SWの登録を行う。登録の後でインストールされる。ここでparsed状態に入るってことか。
// register関数の第2引数でscopeを指定できる(scopeとなる範囲のルートを指定する)。
// デフォルトでは、register関数を実行するjsファイルと同じ階層(以下)になる
navigator.serviceWorker.register(ORIGIN + "/sw.js")
	.then(function (reg) {
		// 登録の成功
		console.log("SWのScope: " + reg.scope);

	}).catch(function (e) {
		// 登録の失敗
		console.log("SWの登録失敗:" + e);
	});
