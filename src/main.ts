import * as co from "@akashic-extension/collision-js";
import { AudioAsset, ImageAsset, Scene } from "@akashic/akashic-engine";

function scoreText(score: number, prefix: string) {
	// スコアテキスト設定
	return prefix + ":" + score;
}

function edibleMushroomCreate(scene: Scene, edibleMushroomImageAsset: ImageAsset, p_x: number, p_y: number) {
	// 食べられるキノコを生成
	const edibleMushroom = new g.Sprite({
		scene: scene,
		src: edibleMushroomImageAsset,
		width: edibleMushroomImageAsset.width,
		height: edibleMushroomImageAsset.height,
		hidden: true,
		x: p_x,
		y: p_y
	});

	return edibleMushroom;
}

function c_edibleMushroomCreate(edibleMushroom: g.Sprite, edibleMushroomImageAsset: ImageAsset) {
	// 食べられるキノコの接触範囲を設定
	const c_edibleMushroom: co.Circle = {
		position: { x: edibleMushroom.x, y: edibleMushroom.y },
		radius: edibleMushroomImageAsset.width / 4
	};

	return c_edibleMushroom;
}

function edibleMushroomMove(edibleMushroom: g.Sprite, c_edibleMushroom: co.Circle,
	c_player: co.Circle, eatAudioAsset: AudioAsset, score: number, scoreLabel: g.Label, gameover: g.Sprite, clear: g.Sprite, player: g.Sprite, moveSpeed: number) {
	edibleMushroom.onUpdate.add(() => {
		if (edibleMushroom.x >= 640 && gameover.visible() === false && clear.visible() === false) {
			edibleMushroom.x = 0;
			edibleMushroom.show();
		}
		if (edibleMushroom.y >= 480 && gameover.visible() === false && clear.visible() === false) {
			edibleMushroom.y = 0;
			edibleMushroom.show();
		}

		// 食べられるキノコを左→右に動かす
		edibleMushroom.x += moveSpeed;
		c_edibleMushroom.position.x = edibleMushroom.x;

		// 食べられるキノコを上→下に動かす
		edibleMushroom.y += 1;
		c_edibleMushroom.position.y = edibleMushroom.y;

		if (co.circleToCircle(c_player, c_edibleMushroom)) {
			// 食べられるキノコと接触したら、食べる音を出し、食べられるキノコを消す（1回のみ）
			if (edibleMushroom.visible()) {
				eatAudioAsset.play();
				edibleMushroom.hide();
				++score;
				scoreLabel.text = scoreText(score, "SCORE");
				scoreLabel.invalidate();
				if (score === 10) {
					player.touchable = false;
					player.modified();
					clear.show();
				}
			}
		}
		// キノコの座標に変更があった場合、 modified() を実行して変更をゲームに通知
		edibleMushroom.modified();
	});
}

function poisonousMushroomCreate(scene: Scene, poisonousMushroomImageAsset: ImageAsset, p_x: number, p_y: number) {
	// 毒キノコを生成
	const poisonousMushroom = new g.Sprite({
		scene: scene,
		src: poisonousMushroomImageAsset,
		width: poisonousMushroomImageAsset.width,
		height: poisonousMushroomImageAsset.height,
		hidden: true,
		x: p_x,
		y: p_y
	});

	return poisonousMushroom;
}

function c_poisonousMushroomCreate(poisonousMushroom: g.Sprite, poisonousMushroomImageAsset: ImageAsset) {
	// 毒キノコの接触範囲を設定
	const c_poisonousMushroom: co.Circle = {
		position: { x: poisonousMushroom.x, y: poisonousMushroom.y },
		radius: poisonousMushroomImageAsset.width / 4
	};

	return c_poisonousMushroom;
}

function poisonousMushroomMove(poisonousMushroom: g.Sprite, c_poisonousMushroom: co.Circle,
	player: g.Sprite, c_player: co.Circle, sirenAudioAsset: AudioAsset, gameover: g.Sprite, clear: g.Sprite, moveSpeed: number) {
	poisonousMushroom.onUpdate.add(() => {
		if (poisonousMushroom.x >= 640 && gameover.visible() === false && clear.visible() === false) {
			poisonousMushroom.x = 0;
			poisonousMushroom.show();
		}
		// 毒キノコを左→右に動かす
		poisonousMushroom.x += moveSpeed;
		c_poisonousMushroom.position.x = poisonousMushroom.x;

		if (co.circleToCircle(c_player, c_poisonousMushroom)) {
			// 毒キノコと接触したら、救急車の音を出し、毒キノコを消す（1回のみ）
			if (poisonousMushroom.visible()) {
				sirenAudioAsset.play();
				poisonousMushroom.hide();
				player.angle = 90;
				player.touchable = false;
				player.modified();
				gameover.show();
			}
		}
		// キノコの座標に変更があった場合、 modified() を実行して変更をゲームに通知
		poisonousMushroom.modified();
	});
}

function main() {
	const scene = new g.Scene({
		game: g.game,
		// このシーンで利用するアセットのIDを列挙し、シーンに通知します
		assetIds: ["player", "edibleMushroom", "eat", "background", "poisonousMushroom", "siren", "gameover", "clear"]
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
		const clearImageAsset = scene.asset.getImageById("clear");

		// 背景を生成
		const background = new g.Sprite({
			scene: scene,
			src: backgroundImageAsset,
			width: backgroundImageAsset.width,
			height: backgroundImageAsset.height
		});
		scene.append(background);

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

		scene.append(scoreLabel);

		// ゲームオーバー画像を生成
		const gameover = new g.Sprite({
			scene: scene,
			src: gameoverImageAsset,
			width: gameoverImageAsset.width,
			height: gameoverImageAsset.height,
			hidden: true
		});

		// ゲームオーバー画像の初期座標
		gameover.x = (g.game.width - gameover.width) / 2;
		gameover.y = (g.game.height - gameover.height) / 2;

		scene.append(gameover);

		// クリア画像を生成
		const clear = new g.Sprite({
			scene: scene,
			src: clearImageAsset,
			width: clearImageAsset.width,
			height: clearImageAsset.height,
			hidden: true
		});

		// クリア画像の初期座標
		clear.x = (g.game.width - clear.width) / 2;
		clear.y = (g.game.height - clear.height) / 2;

		scene.append(clear);

		// プレイヤー（キノコ君）を生成
		const player = new g.Sprite({
			scene: scene,
			src: playerImageAsset,
			width: playerImageAsset.width,
			height: playerImageAsset.height,
			touchable: true
		});

		// プレイヤー（キノコ君）の初期座標を、X軸は右寄り、Y軸は画面の中心に設定
		player.x = g.game.width - player.width;
		player.y = (g.game.height - player.height) / 2;

		// プレイヤー（キノコ君）の接触範囲を設定
		const c_player: co.Circle = {
			position: { x: player.x, y: player.y },
			radius: playerImageAsset.width / 4
		};

		// プレイヤー（キノコ君）をマウスで動かせるようにする
		player.onPointMove.add((event) => {
			player.x += event.prevDelta.x;
			player.y += event.prevDelta.y;

			c_player.position.x = player.x;
			c_player.position.y = player.y;

			player.modified();
		});

		scene.append(player);

		// 食べられるキノコを生成
		const edibleMushroom = edibleMushroomCreate(scene, edibleMushroomImageAsset, 0, 40);
		const c_edibleMushroom = c_edibleMushroomCreate(edibleMushroom, edibleMushroomImageAsset);
		// 食べられるキノコを即表示
		edibleMushroom.show();
		edibleMushroomMove(edibleMushroom, c_edibleMushroom, c_player, eatAudioAsset, score, scoreLabel, gameover, clear, player, 5);
		scene.append(edibleMushroom);

		// 毒キノコ1を生成
		const poisonousMushroom_1 = poisonousMushroomCreate(scene, poisonousMushroomImageAsset, 0, 60);
		const c_poisonousMushroom_1 = c_poisonousMushroomCreate(poisonousMushroom_1, poisonousMushroomImageAsset);
		// 毒キノコ1を即表示
		poisonousMushroom_1.show();
		poisonousMushroomMove(poisonousMushroom_1, c_poisonousMushroom_1, player, c_player, sirenAudioAsset, gameover, clear, 5);
		scene.append(poisonousMushroom_1);

		// 毒キノコ2を生成
		const poisonousMushroom_2 = poisonousMushroomCreate(scene, poisonousMushroomImageAsset, 0, 120);
		const c_poisonousMushroom_2 = c_poisonousMushroomCreate(poisonousMushroom_2, poisonousMushroomImageAsset);

		// 0.1秒後に毒キノコ2を表示
		scene.setTimeout(function () {
			poisonousMushroom_2.show();
			poisonousMushroomMove(poisonousMushroom_2, c_poisonousMushroom_2, player, c_player, sirenAudioAsset, gameover, clear, 5);
			scene.append(poisonousMushroom_2);
		}, 100);

		// 毒キノコ3を生成
		const poisonousMushroom_3 = poisonousMushroomCreate(scene, poisonousMushroomImageAsset, 0, 180);
		const c_poisonousMushroom_3 = c_poisonousMushroomCreate(poisonousMushroom_3, poisonousMushroomImageAsset);

		// 0.2秒後に毒キノコ3を表示
		scene.setTimeout(function () {
			poisonousMushroom_3.show();
			poisonousMushroomMove(poisonousMushroom_3, c_poisonousMushroom_3, player, c_player, sirenAudioAsset, gameover, clear, 5);
			scene.append(poisonousMushroom_3);
		}, 200);

		// 毒キノコ4を生成
		const poisonousMushroom_4 = poisonousMushroomCreate(scene, poisonousMushroomImageAsset, 0, 240);
		const c_poisonousMushroom_4 = c_poisonousMushroomCreate(poisonousMushroom_4, poisonousMushroomImageAsset);

		// 0.3秒後に毒キノコ4を表示
		scene.setTimeout(function () {
			poisonousMushroom_4.show();
			poisonousMushroomMove(poisonousMushroom_4, c_poisonousMushroom_4, player, c_player, sirenAudioAsset, gameover, clear, 5);
			scene.append(poisonousMushroom_4);
		}, 300);

		// 毒キノコ5を生成
		const poisonousMushroom_5 = poisonousMushroomCreate(scene, poisonousMushroomImageAsset, 0, 300);
		const c_poisonousMushroom_5 = c_poisonousMushroomCreate(poisonousMushroom_5, poisonousMushroomImageAsset);

		// 0.4秒後に毒キノコ5を表示
		scene.setTimeout(function () {
			poisonousMushroom_5.show();
			poisonousMushroomMove(poisonousMushroom_5, c_poisonousMushroom_5, player, c_player, sirenAudioAsset, gameover, clear, 5);
			scene.append(poisonousMushroom_5);
		}, 400);

		// 毒キノコ6を生成
		const poisonousMushroom_6 = poisonousMushroomCreate(scene, poisonousMushroomImageAsset, 0, 360);
		const c_poisonousMushroom_6 = c_poisonousMushroomCreate(poisonousMushroom_6, poisonousMushroomImageAsset);

		// 0.5秒後に毒キノコ6を表示
		scene.setTimeout(function () {
			poisonousMushroom_6.show();
			poisonousMushroomMove(poisonousMushroom_6, c_poisonousMushroom_6, player, c_player, sirenAudioAsset, gameover, clear, 5);
			scene.append(poisonousMushroom_6);
		}, 500);

		// 毒キノコ7を生成
		const poisonousMushroom_7 = poisonousMushroomCreate(scene, poisonousMushroomImageAsset, 0, 420);
		const c_poisonousMushroom_7 = c_poisonousMushroomCreate(poisonousMushroom_7, poisonousMushroomImageAsset);

		// 0.6秒後に毒キノコ7を表示
		scene.setTimeout(function () {
			poisonousMushroom_7.show();
			poisonousMushroomMove(poisonousMushroom_7, c_poisonousMushroom_7, player, c_player, sirenAudioAsset, gameover, clear, 5);
			scene.append(poisonousMushroom_7);
		}, 600);

		// ここまでゲーム内容を記述します
	});
	g.game.pushScene(scene);
}

export = main;
