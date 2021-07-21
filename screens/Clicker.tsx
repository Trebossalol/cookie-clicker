import * as React from 'react';
import { StyleSheet, Image, ScrollView, RefreshControl, View as ReactNativeView } from 'react-native';
import { TouchableWithoutFeedback, TouchableHighlight } from 'react-native-gesture-handler';
import { MonoText } from '../components/StyledText';
import { Text, View } from '../components/Themed';
import { useLevelDetails } from '../context/LevelContext';
import { useWorldData } from '../context/WorldContext';
import { useGameData } from '../game/game';
import Finger from '../game/items/Finger';
import getBoxShadow from '../util/getBoxShadow';
import getRandNumber from '../util/getRandNumber';

export function fromNum(number: number): string {
  const isK = number > 999
  const isMill = number > 999999
  const isMillia = number > 999999999


  return isMillia ? 
    `${(number/1000000000).toFixed(3)} Billion.` : isMill ? 
    `${(number/1000000).toFixed(3)} Mio.` : isK ? 
    `${(number/1000).toFixed(3)} K` : `${number.toString()}`

}

interface ClickerProps {
  navigation: any
}

export default (props: ClickerProps) => {

  const [randomMultiplicator, setRandomMultiplicator] = React.useState(1)
  const [refreshing] = React.useState(false)

  const game = useGameData()
  const worldData = useWorldData()
  const levelDetails = useLevelDetails()

  React.useEffect(() => {
    let interval = setInterval(() => {

      let randNum = Math.random() * (100 - 1) + 1

      if      (randNum > getRandNumber(90, 95)) setRandomMultiplicator(5)
      else if (randNum > getRandNumber(75, 85)) setRandomMultiplicator(4)
      else if (randNum > 60) setRandomMultiplicator(3)
      else setRandomMultiplicator(2)

      setTimeout(() => setRandomMultiplicator(1), getRandNumber(12000, 25000))

    }, getRandNumber(30000, 50000))

    return () => clearInterval(interval)
  }, [])

  function handleClick() {
    let amount = 1
    const fingerLevel = (game.cachedItems.find(e => e.id === Finger.id) || {}).level
    if (fingerLevel != undefined) amount += fingerLevel
    addCookie(amount)
  }

  const addCookie = React.useCallback((amount: number, ) => {
    levelDetails.addXp(1)
    game.addCookies(amount, [randomMultiplicator])
  }, [randomMultiplicator])

  function navigateTo(location: string, params?: object): void {
    props.navigation.navigate(location, params)
  }

  return (
      <ScrollView
        refreshControl={
          <RefreshControl 
            onRefresh={game.sync}
            refreshing={refreshing}
            />
        }
        contentContainerStyle={styles.container}>

          <ReactNativeView style={styles.headerView}>
            <ReactNativeView style={{
              ...styles.levelBar,
              width: `${levelDetails.xpRelation < 16 ? 16 : levelDetails.xpRelation}%`
            }}>
              <MonoText style={styles.xpamount}>
                {levelDetails.xp}/{levelDetails.xpRequired} XP
              </MonoText>
            </ReactNativeView>
          </ReactNativeView>

          <ReactNativeView style={styles.bodyView}>

            <View style={styles.bodyCard}>

              <TouchableWithoutFeedback
                onPress={handleClick}
                >
                <Image 
                    source={require('../assets/images/cookie.png')}
                    style={styles.cookie}
                    accessibilityLabel='Cookie Icon'
                  />
              </TouchableWithoutFeedback>

              <MonoText style={{ fontSize: 33, height: 50, width: 300, textAlign: 'center' }}>{game.cookies.toString().split('.')[0]}</MonoText>
              <MonoText style={{ fontSize: 15, height: 50, width: 300, textAlign: 'center' }}>Dezimal: {game.cookies.toFixed(6).split('.')[1]}</MonoText>
              <MonoText style={{ textAlign: 'center', fontSize: 25 }}>x{randomMultiplicator} </MonoText>

            </View>
          
          </ReactNativeView>
          
          <ReactNativeView style={styles.footerView}>
            <TouchableHighlight onPress={() => navigateTo('Worlds')}>
              <Image 
                source={require('../assets/images/world.png')}
                style={styles.world}
                />
            </TouchableHighlight>
          </ReactNativeView>
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
  headerView: {
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    height: 5,
    top: 0,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  levelBar: {
    height: 5,
    margin: 0,
    backgroundColor: '#4287f5',
  },
  xpamount: {
    textAlign: 'center',
    fontSize: 17,
    marginTop: 5,
    width: '100%',
  },
  bodyView: {
    width: '100%',
    height: '70%',
    justifyContent: 'center', 
    alignItems: 'center'
  },
  bodyCard: {
    paddingVertical: 118,
    paddingHorizontal: 85,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    ...getBoxShadow(11)
  },
  cookie: {
    resizeMode: 'stretch',
    height: 200,
    width: 200
  },
  footerView: {
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    height: 100,
    bottom: 0,
    justifyContent: 'flex-end'
  },
  world: {
    resizeMode: 'stretch',
    height: 80,
    width: 80,
    margin: 10
  },
});
