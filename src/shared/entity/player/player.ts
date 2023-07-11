
import { World } from "../../world/world";
import { Entity } from "../entity";

export class Player extends Entity {
    constructor(world: World) {
        super(world);
    }

    public update(dt: number) {
        super.update(dt);

        this.position.x += (Math.random()*20-10) * dt;
        this.position.y += (Math.random()*20-10) * dt;
    }

    public render(dt: number) {
        super.render(dt);
    }
}