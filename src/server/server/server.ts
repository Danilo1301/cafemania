import { Game } from '../../shared/game/game';
import { Client } from '../client/client';

import { v4 as uuidv4 } from 'uuid';
import { PacketData_JoinServerStatus, PacketData_JoinWorldStatus, PacketData_WorldData_Entities, PacketData_WorldData_Tiles, PacketType } from '../../client/network/packet';
import { BaseObject } from '../../shared/baseObject/baseObject';
import { World } from '../../shared/world/world';

export interface ServerInfo {
    id: string
    name: string
    owner: string
    players: number
}

export class Server extends BaseObject {
    public get id() { return this._id; }
    public get name() { return this._name; }
    public get game() { return this._game; }
    public get clients() { return this._clients; }
    public get owner() { return this._owner!; }

    private _id: string = uuidv4();
    private _name: string = "Server";
    private _game: Game;
    private _clients: Client[] = [];
    private _owner?: Client;

    constructor() {
        super();
        this._game = new Game();
    }

    public start() {
        const game = this._game;
        game.init();
        game.start();
        
        const world1 = game.createWorld();
        world1.worldGenerator.generate();

        const world2 = game.createWorld();
        world2.worldGenerator.generateTest();

        this.startInvervalUpdate();
    }

    public update(dt: number) {
        this.game.update(dt);
    }
    
    private startInvervalUpdate() {
        var self = this;
        var lastUpdate = Date.now();
        var myInterval = setInterval(tick, 1);
        function tick() {
            var now = Date.now();
            var dt = now - lastUpdate;
            lastUpdate = now;
        
            if(dt == 0) dt = 0.01;
            if(dt > 30) dt = 30;

            self.update(dt / 100);
        }
    }

    public destroy() {
    }

    public setOwner(client: Client) {
        this._owner = client;
    }

    public getServerInfo() {
        const info: ServerInfo = {
            id: this.id,
            name: this.name,
            players: this.clients.length,
            owner: this._owner?.user.id || ""
        }
        return info;
    }

    public onClientRequestJoin(client: Client) {
        this.onClientJoin(client);
        return true;
    }

    public onClientJoin(client: Client) {
        this.log(`client join ${client.user.id}`);

        this._clients.push(client);

        client.send<PacketData_JoinServerStatus>(PacketType.JOIN_SERVER_STATUS, {
            success: true,
            worlds: this.game.worlds.map(world => world.id)
        });
    }

    public onClientRequestJoinWorld(client: Client, world: World) {
        this.onClientJoinWorld(client, world);
        return true;
    }

    public onClientJoinWorld(client: Client, world: World) {
        this.log(`client ${client.user.id} join world ${world.id}`);

        const player = world.spawnPlayer(0, 0);

        client.send<PacketData_JoinWorldStatus>(PacketType.JOIN_WORLD_STATUS, {
            success: true,
            playerId: player.id
        });

        client.send<PacketData_WorldData_Tiles>(PacketType.WORLD_DATA_TILES, {
            tiles: world.tileMap.tiles.filter(tile => !tile.isSidewalk).map(tile => tile.serializeTile())
        });

        setInterval(() => {

            client.send<PacketData_WorldData_Entities>(PacketType.WORLD_DATA_ENTITIES, {
                entities: world.getNormalEntities().map(entity => entity.serialize())
            });
            
        }, 1000)
    }
}