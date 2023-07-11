import { NetworkPacketManager } from "../../client/network/networkPacketManager";
import { BaseObject } from "../../shared/baseObject/baseObject";
import { PacketData_JoinServer, PacketData_JoinServerStatus, PacketData_JoinWorld, PacketData_Test, PacketType } from "../../client/network/packet";

import socketio, { Socket } from 'socket.io';
import { User } from "../user/user";
import { MasterServer } from "../masterServer/masterServer";
import { Server } from "../server/server";

export class Client extends BaseObject {
    public get user() { return this._user; }
    public get socket() { return this._socket; }
    public get packetManager() { return this._packetManager; }

    private _user: User;
    private _socket: socketio.Socket;
    private _packetManager: NetworkPacketManager;

    private _server?: Server;

    constructor(user: User, socket: socketio.Socket) {
        super();

        this._user = user;
        this._socket = socket;
        this._packetManager = new NetworkPacketManager(socket);

        this.setupEvents();
    }

    private setupEvents() {
        this.packetManager.addListener<PacketData_JoinServer>(PacketType.JOIN_SERVER, (data) => {
            const server = MasterServer.Instance.findServer(server => server.id == data.id);

            if(!server) return;

            this.log("join server");

            if(server.onClientRequestJoin(this)) {
                this._server = server;
            }
        });

        this.packetManager.addListener<PacketData_JoinWorld>(PacketType.JOIN_WORLD, (data) => {
            const server = this._server;
            
            if(!server) return;

            const world = server.game.findWorld(world => world.id == data.id);

            if(!world) return;

            this.log("join world");

            server.onClientRequestJoinWorld(this, world);
        });
    }

    public send<T>(packetType: PacketType, data: T) {
        this._packetManager.send(packetType, data);
    }

    public setUser(user: User) {
        this._user = user;
    }
}