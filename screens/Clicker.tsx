import * as React from 'react';
import { StyleSheet, Image, ScrollView, RefreshControl, Button } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import EditScreenInfo from '../components/EditScreenInfo';
import { MonoText } from '../components/StyledText';
import { Text, View } from '../components/Themed';
import { useGameData } from '../game/game';

import Finger from '../game/items/Finger';
import CookieStore from '../game/items/Cookie_Store'

export function fromNum(number: number): string {
  const isK = number > 999
  const isMill = number > 999999

  return isMill ? 
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

    React.useEffect(() => {
      const cookieStore = game.cachedItems.find(e => e.id === CookieStore.id)
      if (!cookieStore) return
      let interval = setInterval(() => {
        addCookie(((cookieStore?.level || 2) / 2)  * 2)
      }, 1000)

      return () => clearInterval(interval)
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
