window.gLocalAssetContainer["main"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";
var co = require("@akashic-extension/collision-js");
function scoreText(score, prefix) {
    // スコアテキスト設定
    return prefix + ":" + score;
}
function edibleMushroomCreate(scene, edibleMushroomImageAsset, p_x, p_y) {
    // 食べられるキノコを生成
    var edibleMushroom = new g.Sprite({
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
function c_edibleMushroomCreate(edibleMushroom, edibleMushroomImageAsset) {
    // 食べられるキノコの接触範囲を設定
    var c_edibleMushroom = {
        position: { x: edibleMushroom.x, y: edibleMushroom.y },
        radius: edibleMushroomImageAsset.width / 4
    };
    return c_edibleMushroom;
}
function edibleMushroomMove(edibleMushroom, c_edibleMushroom, c_player, eatAudioAsset, score, scoreLabel, gameover, clear, player, moveSpeed, level, levelLabel, levelup, mainScene) {
    edibleMushroom.onUpdate.add(function () {
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
            if (edibleMushroom.visible() === true) {
                eatAudioAsset.play();
                edibleMushroom.hide();
                ++score;
                scoreLabel.text = scoreText(score, "SCORE");
                scoreLabel.invalidate();
                // 10点毎にレベルアップ
                if ((score % 10) === 0) {
                    player.touchable = false;
                    player.modified();
                    clear.show();
                    levelup.show();
                }
            }
        }
        // キノコの座標に変更があった場合、 modified() を実行して変更をゲームに通知
        edibleMushroom.modified();
    });
}
function poisonousMushroomCreate(scene, poisonousMushroomImageAsset, p_x, p_y) {
    // 毒キノコを生成
    var poisonousMushroom = new g.Sprite({
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
function c_poisonousMushroomCreate(poisonousMushroom, poisonousMushroomImageAsset) {
    // 毒キノコの接触範囲を設定
    var c_poisonousMushroom = {
        position: { x: poisonousMushroom.x, y: poisonousMushroom.y },
        radius: poisonousMushroomImageAsset.width / 4
    };
    return c_poisonousMushroom;
}
function poisonousMushroomMove(poisonousMushroom, c_poisonousMushroom, player, c_player, sirenAudioAsset, gameover, clear, restart, moveSpeed) {
    poisonousMushroom.onUpdate.add(function () {
        if (poisonousMushroom.x >= 640 && gameover.visible() === false && clear.visible() === false) {
            poisonousMushroom.x = 0;
            poisonousMushroom.show();
        }
        // 毒キノコを左→右に動かす
        poisonousMushroom.x += moveSpeed;
        c_poisonousMushroom.position.x = poisonousMushroom.x;
        if (co.circleToCircle(c_player, c_poisonousMushroom)) {
            // 毒キノコと接触したら、救急車の音を出し、毒キノコを消す（1回のみ）
            if (poisonousMushroom.visible() === true && clear.visible() === false) {
                sirenAudioAsset.play();
                poisonousMushroom.hide();
                player.angle = 90;
                player.touchable = false;
                player.modified();
                gameover.show();
                restart.show();
            }
        }
        // キノコの座標に変更があった場合、 modified() を実行して変更をゲームに通知
        poisonousMushroom.modified();
    });
}
function start(startScene, mainScene) {
    startScene.onLoad.add(function () {
        var backgroundImageAsset = startScene.asset.getImageById("background");
        var startImageAsset = startScene.asset.getImageById("start");
        // 背景を生成
        var background = new g.Sprite({
            scene: startScene,
            src: backgroundImageAsset,
            width: backgroundImageAsset.width,
            height: backgroundImageAsset.height
        });
        startScene.append(background);
        // スタート画像を生成
        var start = new g.Sprite({
            scene: startScene,
            src: startImageAsset,
            width: startImageAsset.width,
            height: startImageAsset.height,
            touchable: true
        });
        // スタート画像の初期座標
        start.x = (g.game.width - start.width) / 2;
        start.y = (g.game.height - start.height) / 2;
        startScene.append(start);
        start.onPointUp.add(function () {
            g.game.replaceScene(mainScene);
        });
    });
}
function startSceneCreate() {
    var startScene = new g.Scene({
        game: g.game,
        // このシーンで利用するアセットのIDを列挙し、シーンに通知します
        assetIds: ["background", "start"]
    });
    return startScene;
}
function mainSceneCreate() {
    var scene = new g.Scene({
        game: g.game,
        // このシーンで利用するアセットのIDを列挙し、シーンに通知します
        assetIds: ["player", "edibleMushroom", "eat", "background", "poisonousMushroom", "siren", "gameover", "clear", "restart", "levelup"]
    });
    return scene;
}
function mainLoad(mainScene, moveSpeed) {
    mainScene.onLoad.add(function () {
        // ここからゲーム内容を記述します
        // 各アセットオブジェクトを取得します
        var playerImageAsset = mainScene.asset.getImageById("player");
        var edibleMushroomImageAsset = mainScene.asset.getImageById("edibleMushroom");
        var eatAudioAsset = mainScene.asset.getAudioById("eat");
        var backgroundImageAsset = mainScene.asset.getImageById("background");
        var poisonousMushroomImageAsset = mainScene.asset.getImageById("poisonousMushroom");
        var sirenAudioAsset = mainScene.asset.getAudioById("siren");
        var gameoverImageAsset = mainScene.asset.getImageById("gameover");
        var clearImageAsset = mainScene.asset.getImageById("clear");
        var restartImageAsset = mainScene.asset.getImageById("restart");
        var levelupImageAsset = mainScene.asset.getImageById("levelup");
        // 背景を生成
        var background = new g.Sprite({
            scene: mainScene,
            src: backgroundImageAsset,
            width: backgroundImageAsset.width,
            height: backgroundImageAsset.height
        });
        mainScene.append(background);
        // ダイナミックフォントを生成
        var font = new g.DynamicFont({
            game: g.game,
            fontFamily: "sans-serif",
            size: 16
        });
        // レベルラベルを生成
        var levelLabel = new g.Label({
            scene: mainScene,
            font: font,
            text: "LEVEL:1",
            fontSize: font.size,
            x: 10,
            y: 10
        });
        // レベルの初期化
        var level = 1;
        mainScene.append(levelLabel);
        // スコアラベルを生成
        var scoreLabel = new g.Label({
            scene: mainScene,
            font: font,
            text: "SCORE:0",
            fontSize: font.size,
            x: 100,
            y: 10
        });
        // スコアの初期化
        var score = 0;
        mainScene.append(scoreLabel);
        // ゲームオーバー画像を生成
        var gameover = new g.Sprite({
            scene: mainScene,
            src: gameoverImageAsset,
            width: gameoverImageAsset.width,
            height: gameoverImageAsset.height,
            hidden: true
        });
        // ゲームオーバー画像の初期座標
        gameover.x = (g.game.width - gameover.width) / 2;
        gameover.y = (g.game.height - gameover.height) / 2;
        mainScene.append(gameover);
        // クリア画像を生成
        var clear = new g.Sprite({
            scene: mainScene,
            src: clearImageAsset,
            width: clearImageAsset.width,
            height: clearImageAsset.height,
            hidden: true
        });
        // クリア画像の初期座標
        clear.x = (g.game.width - clear.width) / 2;
        clear.y = (g.game.height - clear.height) / 2;
        mainScene.append(clear);
        // 再スタート画像を生成
        var restart = new g.Sprite({
            scene: mainScene,
            src: restartImageAsset,
            width: restartImageAsset.width,
            height: restartImageAsset.height,
            hidden: true,
            touchable: true
        });
        // 再スタート画像の初期座標
        restart.x = (g.game.width - restart.width) / 2;
        restart.y = (g.game.height - restart.height) / 1.3;
        mainScene.append(restart);
        restart.onPointUp.add(function () {
            var reStartScene = startSceneCreate();
            var reMainScene = mainSceneCreate();
            start(reStartScene, reMainScene);
            mainLoad(reMainScene, 5);
            g.game.replaceScene(reStartScene);
        });
        // レベルアップ画像を生成
        var levelup = new g.Sprite({
            scene: mainScene,
            src: levelupImageAsset,
            width: levelupImageAsset.width,
            height: levelupImageAsset.height,
            hidden: true,
            touchable: true
        });
        // レベルアップ画像の初期座標
        levelup.x = (g.game.width - levelup.width) / 2;
        levelup.y = (g.game.height - levelup.height) / 1.3;
        mainScene.append(levelup);
        // プレイヤー（キノコ君）を生成
        var player = new g.Sprite({
            scene: mainScene,
            src: playerImageAsset,
            width: playerImageAsset.width,
            height: playerImageAsset.height,
            touchable: true
        });
        // プレイヤー（キノコ君）の初期座標を、X軸は右寄り、Y軸は画面の中心に設定
        player.x = g.game.width - player.width;
        player.y = (g.game.height - player.height) / 2;
        // プレイヤー（キノコ君）の接触範囲を設定
        var c_player = {
            position: { x: player.x, y: player.y },
            radius: playerImageAsset.width / 4
        };
        // プレイヤー（キノコ君）をマウスで動かせるようにする
        player.onPointMove.add(function (event) {
            player.x += event.prevDelta.x;
            player.y += event.prevDelta.y;
            c_player.position.x = player.x;
            c_player.position.y = player.y;
            player.modified();
        });
        mainScene.append(player);
        // 食べられるキノコを生成
        var edibleMushroom = edibleMushroomCreate(mainScene, edibleMushroomImageAsset, 0, 40);
        var c_edibleMushroom = c_edibleMushroomCreate(edibleMushroom, edibleMushroomImageAsset);
        // 食べられるキノコを即表示
        edibleMushroom.show();
        edibleMushroomMove(edibleMushroom, c_edibleMushroom, c_player, eatAudioAsset, score, scoreLabel, gameover, clear, player, 5, level, levelLabel, levelup, mainScene);
        mainScene.append(edibleMushroom);
        var poisonousMushroom = [];
        var c_poisonousMushroom = [];
        var _loop_1 = function (i) {
            mainScene.setTimeout(function () {
                // 毒キノコを生成
                poisonousMushroom.push(poisonousMushroomCreate(mainScene, poisonousMushroomImageAsset, 0, 60 * (i + 1)));
                c_poisonousMushroom.push(c_poisonousMushroomCreate(poisonousMushroom[i], poisonousMushroomImageAsset));
                // 毒キノコを即表示
                poisonousMushroom[i].show();
                poisonousMushroomMove(poisonousMushroom[i], c_poisonousMushroom[i], player, c_player, sirenAudioAsset, gameover, clear, restart, moveSpeed);
                mainScene.append(poisonousMushroom[i]);
            }, i * 100);
        };
        // 毒キノコを表示
        for (var i = 0; i < 7; i++) {
            _loop_1(i);
        }
        levelup.onPointUp.add(function () {
            player.touchable = true;
            player.modified();
            clear.hide();
            levelup.hide();
            ++level;
            levelLabel.text = scoreText(level, "LEVEL");
            levelLabel.invalidate();
            var _loop_2 = function (i) {
                mainScene.setTimeout(function () {
                    mainScene.remove(poisonousMushroom[i]);
                    poisonousMushroomMove(poisonousMushroom[i], c_poisonousMushroom[i], player, c_player, sirenAudioAsset, gameover, clear, restart, moveSpeed + (level * 0.001));
                    mainScene.append(poisonousMushroom[i]);
                }, i * 100);
            };
            // 毒キノコをスピードアップ
            for (var i = 0; i < 7; i++) {
                _loop_2(i);
            }
        });
        // ここまでゲーム内容を記述します
    });
}
function main() {
    var startScene = startSceneCreate();
    var mainScene = mainSceneCreate();
    start(startScene, mainScene);
    mainLoad(mainScene, 5);
    g.game.pushScene(startScene);
}
module.exports = main;

})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}