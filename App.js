import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'

// import the screens
import Start from './components/Start'
import Chat from './components/Chat'

// import react Navigation
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { LogBox } from 'react-native'
LogBox.ignoreLogs(['AsyncStorage has been extracted from'], ['Setting a timer'])

// Create the navigator
const Stack = createNativeStackNavigator()

const App = () => {
  // Your web app's Firebase configuration
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
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Start'>
        <Stack.Screen name='Start' component={Start} />
        <Stack.Screen name='Chat'>
          {(props) => <Chat {...props} db={db} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
