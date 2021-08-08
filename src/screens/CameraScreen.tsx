import React, { useContext, useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import firebase from 'firebase';
import { Camera } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
/* lib */
import { upLoadImg, createPhotoRef, getAlbumRef } from '../lib/firebase';
/* components */
import { Timer } from '../components/Timer';
/* contexts */
import { UserContext } from '../contexts/UserContext';
import { AlbumContext } from '../contexts/AlbumContext';
/* types */
import { Photo } from '../types/photo';
import { RootStackParamList } from '../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
/* utils */
import { getExetention } from '../utils/file';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Camera'>;
};

export const CameraScreen: React.FC<Props> = ({ navigation }: Props) => {
  const cameraRef = useRef(null);
  // Contextからalbumオブジェクトを取得
  const { album, setAlbum } = useContext(AlbumContext);
  const { user } = useContext(UserContext);
  const [hasPermission, setHasPermission] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const updateAlbum = async (
    userId: string,
    albumId: string,
    imageUrl: string
  ) => {
    const albumRef = await getAlbumRef(userId, albumId);
    await albumRef.update({
      imageUrl: imageUrl,
    });
  };

  const snap = async () => {
    if (cameraRef) {
      // 現状albumがnullになる場合がある。通知からであればnullになることない
      const photoDocRef = await createPhotoRef(album.id, user.id);
      const { uri } = await cameraRef.current.takePictureAsync();
      const ext = getExetention(uri);
      const storagePath = `users/${user.id}/${album.id}/${photoDocRef.id}.${ext}`;
      const downloadUrl = await upLoadImg(uri, storagePath);
      const photo = {
        id: photoDocRef.id,
        place: '',
        imageUrl: downloadUrl,
        createdAt: firebase.firestore.Timestamp.now(),
      } as Photo;
      await photoDocRef.set(photo);
      await updateAlbum(user.id, album.id, downloadUrl);
      // 即時更新のため
      album.imageUrl = downloadUrl;
      setAlbum(album);
      navigation.navigate('Hinome');
    }
  };
  return (
    <View style={styles.container}>
      <Camera ref={cameraRef} style={styles.camera} type={type}>
        <Timer onFinish={snap} />
        <View style={styles.shutter}>
          <MaterialCommunityIcons
            name="circle-slice-8"
            size={80}
            color="white"
            onPress={snap}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
        >
          <Text style={styles.text}> Flip </Text>
        </TouchableOpacity>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  shutter: { alignItems: 'center' },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});
