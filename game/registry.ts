import { WorldDataID } from "./types";

export const GameDataRegistry = {
    cookies: (wid: WorldDataID) => `${wid}_GAME_COOKIES_AMOUNT`,
    cachedItems: (wid: WorldDataID) =>`${wid}_GAME_CACHED_ITEMS`,
    totalCookies: (wid: WorldDataID) => `${wid}_GAME_COOKIES_TOTAL`,
    globalMultiplicator: (wid: WorldDataID) => `${wid}_GAME_COOKIE_MULTIPLICATOR`,
    reachedWorld: `GAME_REACHED_WORLD`,
    levelDetails: `GAME_CACHED_LEVEL-DT`,
    uiSettings: `APP_UI_SETTINGS`
}