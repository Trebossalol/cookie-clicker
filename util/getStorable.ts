import { GameDataRegistry, retrieve } from "../game/game"
import { CachedItemList } from "../game/StoreItems"

export default async () => {
    const cookies = await retrieve<number>(GameDataRegistry.cookies, 0)
    const totalCookies = await retrieve<number>(GameDataRegistry.totalCookies, 0)
    const cachedItems = await retrieve<CachedItemList>(GameDataRegistry.cachedItems, [])
    return { cookies, totalCookies, cachedItems}
}