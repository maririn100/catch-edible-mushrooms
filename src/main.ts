import * as co from "@akashic-extension/collision-js";

// スコアテキスト
function scoreText(score: number, prefix: string) {
	return prefix + ":" + score;
}

function main(param: g.GameMainParameterObject): void {
	const scene = new g.Scene({
		game: g.game,
		// このシーンで利用するアセットのIDを列挙し、シーンに通知します
		assetIds: ["player", "edible_mushroom", "eat", "background"]
	});
	scene.onLoad.add(() => {
		// ここからゲーム内容を記述します

		// 各アセットオブジェクトを取得します
		const playerImageAsset = scene.asset.getImageById("player");
		const edible_mushroom_ImageAsset = scene.asset.getImageById("edible_mushroom");
		const eatAudioAsset = scene.asset.getAudioById("eat");
		const backgroundImageAsset = scene.asset.getImageById("background");

		// プレイヤー（キノコ君）を生成
		const player = new g.Sprite({
			scene: scene,
			src: playerImageAsset,
			width: playerImageAsset.width,
			height: playerImageAsset.height,
			touchable: true
		});

		// 食べられるキノコを生成
		const edible_mushroom = new g.Sprite({
			scene: scene,
			src: edible_mushroom_ImageAsset,
			width: edible_mushroom_ImageAsset.width,
			height: edible_mushroom_ImageAsset.height
		});

		// 背景を生成
		const background = new g.Sprite({
			scene: scene,
			src: backgroundImageAsset,
			width: backgroundImageAsset.width,
			height: backgroundImageAsset.height
		});

		// ダイナミックフォントを生成
		const font = new g.DynamicFont({
			game: g.game,
			fontFamily: "sans-serif",
			size: 16
		});

		// スコアラベルを生成
		const scoreLabel = new g.Label({
			scene: scene,
			font: font,
			text: "SCORE:0",
			fontSize: font.size,
			x: 10,
			y: 10
		});

		// スコアの初期化
		let score: number = 0;

		// プレイヤーの初期座標を、X軸は右寄り、Y軸は画面の中心に設定
		player.x = g.game.width - player.width;
		player.y = (g.game.height - player.height) / 2;

		// 食べられるキノコの初期座標
		edible_mushroom.x = 0;
		edible_mushroom.y = 40;

		// キノコ君の接触範囲を設定
		const c_player: co.Circle = {
			position: { x: player.x, y: player.y },
			radius: playerImageAsset.width / 4
		};

		// 食べられるキノコの接触範囲を設定
		const c_edible_mushroom: co.Circle = {
			position: { x: edible_mushroom.x, y: edible_mushroom.y },
			radius: edible_mushroom_ImageAsset.width / 4
		};

		// キノコ君をマウスで動かせるようにする
		player.onPointMove.add((event) => {
			player.x += event.prevDelta.x;
			player.y += event.prevDelta.y;

			c_player.position.x = player.x;
			c_player.position.y = player.y;

			player.modified();
		});

		edible_mushroom.onUpdate.add((event) => {
			// 食べられるキノコを左→右に動かす
			++edible_mushroom.x;
			c_edible_mushroom.position.x = edible_mushroom.x;

			if (co.circleToCircle(c_player, c_edible_mushroom)) {
				// 食べられるキノコと接触したら、食べる音を出し、食べられるキノコを消す（1回のみ）
				if (edible_mushroom.visible()) {
					eatAudioAsset.play();
					edible_mushroom.hide();
					++score;
					scoreLabel.text = scoreText(score, "SCORE");
					scoreLabel.invalidate();
				}
			}
			// キノコの座標に変更があった場合、 modified() を実行して変更をゲームに通知
			edible_mushroom.modified();
		});

		scene.append(background);
		scene.append(scoreLabel);
		scene.append(player);
		scene.append(edible_mushroom);
		// ここまでゲーム内容を記述します
	});
	g.game.pushScene(scene);
}

export = main;
