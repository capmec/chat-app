// Import necessary modules and components from libraries
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useActionSheet } from '@expo/react-native-action-sheet'

// CustomActions component definition
const CustomActions = ({
  wrapperStyle,
  iconTextStyle,
  onSend,
  storage,
  userID,
}) => {
  // Function to generate a unique reference for the uploaded image
  const generateReference = (uri) => {
    const timeStamp = new Date().getTime()
    const imageName = uri.split('/')[uri.split('/').length - 1]
    return `${userID}-${timeStamp}-${imageName}`
  }

  // Function to upload image and send its URL
  const uploadAndSendImage = async (imageURI) => {
    const uniqueRefString = generateReference(imageURI)
    const newUploadRef = ref(storage, uniqueRefString)
    const response = await fetch(imageURI)
    const blob = await response.blob()
    uploadBytes(newUploadRef, blob).then(async (snapshot) => {
      const imageURL = await getDownloadURL(snapshot.ref)
      onSend({ image: imageURL })
    })
  }

  // Function to pick an image from the device's library
  const pickImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync()
      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri)
      else Alert.alert("Permissions haven't been granted.")
    }
  }

  // Function to take a photo using the device's camera
  const takePhoto = async () => {
    let permissions = await ImagePicker.requestCameraPermissionsAsync()
    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync()
      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri)
      else Alert.alert("Permissions haven't been granted.")
    }
  }

  // Function to get the current device location
  const getLocation = async () => {
    let permissions = await Location.requestForegroundPermissionsAsync()
    if (permissions?.granted) {
      const location = await Location.getCurrentPositionAsync({})
      if (location) {
        onSend({
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          },
        })
      } else Alert.alert('Error occurred while fetching location')
    } else Alert.alert("Permissions haven't been granted.")
  }

  // Hook to use the action sheet for presenting options
  const actionSheet = useActionSheet()

  // Function to handle action press from the action sheet
  const onActionPress = () => {
    const options = [
      'Choose From Library',
      'Take Picture',
      'Send Location',
      'Cancel',
    ]
    const cancelButtonIndex = options.length - 1
    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImage()
            return
          case 1:
            takePhoto()
            return
          case 2:
            getLocation()
          default:
        }
      }
    )
  }

  // Render component
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onActionPress}
      accessible={true}
      accessibilityLabel='This is an input field with a clickable icon that expands a menu'
      accessibilityHint='Choose what type of media you want to share or cancel to collapse menu'
      accessibilityRole='button'
    >
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  )
}

// Styles for the CustomActions component
const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 14,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
})

// Export the CustomActions component
export default CustomActions
