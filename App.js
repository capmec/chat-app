import { StyleSheet, LogBox } from 'react-native'
import Start from './components/Start'
import Chat from './components/Chat'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { disableNetwork } from 'firebase/firestore'
import { enableNetwork } from 'firebase/firestore'
import { useEffect } from 'react'
import { Alert } from 'react-native'
import { useNetInfo } from '@react-native-community/netinfo'

LogBox.ignoreLogs([/auth/i, /avatar/i])
LogBox.ignoreLogs(['AsyncStorage has been extracted from'])

const App = () => {
  const firebaseConfig = {
    apiKey: 'AIzaSyB4CMVGQAqh4cMv15HY0ceshiiGXiqsG-U',
    authDomain: 'app-n-chat.firebaseapp.com',
    projectId: 'app-n-chat',
    storageBucket: 'app-n-chat.appspot.com',
    messagingSenderId: '958552177913',
    appId: '1:958552177913:web:58a17610fa22f2e205f628',
  }

  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)
  const storage = getStorage(app)

  const Stack = createNativeStackNavigator()

  const connectionStatus = useNetInfo()

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert('Connection Lost!')
      disableNetwork(db)
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db)
    }
  }, [connectionStatus.isConnected])

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Start'>
        <Stack.Screen name='Start' component={Start} />
        <Stack.Screen name='Chat'>
          {(props) => (
            <Chat
              db={db}
              storage={storage}
              isConnected={connectionStatus.isConnected}
              {...props}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
