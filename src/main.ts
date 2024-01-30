import * as co from "@akashic-extension/collision-js";

// スコアテキスト
function scoreText(score: number, prefix: string) {
	return prefix + ":" + score;
}

function poisonous_mushroomShow(poisonous_mushroom: g.Sprite, c_poisonous_mushroom: co.Circle, player: g.Sprite, c_player: co.Circle, sirenAudioAsset: any, gameover: g.Sprite) {
	poisonous_mushroom.onUpdate.add(() => {
		// 毒キノコを左→右に動かす
		++poisonous_mushroom.x;
		c_poisonous_mushroom.position.x = poisonous_mushroom.x;

		if (co.circleToCircle(c_player, c_poisonous_mushroom)) {
			// 毒キノコと接触したら、救急車の音を出し、毒キノコを消す（1回のみ）
			if (poisonous_mushroom.visible()) {
				sirenAudioAsset.play();
				poisonous_mushroom.hide();
				player.angle = 90;
				player.touchable = false;
				player.modified();
				gameover.show();
			}
		}
		// キノコの座標に変更があった場合、 modified() を実行して変更をゲームに通知
		poisonous_mushroom.modified();
	});
}

function main() {
	const scene = new g.Scene({
		game: g.game,
		// このシーンで利用するアセットのIDを列挙し、シーンに通知します
		assetIds: ["player", "edibleMushroom", "eat", "background", "poisonousMushroom", "siren", "gameover"]
	});
	scene.onLoad.add(() => {
		// ここからゲーム内容を記述します

		// 各アセットオブジェクトを取得します
		const playerImageAsset = scene.asset.getImageById("player");
		const edibleMushroomImageAsset = scene.asset.getImageById("edibleMushroom");
		const eatAudioAsset = scene.asset.getAudioById("eat");
		const backgroundImageAsset = scene.asset.getImageById("background");
		const poisonousMushroomImageAsset = scene.asset.getImageById("poisonousMushroom");
		const sirenAudioAsset = scene.asset.getAudioById("siren");
		const gameoverImageAsset = scene.asset.getImageById("gameover");

		// プレイヤー（キノコ君）を生成
		const player = new g.Sprite({
			scene: scene,
			src: playerImageAsset,
			width: playerImageAsset.width,
			height: playerImageAsset.height,
			touchable: true
		});

		// 食べられるキノコを生成
		const edibleMushroom = new g.Sprite({
			scene: scene,
			src: edibleMushroomImageAsset,
			width: edibleMushroomImageAsset.width,
			height: edibleMushroomImageAsset.height
		});

		// 毒キノコを生成
		const poisonousMushroom = new g.Sprite({
			scene: scene,
			src: poisonousMushroomImageAsset,
			width: poisonousMushroomImageAsset.width,
			height: poisonousMushroomImageAsset.height,
			hidden: true
		});

		// 背景を生成
		const background = new g.Sprite({
			scene: scene,
			src: backgroundImageAsset,
			width: backgroundImageAsset.width,
			height: backgroundImageAsset.height
		});

		// ゲームオーバー画像を生成
		const gameover = new g.Sprite({
			scene: scene,
			src: gameoverImageAsset,
			width: gameoverImageAsset.width,
			height: gameoverImageAsset.height,
			hidden: true
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
		edibleMushroom.x = 0;
		edibleMushroom.y = 40;

		// 毒キノコの初期座標
		poisonousMushroom.x = 0;
		poisonousMushroom.y = 100;

		// ゲームオーバー画像の初期座標
		gameover.x = (g.game.width - gameover.width) / 2;
		gameover.y = (g.game.height - gameover.height) / 2;

		// キノコ君の接触範囲を設定
		const c_player: co.Circle = {
			position: { x: player.x, y: player.y },
			radius: playerImageAsset.width / 4
		};

		// 食べられるキノコの接触範囲を設定
		const c_edibleMushroom: co.Circle = {
			position: { x: edibleMushroom.x, y: edibleMushroom.y },
			radius: edibleMushroomImageAsset.width / 4
		};

		// 毒キノコの接触範囲を設定
		const c_poisonousMushroom: co.Circle = {
			position: { x: poisonousMushroom.x, y: poisonousMushroom.y },
			radius: poisonousMushroomImageAsset.width / 4
		};

		// キノコ君をマウスで動かせるようにする
		player.onPointMove.add((event) => {
			player.x += event.prevDelta.x;
			player.y += event.prevDelta.y;

			c_player.position.x = player.x;
			c_player.position.y = player.y;

			player.modified();
		});

		edibleMushroom.onUpdate.add(() => {
			// 食べられるキノコを左→右に動かす
			++edibleMushroom.x;
			c_edibleMushroom.position.x = edibleMushroom.x;

			if (co.circleToCircle(c_player, c_edibleMushroom)) {
				// 食べられるキノコと接触したら、食べる音を出し、食べられるキノコを消す（1回のみ）
				if (edibleMushroom.visible()) {
					eatAudioAsset.play();
					edibleMushroom.hide();
					++score;
					scoreLabel.text = scoreText(score, "SCORE");
					scoreLabel.invalidate();
				}
			}
			// キノコの座標に変更があった場合、 modified() を実行して変更をゲームに通知
			edibleMushroom.modified();
		});

		// 3秒後に毒キノコ1を表示
		scene.setTimeout(function () {
			poisonousMushroom.show();
			poisonous_mushroomShow(poisonousMushroom, c_poisonousMushroom, player, c_player, sirenAudioAsset, gameover);
		}, 3000);


		scene.append(background);
		scene.append(scoreLabel);
		scene.append(player);
		scene.append(edibleMushroom);
		scene.append(poisonousMushroom);
		scene.append(gameover);
		// ここまでゲーム内容を記述します
	});
	g.game.pushScene(scene);
}

export = main;
