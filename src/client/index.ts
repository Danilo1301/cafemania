import { Debug } from "../shared/debug/debug";
import { Camera } from "./camera/camera";
import { Gameface } from "./gameface/gameface";
import { Hud } from "./hud/hud";
import { GameScene } from "./scenes/gameScene";
import { Test } from "./test/test";

const gameface = new Gameface();
gameface.start();

window["gameface"] = gameface;
window["Debug"] = Debug;
window["Hud"] = Hud;
window["Camera"] = Camera;
window["Test"] = Test;
window["GameScene"] = GameScene;