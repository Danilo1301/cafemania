import { ServerInfo } from "../../server/server/server"
import { EntityData } from "../../shared/entity/entity"
import { TileData } from "../../shared/entity/tile/tile"

export enum PacketType {
    TEST,
    SERVER_LIST,
    JOIN_SERVER,
    JOIN_SERVER_STATUS,
    JOIN_WORLD,
    JOIN_WORLD_STATUS,
    WORLD_DATA_TILES,
    WORLD_DATA_ENTITIES
}

export interface Packet {
    type: PacketType
    data: any
}

export interface PacketData_Test {
    x: number
    str: string
}

export interface PacketData_ServerList {
    servers: ServerInfo[]
}

export interface PacketData_JoinServer {
    id: string
}

export interface PacketData_JoinServerStatus {
    success: boolean
    worlds?: string[]
}


export interface PacketData_JoinWorld {
    id: string
}

export interface PacketData_JoinWorldStatus {
    success: boolean
    playerId?: string
}

export interface PacketData_WorldData_Tiles {
    tiles: TileData[]
}

export interface PacketData_WorldData_Entities {
    entities: EntityData[]
}