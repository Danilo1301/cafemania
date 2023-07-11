import { NetworkPacketManager } from "../../client/network/networkPacketManager";
import { BaseObject } from "../../shared/baseObject/baseObject";
import { PacketData_JoinServer, PacketData_JoinServerStatus, PacketData_Test, PacketType } from "../../client/network/packet";

import socketio, { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { Client } from "../client/client";

export class User extends BaseObject {
    public get id() { return this._id; }
    public get client() { return this._client; }
    public get sessionId() { return this._sessionId; }

    private _id: string = uuidv4();
    private _client?: Client;
    private _sessionId: string = "";

    constructor() {
        super();
    }

    public setClient(client: Client) {
        this._client = client;
        this._sessionId = client.socket.handshake["session"].sessionid;

        this.log("set client");
    }
}
