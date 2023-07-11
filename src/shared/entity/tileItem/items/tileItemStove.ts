import { World } from "../../../world/world";
import { TileItem, TileItemData } from "../tileItem";
import { TileItemInfo } from "../tileItemInfo";

interface StoveData extends TileItemData {
    cookTime?: number
}

export class TileItemStove extends TileItem {
    private _cookTime: number = 0;

    constructor(world: World, tileItemInfo: TileItemInfo) {
        super(world, tileItemInfo);

        this.setCollisionEnabled(true);
    }

    public serializeTileItem(): StoveData {
        const data: StoveData = super.serializeTileItem();

        data.cookTime = this._cookTime;

        return data;
    }
}