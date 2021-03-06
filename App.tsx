import React, { useState } from 'react';
import AppLoading from 'expo-app-loading';
/* navigators */
import { AppNavigator } from './src/navigation/AppNavigator';
/* contexts */
import { AlbumContext } from './src/contexts/AlbumContext';
import { UserContext } from './src/contexts/UserContext';
import { AlbumsContext } from './src/contexts/AlbumsContext';
import { CountContext } from './src/contexts/CountContext';
import { VisibleWalkthroughContext } from './src/contexts/VisibleWalkthroughContext';
import { VisibleCameraContext } from './src/contexts/VisibleCameraContext';
/* types */
import { User } from './src/types/user';
import { Album } from './src/types/album';
/* font */
import { useFonts, MPLUS1p_400Regular } from '@expo-google-fonts/m-plus-1p';

export default function App() {
  const [user, setUser] = useState<User>();
  const [count, setCount] = useState<number>();
  const [album, setAlbum] = useState<Album>();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [visibleWalkthrough, setVisibleWalkthrough] = useState<boolean>();
  const [visibleCamera, setVisibleCamera] = useState<boolean>();
  let [fontsLoaded] = useFonts({
    MPLUS1p_400Regular,
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <AlbumsContext.Provider value={{ albums, setAlbums }}>
        <AlbumContext.Provider value={{ album, setAlbum }}>
          <VisibleWalkthroughContext.Provider
            value={{ visibleWalkthrough, setVisibleWalkthrough }}
          >
            <VisibleCameraContext.Provider
              value={{ visibleCamera, setVisibleCamera }}
            >
              <CountContext.Provider value={{ count, setCount }}>
                {!fontsLoaded ? <AppLoading /> : <AppNavigator />}
              </CountContext.Provider>
            </VisibleCameraContext.Provider>
          </VisibleWalkthroughContext.Provider>
        </AlbumContext.Provider>
      </AlbumsContext.Provider>
    </UserContext.Provider>
  );
}
