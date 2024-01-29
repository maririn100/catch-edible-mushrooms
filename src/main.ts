import * as co from "@akashic-extension/collision-js";
import { Vec2Like, Vec2 } from "@akashic-extension/collision-js";

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
		// プレイヤーの初期座標を、X軸は右寄り、Y軸は画面の中心に設定
		player.x = g.game.width - player.width;
		player.y = (g.game.height - player.height) / 2;

		// 食べられるキノコの初期座標
		edible_mushroom.x = 0;
		edible_mushroom.y = 20;

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

			if (co.circleToCircle(c_player, c_edible_mushroom)) edible_mushroom.hide();
			// キノコの座標に変更があった場合、 modified() を実行して変更をゲームに通知
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
