import { BaseObject } from '../../shared/baseObject/baseObject';
import { Server } from '../server/server';

import socketio from 'socket.io';
import { Client } from '../client/client';
import { PacketData_ServerList, PacketData_Test, PacketType } from '../../client/network/packet';
import { User } from '../user/user';

export class MasterServer extends BaseObject {
    public static Instance: MasterServer;

    public get servers() { return this._servers; }

    private _io: socketio.Server;
    private _servers: Server[] = [];
    private _users: User[] = [];
    private _clients: Client[] = [];

    constructor(io: socketio.Server) {
        super();
        MasterServer.Instance = this;
        this._io = io;
    }

    public start() {
        const io = this._io;

        io.on('connection', socket => {
            this.onSocketConnect(socket)
        });
    }

    public createServer(name: string) {
        const server = new Server();
        this._servers.push(server);
        return server;
    }
    
    public findServer(fn: (server: Server) => boolean): Server | undefined {
        return this._servers.filter(fn)[0];
    }

    public createUser() {
        const user = new User();
        this._users.push(user);
        return user;
    }

    public createClient(user: User, socket: socketio.Socket) {
        const client = new Client(user, socket);
        this._clients.push(client);
        return client;
    }

    private onSocketConnect(socket: socketio.Socket) {
        this.log("socket connection");

        let user: User | undefined;

        for (const item of this._users) {
            if(item.sessionId == socket.handshake["session"].sessionid) {
                user = item;
                break;
            }
        }

        let newUser: boolean = false;

        if(!user) {
            user = this.createUser();
            newUser = true;
        }

        const client = this.createClient(user, socket);
        user.setClient(client);
        socket.on("disconnect", () => this.onClientDisconnect(client));

        if(newUser) {
            const server = this.createServer("server");
            server.setOwner(client);
            server.start();
        }

        this.log(`user ${user.id}, session ${user.sessionId} (${this._clients.length} clients, ${this._users.length} users)`);

        client.send<PacketData_ServerList>(PacketType.SERVER_LIST, {
            servers: this.servers.map(server => server.getServerInfo())
        });
    }

    public onClientDisconnect(client: Client) {
        this.log(`client disconnected, user ${client.user.id}`);

        this._clients.splice(this._clients.indexOf(client), 1);
    }
}