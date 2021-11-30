import { Dish } from "../dish/dish";
import { DishPlate } from "../dish/dishPlate";
import { TileItemCounter } from "../tileItem/items/tileItemCounter";
import { Utils } from "../utils/utils";
import { SyncType, World } from "../world/world";
import { Player, PlayerType } from "./player";
import { PlayerClient } from "./playerClient";


export class PlayerWaiter extends Player {
    private _checkClientsTime: number = 0;
    private _isBusy: boolean = false;

    private _dishPlate?: DishPlate;
    private _carryingDish?: Dish;
    
    private _goingToCounter: boolean = false;
    private _goingToServe = false;

    constructor(world: World) {
        super(world);
        this._type = PlayerType.WAITER;
        this._spriteTextureName = "PlayerSpriteTexture_Waiter";

        this.speed = 3;
    }
    
    public update(dt: number) {
        super.update(dt);

        if(this.world.sync != SyncType.SYNC) {
            this.updateWaiterBehavior(dt);
        }

    }

    private updateWaiterBehavior(dt: number) {
        this._checkClientsTime += dt;

        if(!this._isBusy) {

            if(this._checkClientsTime >= 1000) {
                this._checkClientsTime = 0;
                this.log("looking for clients");
                this.checkClients_Serve();
            }
        }

    }


    public render(dt: number) {
        super.render(dt);
        this.renderDishPlate();
    }

    private renderDishPlate() {
        if(this._carryingDish) {
            if(!this._dishPlate) {
                const dish = this._carryingDish;
                this._dishPlate = new DishPlate(dish);
            }
            const h = 20;
            const position = new Phaser.Math.Vector2(
                this.position.x,
                this.position.y - h
            )
            this._dishPlate.setPosition(position.x, position.y) ;
            this._dishPlate.setDepth(position.y + h);
        } else {
            if(this._dishPlate) {
                this._dishPlate.destroy()
                this._dishPlate = undefined
            }
        }
    }

    private checkClients_Serve() {
        const client = this.getRandomPlayerWaitingForWaiter();
        const counter = this.getAnyAvaliableCounter();

        if(!client) return;
        if(!counter) return;

        this.log("need to serve client")

        this._isBusy = true;

        client.waitingForWaiter = false;

        const dish = counter.getDish();
        const table = client.getChairPlayerIsSitting()!.getTableInFront()!;

        this.taskWalkNearToTile(counter.tile);
        this.taskPlayAnimation('idk', 800);
        this.taskExecuteAction(async () => {
            this._carryingDish = dish
        });
        this.taskWalkNearToTile(table.tile);
        this.taskExecuteAction(async () => {
            this._carryingDish = undefined;
            table.eatTime = 20000;
            table.setDish(dish);
            this._isBusy = false;
        });

        //this.taskServeClient(client, counter);

    }


    private getRandomPlayerWaitingForWaiter() {
        const players = Utils.shuffleArray(this.world.getPlayerClients());
        for (const player of players) {
            if(player.waitingForWaiter) return player;
        }
        return;
    }

    public getAnyAvaliableCounter() {
        const counters = this.world.getCounters().filter(counter => {
            if(counter.isEmpty) return false
            const servings = counter.getDishAmount() - counter.amountWaitersComing
            if(servings <= 0) return false
            return true
        })
        if(counters.length == 0) return
        return Utils.shuffleArray(counters)[0]
    }
}