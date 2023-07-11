import { BaseObject } from "../../shared/baseObject/baseObject";
import { io, Socket } from "socket.io-client";
import { Packet, PacketType } from "./packet";
import { NetworkPacketManager } from "./networkPacketManager";


export class Network extends BaseObject {
    public static SERVER_ADDRESS: string = "https://cafemania.glitch.me"; //https://cafemania.danilomaioli.repl.co

    public get socket() { return this._socket; }
    public get packetManager() { return this._packetManager; }

    private _socket: Socket;
    private _packetManager: NetworkPacketManager;

    private _connectCallback?: (connected: boolean) => void;

    public init() {
        const socket = this._socket = io(this.getAddress(), {
            autoConnect: false,
            reconnection: false
        });

        socket.once('connect', () => {
            const fn = this._connectCallback;
            this._connectCallback = undefined;
            if(fn) fn(socket.connected);
        })

        this._packetManager = new NetworkPacketManager(socket);
    }

    public send<T>(packetType: PacketType, data: T) {
        this._packetManager.send(packetType, data);
    }
    
    

    public getAddress() {
        const isLocalHost = location.host.includes('localhost') || location.host.includes(':');
        if(isLocalHost) return `${location.protocol}//${location.host}/`;
        return `${Network.SERVER_ADDRESS}`;
    }

    public connect(callback: (connected: boolean) => void) {
        if(this.socket.connected) {
            callback(true);
            return; 
        }

        this._connectCallback = callback;
        this._socket.connect();
    }
}