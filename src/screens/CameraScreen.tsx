import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import firebase from 'firebase';
import { Camera } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
/* lib */
import { upLoadImg, createPhotoRef, getAlbumRef } from '../lib/firebase';
/* components */
import { Timer } from '../components/Timer';
import { Loading } from '../components/Loading';
/* contexts */
import { UserContext } from '../contexts/UserContext';
import { AlbumContext } from '../contexts/AlbumContext';
import { VisibleCameraContext } from '../contexts/VisibleCameraContext';
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
  const { setVisibleCamera } = useContext(VisibleCameraContext);
  const { user } = useContext(UserContext);
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    requestPermissionsAsync();
  }, []);

  const requestPermissionsAsync = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    // 許可されればPermissionにgrantedを設定
    setHasPermission(status === 'granted');
  };

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
      setLoading(true);
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
      setVisibleCamera(false);
      setLoading(false);
      navigation.pop();
      // [TODO] delete notigicationの処理を追加
    }
  };

  return (
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
        style={styles.flipButton}
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
      <Loading visible={loading} />
    </Camera>
  );
};

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  shutter: { alignItems: 'center' },
  bottomWrapper: {
    position: 'absolute',
    bottom: 70,
    alignItems: 'center',
  },
  button: {
    marginTop: 18,
  },
  flipButton: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 19,
    color: '#fff',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});
