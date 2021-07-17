import * as React from 'react';
import { StyleSheet, FlatList, RefreshControl, TouchableHighlight, ToastAndroid, Button, TouchableNativeFeedback, View as ReactNativeView } from 'react-native';
import { MonoText } from '../components/StyledText';
import { View, Text } from '../components/Themed';
import { ItemList, Item, CachedItemList, CachedItem, CookieData } from '../game/StoreItems'
import { retrieve, GameDataRegistry, store } from '../game/game'
import TabBarIcon from '../constants/TabBarIcon'
import Seperator from '../components/Seperator';
import useLoadingSpinner from '../hooks/useLoadingSpinner';
import getStorable from '../util/getStorable';

export default () => {

  const { Spinner, setLoading } = useLoadingSpinner()

  const [listData, setListData] = React.useState(ItemList)
  const [cachedItems, setCachedItems] = React.useState<CachedItemList>([])
  const [cookieData, setCookieData] = React.useState<CookieData>({ current: 0, total: 0 })
  const [refreshing] = React.useState<boolean>(false)
  const [expandedIndex, setExpandedIndex] = React.useState<number|null>(null)

  React.useEffect(() => {
    updateStates()
  }, [])

  async function updateStates() {
    const { cachedItems, cookies, totalCookies } = await getStorable()
    setCachedItems(cachedItems)
    setCookieData({
      current: cookies,
      total: totalCookies,
    })
  }

  return (
      <FlatList
          data={listData}
          ListHeaderComponent={Spinner}
          renderItem={info => <ItemRenderer 
                                  cookieData={cookieData} 
                                  cachedItems={cachedItems} 
                                  expandedIndex={expandedIndex}
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
  cookieData: CookieData
  expandedIndex: number|null
  setExpandedIndex: React.Dispatch<React.SetStateAction<number | null>>
  updateStates: () => Promise<void>
  setLoading: (state: boolean, delayMS?: number) => void
}

function ItemRenderer({ index, item, cachedItems, cookieData, expandedIndex, setExpandedIndex, updateStates, setLoading }: ItemRendererProps) {

  const [expanded, setExpanded] = React.useState<boolean>(false)

  const cache = React.useMemo(() => {
    const cache = cachedItems?.find(e => e.id === item.id)
    if (!cache) return undefined
    return {
      ...cache,
      ...item
    }
  }, [cachedItems, item])
  const price = React.useMemo(() => item?.calcNextPrice({ cachedItems, cookieData, cache }), [item, cachedItems, cookieData, cache])
  const itemUnlocked = React.useMemo(() => item?.unlocked({ cachedItems, cookieData, cache }), [cachedItems, cookieData])
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
      await store(GameDataRegistry.cachedItems, cachedItemsList)
    }

    if (price > cookieData.current) return ToastAndroid.show('You need more cookies', ToastAndroid.SHORT)

    setLoading(true)

    await store(GameDataRegistry.cookies, cookieData.current - price)

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

   await updateStates()
   setLoading(false)
   ToastAndroid.show('Erfolg!', ToastAndroid.SHORT)
  }

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
                  cache ? 'Upgrade locked' : 'Locked' :
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
  itemBaseView: {
    padding: 12,
    marginBottom: 7
  },
  itemUnavailableView: {
    backgroundColor: '#9c9c9c'
  },
  itemView: {
    
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
