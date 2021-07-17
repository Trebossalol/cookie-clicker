import * as React from 'react';
import { StyleSheet, Image, ScrollView, RefreshControl, Button } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import EditScreenInfo from '../components/EditScreenInfo';
import { MonoText } from '../components/StyledText';
import { Text, View } from '../components/Themed';
import { useGameData } from '../game/game';

import Finger from '../game/items/Finger';
import CookieStore from '../game/items/Cookie_Store'
import CookieFactory from '../game/items/Cookie_Factory'
import {ItemList} from '../game/StoreItems'
import getStorable from '../util/getStorable';

export function fromNum(number: number): string {
  const isK = number > 999
  const isMill = number > 999999
  const isMillia = number > 999999999

  return isMillia ? 
    `${number/1000000000} Billion.` : isMill ? 
    `${number/1000000} Mio.` : isK ? 
    `${number/1000} K` : number.toString()

}

export default () => {

    const [refreshing] = React.useState(false)

    const game = useGameData()

    function handleClick() {
      let amount = 1
      const fingerLevel = (game.cachedItems.find(e => e.id === Finger.id) || {}).level
      if (fingerLevel != undefined) amount += fingerLevel
      addCookie(amount)
    }

    function addCookie(amount: number): void {
      game.setCookies(e => e + amount)
      game.addToTotalCookie(amount)
    }

    function setupListeners(): () => void {
      const intervals: any[] = []
      getStorable()
        .then(({ cookies: current, totalCookies }) => {
          game.cachedItems.forEach((cache) => {
            const item = ItemList.find(e => e.id === cache.id)
            if (!item) return

            setInterval(() => {
              addCookie(item.onTick({ 
                cache, 
                cachedItems: game.cachedItems, 
                cookieData: { 
                  current, 
                  total: totalCookies 
                } 
              }))

            }, 1000)
          })
        })

      function cleanup(): void {
        intervals.forEach(i => clearInterval(i))
      }

      return cleanup
    }

    React.useEffect(() => {
      const cleanup = setupListeners()
      return cleanup
    }, [game.cachedItems])

    return (
        <ScrollView
          refreshControl={
            <RefreshControl 
              onRefresh={game.sync}
              refreshing={refreshing}
              />
          }
          contentContainerStyle={styles.container}>
          <TouchableWithoutFeedback
            onPress={handleClick}
            >
            <Image 
                source={require('../assets/images/cookie.png')}
                style={styles.cookie}
                accessibilityLabel='Cookie Icon'
              />
            </TouchableWithoutFeedback>
            <MonoText style={{ fontSize: 33, height: 50 }}>{fromNum(game.cookies)}</MonoText>
            <TouchableWithoutFeedback>
              <Button onPress={game.cleanAccount} title='Daten löschen'/>
            </TouchableWithoutFeedback>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  cookie: {
    resizeMode: 'stretch',
    height: 200,
    width: 200
  }
});
