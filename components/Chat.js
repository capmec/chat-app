import { useEffect, useState } from 'react'
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  onSnapshot,
  query,
  orderBy,
  collection,
  addDoc,
} from 'firebase/firestore'

// Destructure name and background from route.params
const Chat = ({ db, route, navigation, isConnected }) => {
  const { userID } = route.params
  const { name, background } = route.params
  const [messages, setMessages] = useState([])
  const onSend = (newMessages) => {
    addDoc(collection(db, 'messages'), newMessages[0])
  }

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#D6DDF6',
          },
          right: {
            backgroundColor: '#ED3F78',
          },
        }}
      />
    )
  }

  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />
    else return null
  }

  let unsubMessages
  // useEffect hook to set messages options
  // Create a query to get the "messages" collection from the Firestore database
  useEffect(() => {
    if (isConnected === true) {
      // unregister current onSnapshot() listener to avoid registering multiple listeners when
      // useEffect code is re-executed.
      if (unsubMessages) unsubMessages()
      unsubMessages = null

      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'))

      // Subscribe to changes in the "messages" collection using onSnapshot.
      // This function will be called whenever there are changes in the collection.
      unsubMessages = onSnapshot(q, (documentsSnapshot) => {
        // Initialize an empty array to store the new messages
        let newMessages = []
        // Iterate through each document in the snapshot
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

    // Clean up code
    return () => {
      if (unsubMessages) unsubMessages()
    }
  }, [isConnected]) // isConnected used as a dependency value and will allow the component to call the callback of useEffect whenewer the isConnected prop's value changes.

  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache))
    } catch (error) {
      console.log(error.message)
    }
  }
  // Call this function if the isConnected prop turns out to be false in useEffect()
  const loadCachedMessages = async () => {
    // The empty array is for cachedMessages in case AsyncStorage() fails when the messages item hasn’t been set yet in AsyncStorage.
    const cachedMessages = (await AsyncStorage.getItem('messages')) || []
    setMessages(JSON.parse(cachedMessages))
  }

  // useEffect hook to set navigation options
  useEffect(() => {
    navigation.setOptions({ title: name })
  }, [])

  /* Render a View component with dynamic background color */
  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userID,
          name: name,
        }}
      />
      {Platform.OS === 'android' ? (
        <KeyboardAvoidingView behavior='height' />
      ) : null}
      {Platform.OS === 'ios' ? (
        <KeyboardAvoidingView behavior='padding' />
      ) : null}
    </View>
  )
}

// Define styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default Chat
