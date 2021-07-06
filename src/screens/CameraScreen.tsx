import React, { useContext, useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import firebase from 'firebase';
import { Camera } from 'expo-camera';
/* lib */
import { upLoadImg, createPhotoRef } from '../lib/firebase';
/* components */
import { Timer } from '../components/Timer';
/* contexts */
import { UserContext } from '../contexts/UserContext';
import { AlbumContext } from '../contexts/AlbumContext';
/* types */
import { Photo } from '../types/photo';
/* utils */
import { getExetention } from '../utils/file';

export const CameraScreen: React.FC = () => {
  const cameraRef = useRef(null);
  // Contextからalbumオブジェクトを取得
  const { album } = useContext(AlbumContext);
  const { user } = useContext(UserContext);
  const [hasPermission, setHasPermission] = useState(null);
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

  const snap = async () => {
    if (cameraRef) {
      // 現状albumがnullになる場合がある。通知からであればnullになることない
      const photoDocRef = await createPhotoRef(album.id);
      const { uri } = await cameraRef.current.takePictureAsync();
      const ext = getExetention(uri);
      const storagePath = `users/${user.id}/${album.id}/${photoDocRef.id}.${ext}`;
      const downloadUrl = await upLoadImg(uri, storagePath);
      const photo = {
        id: photoDocRef.id,
        place: 'matsudo',
        imageUrl: downloadUrl,
        createdAt: firebase.firestore.Timestamp.now(),
      } as Photo;
      await photoDocRef.set(photo);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Camera ref={cameraRef} style={styles.camera} type={type}>
          <Timer onFinish={snap} />
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
