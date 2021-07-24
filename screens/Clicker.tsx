import * as React from 'react';
import { StyleSheet, Image, ScrollView, RefreshControl, View as ReactNativeView, Button } from 'react-native';
import { TouchableWithoutFeedback, TouchableHighlight } from 'react-native-gesture-handler';
import { MonoText } from '../components/StyledText';
import { Text, View } from '../components/Themed';
import { useLevelDetails } from '../context/LevelContext';
import { useWorldData } from '../context/WorldContext';
import { useGameData } from '../game/game';
import Finger from '../game/items/Finger';
import getBoxShadow from '../util/getBoxShadow';
import getRandNumber from '../util/getRandNumber';
import AnimatedNumber from 'react-native-animated-number'
import { useUISettings } from '../context/UiSettingsContext';
import useGameEvent from '../hooks/useGameEvent';

interface ClickerProps {
  navigation: any
}

export default (props: ClickerProps) => {

  const [randomMultiplicator, setRandomMultiplicator] = React.useState(1)
  const [refreshing] = React.useState(false)

  const game = useGameData()
  const worldData = useWorldData()
  const levelDetails = useLevelDetails()
  const uiSettings = useUISettings()

  React.useEffect(() => {
    let interval = setInterval(() => {

      let randNum = Math.random() * (100 - 1) + 1

      if      (randNum > 97) setRandomMultiplicator(5)
      else if (randNum > 88) setRandomMultiplicator(4)
      else if (randNum > 80) setRandomMultiplicator(3)
      else setRandomMultiplicator(2)

      setTimeout(() => setRandomMultiplicator(1), getRandNumber(8000, 20000))

    }, getRandNumber(40000, 50000))

    return () => clearInterval(interval)
  }, [])

  function handleClick() {
    let amount = 1
    const fingerLevel = (game.cachedItems.find(e => e.id === Finger.id) || {}).level
    if (fingerLevel != undefined) amount += fingerLevel
    addCookie(amount)
  }

  const addCookie = React.useCallback((amount: number) => {
    const multiplicators = [randomMultiplicator]
    game.addCookies(amount, multiplicators)
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
        contentContainerStyle={{...styles.container, backgroundColor: uiSettings.global.colorScheme === 'dark' ? '#292929' : 'white'}}>

          <ReactNativeView style={styles.headerView}>

            <ReactNativeView style={{
              ...styles.levelBar,
              width: `${levelDetails.xpRelation * 100}%`
            }}>
            </ReactNativeView>

            <ReactNativeView style={styles.headerLevelDetails}>
              <ReactNativeView style={styles.headerXpDetails}>
                <AnimatedNumber 
                  style={{...styles.xpPart, ...uiSettings.global.textStyle}}
                  value={levelDetails.xp}
                />
                <MonoText style={styles.xpseperator}>/</MonoText>
                <AnimatedNumber 
                  style={{...styles.xpPart, ...uiSettings.global.textStyle}}
                  value={levelDetails.xpRequired}
                  formatter={n => ` ${n} XP`}
                />
              </ReactNativeView>
              <MonoText style={{...styles.level, ...uiSettings.global.textStyle}}>
                Lvl: {levelDetails.level}
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

              <AnimatedNumber 
                style={{ fontFamily: 'space-mono', fontSize: 27, width: '100%', height: 50, textAlign: 'center', ...uiSettings.global.textStyle }}
                value={Math.round(game.cookies)}
              />
              {uiSettings.clicker.show_decimal && <AnimatedNumber 
                style={{ fontFamily: 'space-mono', fontSize: 18, width: '100%', height: 50, textAlign: 'center', ...uiSettings.global.textStyle }}
                value={game.cookies % 1 * 100000}
              />}
              <AnimatedNumber 
                style={{ fontFamily: 'space-mono', fontSize: 25, width: '100%', height: 50, textAlign: 'center', ...uiSettings.global.textStyle }}
                value={randomMultiplicator}
                formatter={n => `x${n}`}
              />
              <MonoText>XP u. Cookies</MonoText>
              
            </View>
          
          </ReactNativeView>
          
          <ReactNativeView style={styles.footerView}>
            {game.events.map(Ev => <Ev.Event key={Math.random()}/>)}
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
    height: 150,
    top: 0,
    justifyContent: 'center', 
    alignItems: 'center',
    margin: 0,
    padding: 0
  },
  levelBar: {
    flexDirection: 'row',
    top: 0,
    marginTop: -95,
    height: 25,
    margin: 0,
    backgroundColor: '#0362fc',
    borderRadius: 7,
  },
  headerLevelDetails: {
    marginTop: 5,
    width: '100%',
    textAlign: 'center',
    alignItems: 'center'
  },
  headerXpDetails: {
    flexDirection: 'row',
    width: '50%',
    justifyContent: 'space-around'
  },
  level: {
    fontSize: 14,
  },
  xpPart: {
    marginHorizontal: 2,
    minWidth: '20%',
    fontSize: 15,
    marginTop: 5,
    color: 'black',
    textAlign: 'center',
    fontFamily: 'space-mono'
  },
  xpseperator: {
    marginTop: 5,
    fontSize: 15
  },
  bodyView: {
    width: '100%',
    height: '63%',
    justifyContent: 'center', 
    alignItems: 'center',
    borderRadius: 15,
  },
  bodyCard: {
    paddingVertical: 118,
    paddingHorizontal: 85,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    ...getBoxShadow(15)
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  world: {
    resizeMode: 'stretch',
    height: 80,
    width: 80,
    margin: 10
  },
});
