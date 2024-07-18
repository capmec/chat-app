import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'

// import the screens
import Screen1 from './components/Screen1'
import Screen2 from './components/Screen2'

// import react Navigation
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// Create the navigator
const Stack = createNativeStackNavigator()

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Screen1'>
        <Stack.Screen name='Screen1' component={Screen1} />
        <Stack.Screen name='Screen2' component={Screen2} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
