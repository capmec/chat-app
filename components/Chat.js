//Chat.js
import { useEffect, useState } from 'react'
import { GiftedChat, Bubble, InputToolbar, Day } from 'react-native-gifted-chat'
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native'
import {
  onSnapshot,
  query,
  orderBy,
  collection,
  addDoc,
} from 'firebase/firestore'
import CustomActions from './CustomActions'
import AsyncStorage from '@react-native-async-storage/async-storage'
import MapView from 'react-native-maps'

const Chat = ({ db, route, navigation, isConnected, storage }) => {
  const { name, background, userID } = route.params
  const [messages, setMessages] = useState([])

  let unsubMessages

  useEffect(() => {
    navigation.setOptions({ title: name })

    if (isConnected === true) {
      if (unsubMessages) unsubMessages()
      unsubMessages = null

      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'))

      unsubMessages = onSnapshot(q, (documentsSnapshot) => {
        let newMessages = []
        documentsSnapshot.forEach((doc) => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),
          })
        })
        cacheMessages(newMessages)
        setMessages(newMessages)
      })
    } else loadCachedMessages()

    return () => {
      if (unsubMessages) unsubMessages()
    }
  }, [isConnected])

  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache))
    } catch (error) {
      console.log(error.message)
    }
  }

  const loadCachedMessages = async () => {
    const cachedMessages = (await AsyncStorage.getItem('messages')) || []
    setMessages(JSON.parse(cachedMessages))
  }

  const onSend = (newMessages) => {
    addDoc(collection(db, 'messages'), newMessages[0])
  }

  const renderDay = (props) => {
    return <Day {...props} textStyle={{ color: '#ffff' }} />
  }

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#D6DDF6',
            borderBottomRightRadius: 15,
            borderBottomLeftRadius: 15,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 0,
          },
          right: {
            backgroundColor: '#ED3F78',
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 15,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
          },
        }}
      />
    )
  }

  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />
    else return null
  }

  const renderCustomActions = (props) => {
    return (
      <CustomActions
        onSend={onSend}
        storage={storage}
        userID={userID}
        {...props}
      />
    )
  }

  const renderCustomView = (props) => {
    const { currentMessage } = props
    if (currentMessage.location) {
      return (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        </View>
      )
    }
    return null
  }

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <GiftedChat
        renderDay={renderDay}
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userID,
          name: name,
        }}
      />
      {Platform.OS === 'android' ? (
        <KeyboardAvoidingView behavior='height' />
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    width: 200,
    height: 200,
    borderRadius: 13,
    overflow: 'hidden',
    margin: 4,
  },
  map: {
    width: '100%',
    height: '100%',
  },
})

export default Chat
