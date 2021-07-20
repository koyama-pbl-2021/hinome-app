import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
/* components */
import { PhotoItem } from '../components/PhotoItem';
/* contexts */
import { UserContext } from '../contexts/UserContext';
/* lib */
import { getPhotos } from '../lib/firebase';
/* types */
import { Photo } from '../types/photo';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Album'>;
  route: RouteProp<RootStackParamList, 'Album'>;
};

export const AlbumScreen: React.FC<Props> = ({ navigation, route }: Props) => {
  const { album } = route.params;
  const [photos, setPhotos] = useState<Photo[]>([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    getFirebaseItems();
  }, []);

  const getFirebaseItems = async () => {
    const photos = await getPhotos(album.id, user.id);
    setPhotos(photos);
  };

  const onPressPhoto = (photo: Photo) => {
    // 画像を表示する処理
  };

  return (
    <LinearGradient
      start={{
        x: 0.31,
        y: 1.1,
      }}
      end={{
        x: 0.69,
        y: -0.1,
      }}
      locations={[0, 1]}
      colors={['rgb(247, 132, 98)', 'rgb(139, 27, 140)']}
      style={styles.loginViewLinearGradient}
    >
      <SafeAreaView>
        <FlatList
          data={photos}
          renderItem={({ item }: { item: Photo }) => (
            <PhotoItem photo={item} onPress={() => onPressPhoto(item)} />
          )}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  loginViewLinearGradient: {
    flex: 1,
  },
  welcomeBackText: {
    color: 'white',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
    backgroundColor: 'transparent',
    marginTop: 20,
  },
});
