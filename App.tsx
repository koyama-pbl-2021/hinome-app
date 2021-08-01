import React, { useState } from 'react';
/* navigators */
import { AppNavigator } from './src/navigation/AppNavigator';
/* contexts */
import { UserContext } from './src/contexts/UserContext';
import { AlbumContext } from './src/contexts/AlbumContext';
import { AlbumsContext } from './src/contexts/AlbumsContext';
import { VisibleWalkthroughContext } from './src/contexts/VisibleWalkthroughContext';
/* types */
import { User } from './src/types/user';
import { Album } from './src/types/album';

export default function App() {
  const [user, setUser] = useState<User>();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [album, setAlbum] = useState<Album>();
  const [visibleWalkthrough, setVisibleWalkthrough] = useState<boolean>();

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <AlbumsContext.Provider value={{ albums, setAlbums }}>
        <AlbumContext.Provider value={{ album, setAlbum }}>
          <VisibleWalkthroughContext.Provider
            value={{ visibleWalkthrough, setVisibleWalkthrough }}
          >
            <AppNavigator />
          </VisibleWalkthroughContext.Provider>
        </AlbumContext.Provider>
      </AlbumsContext.Provider>
    </UserContext.Provider>
  );
}
