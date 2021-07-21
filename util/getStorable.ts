import { useWorldData } from "../context/WorldContext"
import { GameDataRegistry } from "../game/registry"
import { CachedItemList, WorldDataID } from "../game/types"
import { retrieve } from "./storage"

export default async (wid: WorldDataID) => {
    const cookies = await retrieve<number>(GameDataRegistry.cookies(wid), 0)
    const totalCookies = await retrieve<number>(GameDataRegistry.totalCookies(wid), 0)
    const cachedItems = await retrieve<CachedItemList>(GameDataRegistry.cachedItems(wid), [])
    return { cookies, totalCookies, cachedItems}
}