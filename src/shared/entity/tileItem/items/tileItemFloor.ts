import { World } from "../../../world/world";
import { TileItem } from "../tileItem";
import { TileItemInfo } from "../tileItemInfo";

export class TileItemFloor extends TileItem {
    constructor(world: World, tileItemInfo: TileItemInfo) {
        super(world, tileItemInfo);

        this.showDebugText = false;
    }
}