import * as React from 'react';
import { StyleSheet, FlatList, RefreshControl, TouchableHighlight, ToastAndroid, Button, TouchableNativeFeedback, View as ReactNativeView } from 'react-native';
import { MonoText } from '../components/StyledText';
import { View, Text } from '../components/Themed';
import { ItemList, Item, CachedItemList, CachedItem, CookieData, WorldData, LevelDetails } from '../game/types'
import { retrieve, GameDataRegistry, store } from '../game/game'
import TabBarIcon from '../constants/TabBarIcon'
import Seperator from '../components/Seperator';
import useLoadingSpinner from '../hooks/useLoadingSpinner';
import getStorable from '../util/getStorable';
import { fromNum } from './Clicker'
import { useSetUpdatePending } from '../context/UpdateContext';
import getBoxShadow from '../util/getBoxShadow';
import WorldRegister from '../game/worlds/index'
import { useWorldData } from '../context/WorldContext';
import { ExtendedLevelDetails, useLevelDetails } from '../context/LevelContext';

type Callbackfn = (levelDetails: LevelDetails) => LevelDetails
type UpdateLevelDetailsFn = (cb: Callbackfn) => Promise<void>

export default () => {

  const { Spinner, setLoading } = useLoadingSpinner()
  const worldData = useWorldData()
  const levelDetails = useLevelDetails()

  const [listData, setListData] = React.useState<ItemList>()
  const [cachedItems, setCachedItems] = React.useState<CachedItemList>([])
  const [cookieData, setCookieData] = React.useState<CookieData>({ current: 0, total: 0 })
  const [refreshing] = React.useState<boolean>(false)
  const [expandedIndex, setExpandedIndex] = React.useState<number|null>(null)

  React.useEffect(() => {
    updateStates()
    let interval = setInterval(updateStates, 1000)
    setListData(WorldRegister[worldData.id].items)

    return () => {
      clearInterval(interval)
    }
  }, [worldData.id])

  async function updateStates() {
    const { cachedItems, cookies, totalCookies } = await getStorable(worldData.id)
    setCachedItems(cachedItems)
    setCookieData({
      current: cookies,
      total: totalCookies,
    })
  }

  return !listData ? (null) : (
      <FlatList
          data={listData}
          ListHeaderComponent={() => (
            <View style={{ alignItems: 'center'}}>
              <Spinner/>
              <View style={styles.listHeader}>
                  <MonoText style={styles.cookieAmount}>Cookies: {fromNum(Math.round(cookieData.current))}</MonoText>
              </View>
              <Seperator style={{ width: '80%' }}/>
            </View>
          )}
          renderItem={info => <ItemRenderer 
                                  cookieData={cookieData} 
                                  cachedItems={cachedItems} 
                                  expandedIndex={expandedIndex}
                                  worldData={worldData}
                                  levelDetails={levelDetails}
                                  setExpandedIndex={setExpandedIndex}
                                  updateStates={updateStates}
                                  setLoading={setLoading}
                                  {...info} 
                                />}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <ReactNativeView style={{ justifyContent: 'center', alignItems: 'center' }}>
              <MonoText style={{ textAlign: 'center', marginTop: 340, fontSize: 20, width: '80%', }}>Currently there's nothing relevant here. Please take a look later ;)</MonoText>
            </ReactNativeView>
          )}
          ListFooterComponent={() => (
            <ReactNativeView style={{ justifyContent: 'center', alignItems: 'center' }}>
              <MonoText style={{ textAlign: 'center', marginTop: 340, fontSize: 20, width: '80%', }}>Soon here will be more.</MonoText>
            </ReactNativeView>
          )}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing}
              onRefresh={updateStates}
              />
          }
        />
  );
}

interface ItemRendererProps {
  index: number
  item: Item
  cachedItems: CachedItemList
  worldData: WorldData
  cookieData: CookieData
  expandedIndex: number|null
  levelDetails: ExtendedLevelDetails
  setExpandedIndex: React.Dispatch<React.SetStateAction<number | null>>
  updateStates: () => Promise<void>
  setLoading: (state: boolean, delayMS?: number) => void
}

function ItemRenderer({ index, item, cachedItems, cookieData, expandedIndex, setExpandedIndex, updateStates, setLoading, levelDetails, worldData }: ItemRendererProps) {

  const setUpdatePending = useSetUpdatePending()

  const [expanded, setExpanded] = React.useState<boolean>(false)

  const cache = React.useMemo(() => {
    const cache = cachedItems?.find(e => e.id === item.id)
    if (!cache) return undefined
    return {
      ...cache,
      ...item
    }
  }, [cachedItems, item])
  const price = React.useMemo(() => item?.calcNextPrice({ cachedItems, cookieData, cache, worldData }), [item, cachedItems, cookieData, cache])
  const itemUnlocked = React.useMemo(() => (item?.unlocked({ cachedItems, cookieData, cache, worldData })) && ((cache?.maxLvl || 50) > (cache?.maxLvl ? cache?.level : -1)), [cachedItems, cookieData, cache])
  const itemName = React.useMemo(() => 
    !cache ? 
      item.name : 
      typeof cache?.name === 'string' ? cache.name : cache?.name(cache.level), 
  [cache, item])

  React.useEffect(() => {
    if (expandedIndex !== index) setExpanded(false)
  }, [expandedIndex])

  function touchHandler() {
    const newStatus = !expanded
    setExpanded(newStatus)
    if (newStatus === true) setExpandedIndex(index)
    else setExpandedIndex(null)
  }

  async function buyOrUpgradeItem(): Promise<void> {

    async function updateLocalCache(cachedItemsList: CachedItemList) {
      await store(GameDataRegistry.cachedItems(worldData.id), cachedItemsList)
    }

    if (price > cookieData.current) return ToastAndroid.show('You need more cookies', ToastAndroid.SHORT)

    setLoading(true)

    await levelDetails.addXp(5)

    await store(GameDataRegistry.cookies(worldData.id), cookieData.current - price)

    if (cache === undefined) {

      const toCache: CachedItem = {
        id: item.id,
        level: 1
      }

      const current = cachedItems

      current.push(toCache)

      await updateLocalCache(current)

      ToastAndroid.show('Erfolg!', ToastAndroid.SHORT)

   } else {
     
      const current = cachedItems.map(e => {
        if (e.id === item.id) return { ...e, level: e.level + 1 }
        return e
      })

      await updateLocalCache(current)
   }

   setUpdatePending(true)
   await updateStates()
   setLoading(false)
   ToastAndroid.show('Erfolg!', ToastAndroid.SHORT)
  }

  React.useEffect(() => {
    console.log(`Loading store item ${item.id}`)
  }, [])

  return (
    <TouchableNativeFeedback onPress={touchHandler}>
      <View style={styles.itemBaseView}>
        <View style={styles.itemHeaderView}>
          <MonoText style={styles.itemName}>
            {itemName} {cache && (
              <MonoText style={styles.itemLevel}>(Level: {cache.level})</MonoText>
            )}
            <TabBarIcon name='information-circle' color='#1ec1fc'/>
          </MonoText>
          <MonoText style={styles.itemIndex}>({index+1})</MonoText>
        </View>

        <View style={styles.itemBodyView}>
          <TouchableHighlight>
            <Button 
              disabled={!itemUnlocked}
              title={
                !itemUnlocked ? 
                  cache ? 'Upgrade locked' : 'Unavailable' :
                cache ? `Upgrade: ${price} Cookies` : `Buy: ${price} Cookies`
              }
              onPress={buyOrUpgradeItem}
              color={
                cache ? '#33ff88' : undefined
              }
              />
          </TouchableHighlight>
        </View>
     
        {expanded && (
          <View style={styles.itemExpanded}>
            <Seperator/>
            <Text>{item.description}</Text>
          </View>
        )}
     
      </View>
    </TouchableNativeFeedback>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listHeader: {
    height: 60,
    textAlign: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  cookieAmount: {
    fontSize: 30,
    paddingVertical: 5,

  },
  itemBaseView: {
    padding: 12,
    marginTop: 18,
    ...getBoxShadow(9)
  },
  itemUnavailableView: {
    backgroundColor: '#9c9c9c'
  },
  itemHeaderView: {
    justifyContent: 'space-between', 
    flexDirection: 'row'
  },
  itemName: {
    fontSize: 30,
    width: '80%',
  },
  itemLevel: {
    fontSize: 15
  },
  itemIndex: {
    color: 'grey',

  },
  itemBodyView: {
    marginTop: 15
  },
  itemExpanded: {
    marginTop: 10
  }
});
