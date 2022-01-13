import { Button } from "../../ui/button";

export class MenuItem {
    public get container() { return this._container; }

    private _container: Phaser.GameObjects.Container;

    constructor(scene: Phaser.Scene) {
        this._container = scene.add.container();

        
        const graphics = scene.add.graphics();
        graphics.fillStyle(0xffffff);
        graphics.fillRect(0, 0, 280, 180);
        graphics.setInteractive(new Phaser.Geom.Rectangle(0, 0, 280, 180), Phaser.Geom.Rectangle.Contains);
        this._container.add(graphics);

        const button = new Button(scene, 190, 150,  140, 25, "button/button_small_green", 6, 'Cozinhar');
        button.onClick = () => {
            console.log("click")
        };
        this._container.add(button.container);
    }
}