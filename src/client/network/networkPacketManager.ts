import { BaseObject } from "../../shared/baseObject/baseObject";
import { EventRegister } from "../../shared/eventRegister/eventRegister";
import { Packet, PacketType } from "./packet";

export class NetworkPacketManager extends BaseObject {
    public events = new Phaser.Events.EventEmitter();

    private _socket: any;
    private _eventRegister: EventRegister;

    constructor(socket: any) {
        super();

        this._socket = socket;

        this._socket.on("p", (packet: Packet) => {
            this.log(`received packet '${packet.type}'`, packet);
            this.events.emit(NetworkPacketManager.getReceivedEventKey(packet.type), packet.data);
        });

        this._eventRegister = new EventRegister(this);
    }   

    public send<T>(packetType: PacketType, data: T) {
        const packet: Packet = {
            type: packetType,
            data: data
        }
        this._socket.emit('p', packet);

        this.log(`send packet '${packet.type}'`, packet);
    }

    public registerListener<T>(eventRegister: EventRegister, packetType: PacketType, fn: (data: T) => void) {
        this.log(`registerListener '${packetType}'`);

        eventRegister.addListener(this.events, NetworkPacketManager.getReceivedEventKey(packetType), fn);
    }

    public addListener<T>(packetType: PacketType, fn: (data: T) => void) {
        this.log(`addListener '${packetType}'`);
        this._eventRegister.addListener(this.events, NetworkPacketManager.getReceivedEventKey(packetType), fn);
    }

    public removeAllListeners() {
        this._eventRegister.removeAllListeners();
    }

    public static getReceivedEventKey(packetType: PacketType) {
        return `RECEIVED_${packetType}`;
    }
}