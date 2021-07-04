import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
/* components */
import { AlbumItem } from '../components/AlbumItem';
/* lib */
import { getAlbums } from '../lib/firebase';
/* types */
import { Album } from '../types/album';
import { RootStackParamList } from '../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

export const HomeScreen: React.FC<Props> = ({ navigation }: Props) => {
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    getFirebaseItems();
  }, []);

  const getFirebaseItems = async () => {
    const albums = await getAlbums();
    setAlbums(albums);
  };

  const onPressAlbum = (album: Album) => {
    navigation.navigate('Album', { album });
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
          data={albums}
          renderItem={({ item }: { item: Album }) => (
            <AlbumItem album={item} onPress={() => onPressAlbum(item)} />
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
