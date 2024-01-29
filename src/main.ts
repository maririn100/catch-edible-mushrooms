function main(param: g.GameMainParameterObject): void {
	const scene = new g.Scene({
		game: g.game,
		// このシーンで利用するアセットのIDを列挙し、シーンに通知します
		assetIds: ["player", "edible_mushroom", "se"]
	});
	scene.onLoad.add(() => {
		// ここからゲーム内容を記述します

		// 各アセットオブジェクトを取得します
		const playerImageAsset = scene.asset.getImageById("player");
		const edible_mushroom_ImageAsset = scene.asset.getImageById("edible_mushroom");
		const seAudioAsset = scene.asset.getAudioById("se");

		// プレイヤーを生成
		const player = new g.Sprite({
			scene: scene,
			src: playerImageAsset,
			width: playerImageAsset.width,
			height: playerImageAsset.height
		});

		// 食べられるキノコを生成
		const edible_mushroom = new g.Sprite({
			scene: scene,
			src: edible_mushroom_ImageAsset,
			width: edible_mushroom_ImageAsset.width,
			height: edible_mushroom_ImageAsset.height
		});
		// プレイヤーの初期座標を、X軸は右寄り、Y軸は画面の中心に設定
		player.x = g.game.width - player.width;
		player.y = (g.game.height - player.height) / 2;

		// 食べられるキノコの初期座標
		edible_mushroom.x = 0;
		edible_mushroom.y = 20;

		player.onUpdate.add(() => {
			// 食べられるキノコを左→右に動かす
			++edible_mushroom.x;

			// プレイヤー・キノコの座標に変更があった場合、 modified() を実行して変更をゲームに通知
			player.modified();
			edible_mushroom.modified();
		});

		// 画面をタッチしたとき、SEを鳴らします⇒キノコとぶつかったときに食べる音にしたいので、参考としてコメントで置いておく
		// scene.onPointDownCapture.add(() => {
		// 	seAudioAsset.play();
		// });
		scene.append(player);
		scene.append(edible_mushroom);
		// ここまでゲーム内容を記述します
	});
	g.game.pushScene(scene);
}

export = main;
