import React, { useState, useEffect } from 'react';
import { View, Image, Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { publicRequest } from '../data/requestMethod'; 
import LoadingScreen from './LoadingScreen';
import { useDispatch } from 'react-redux';
import { updateUserInfo } from '../redux/userRedux';

const ImageUploadScreen = ({ route }) => {
  const userId  = route.params;

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Sorry, we need camera roll permissions to make this work.');
        }
      }
    })();
  }, []);  

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    } else {
      Alert.alert('Image selection cancelled or URI undefined.');
    }
  };

  const uploadImage = async () => {
    if (!image) {
      Alert.alert('Please select an image before uploading.');
      return;
    }

    const formData = new FormData();
    formData.append('file', {
      uri: image,
      type: 'image/jpeg',
      name: 'user_image.jpg',
    });

    try {
      const response = await publicRequest.post(`/upload/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = response.data;

      if (data.success) {
        Alert.alert('Success', 'Image uploaded successfully');
        setImage(null);
        dispatch(updateUserInfo(data.user));
      } else {
        Alert.alert('Error', 'Failed to upload image');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while uploading image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View>
      {uploading ? (
        <LoadingScreen />
      ) : (
        <>
        <Button title="Pick an image from gallery" onPress={pickImage} />
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        {image && <Button title="Upload Image" onPress={uploadImage} />}
        </>
      )}
    </View>
  );
};

export default ImageUploadScreen;
