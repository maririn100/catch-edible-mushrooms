function main(param: g.GameMainParameterObject): void {
	const scene = new g.Scene({
		game: g.game,
		// このシーンで利用するアセットのIDを列挙し、シーンに通知します
		assetIds: ["player", "se"]
	});
	scene.onLoad.add(() => {
		// ここからゲーム内容を記述します

		// 各アセットオブジェクトを取得します
		const playerImageAsset = scene.asset.getImageById("player");
		const seAudioAsset = scene.asset.getAudioById("se");

		// プレイヤーを生成します
		const player = new g.Sprite({
			scene: scene,
			src: playerImageAsset,
			width: playerImageAsset.width,
			height: playerImageAsset.height
		});

		// プレイヤーの初期座標を、X軸はちょっと左寄り、Y軸は画面の中心に設定
		player.x = (g.game.width - player.width) / 4;
		player.y = (g.game.height - player.height) / 2;
		player.onUpdate.add(() => {
			// 毎フレームでY座標を再計算し、プレイヤーの飛んでいる動きを表現します
			// ここではMath.sinを利用して、時間経過によって増加するg.game.ageと組み合わせて
			// player.y = (g.game.height - player.height) / 2 + Math.sin(g.game.age % (g.game.fps * 10) / 4) * 10;

			// プレイヤーの座標に変更があった場合、 modified() を実行して変更をゲームに通知します
			player.modified();
		});

		// 画面をタッチしたとき、SEを鳴らします⇒キノコとぶつかったときに食べる音にしたいので、参考としてコメントで置いておく
		// scene.onPointDownCapture.add(() => {
		// 	seAudioAsset.play();
		// });
		scene.append(player);
		// ここまでゲーム内容を記述します
	});
	g.game.pushScene(scene);
}

export = main;
