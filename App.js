import Start from './components/Start'
import Chat from './components/Chat'

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { initializeApp } from 'firebase/app'
import { getFirestore, disableNetwork, enableNetwork } from 'firebase/firestore'

import { useNetInfo } from '@react-native-community/netinfo'
import { useEffect } from 'react'
import { LogBox, Alert } from 'react-native'

LogBox.ignoreLogs(['[2024-04-07T20:44:48.130Z]  @firebase/auth: Auth (10.3.1)'])
LogBox.ignoreLogs(['AsyncStorage has been extracted from'])

const Stack = createNativeStackNavigator()

const App = () => {
  // Define a new state that represents the network connectivity status
  const connectionStatus = useNetInfo()

  // useEffect to display an alert popup if no internet connection
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert('Connection lost!')
      disableNetwork(db)
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db)
    }
  }, [connectionStatus.isConnected])

  // The web app's Firebase configuration
  const firebaseConfig = {
    apiKey: 'AIzaSyB4CMVGQAqh4cMv15HY0ceshiiGXiqsG-U',
    authDomain: 'app-n-chat.firebaseapp.com',
    projectId: 'app-n-chat',
    storageBucket: 'app-n-chat.appspot.com',
    messagingSenderId: '958552177913',
    appId: '1:958552177913:web:58a17610fa22f2e205f628',
  }

  // Initialize Firebase
  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)

  return (
    /* Wrap the app with NavigationContainer */
    <NavigationContainer>
      {/* Create a stack navigator with initial route Start  */}
      <Stack.Navigator initialRouteName='Start'>
        <Stack.Screen name='Start' component={Start} />
        <Stack.Screen name='Chat'>
          {(props) => (
            <Chat
              {...props}
              isConnected={connectionStatus.isConnected}
              db={db}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
