import React, { useState } from 'react';
import AppLoading from 'expo-app-loading';
/* navigators */
import { AppNavigator } from './src/navigation/AppNavigator';
/* contexts */
import { AlbumContext } from './src/contexts/AlbumContext';
import { UserContext } from './src/contexts/UserContext';
import { GroupContext } from './src/contexts/GroupContext';
import { AlbumsContext } from './src/contexts/AlbumsContext';
import { CountContext } from './src/contexts/CountContext';
import { VisibleWalkthroughContext } from './src/contexts/VisibleWalkthroughContext';
import { VisibleCameraContext } from './src/contexts/VisibleCameraContext';
import { IsSingleContext } from './src/contexts/IsSingleContext';
/* types */
import { User } from './src/types/user';
import { Group } from './src/types/group';
import { Album } from './src/types/album';
/* font */
import { useFonts, MPLUS1p_400Regular } from '@expo-google-fonts/m-plus-1p';

export default function App() {
  const [user, setUser] = useState<User>();
  const [group, setGroup] = useState<Group>();
  const [count, setCount] = useState<number>();
  const [album, setAlbum] = useState<Album>();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [visibleWalkthrough, setVisibleWalkthrough] = useState<boolean>();
  const [visibleCamera, setVisibleCamera] = useState<boolean>();
  const [isSingle, setIsSingle] = useState<boolean>();
  let [fontsLoaded] = useFonts({
    MPLUS1p_400Regular,
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <GroupContext.Provider value={{ group, setGroup }}>
        <AlbumsContext.Provider value={{ albums, setAlbums }}>
          <AlbumContext.Provider value={{ album, setAlbum }}>
            <VisibleWalkthroughContext.Provider
              value={{ visibleWalkthrough, setVisibleWalkthrough }}
            >
              <VisibleCameraContext.Provider
                value={{ visibleCamera, setVisibleCamera }}
              >
                <CountContext.Provider value={{ count, setCount }}>
                  <IsSingleContext.Provider value={{ isSingle, setIsSingle }}>
                    {!fontsLoaded ? <AppLoading /> : <AppNavigator />}
                  </IsSingleContext.Provider>
                </CountContext.Provider>
              </VisibleCameraContext.Provider>
            </VisibleWalkthroughContext.Provider>
          </AlbumContext.Provider>
        </AlbumsContext.Provider>
      </GroupContext.Provider>
    </UserContext.Provider>
  );
}
