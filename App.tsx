import React, { useState } from 'react';
/* navigators */
import { AppNavigator } from './src/navigation/AppNavigator';
/* contexts */
import { UserContext } from './src/contexts/UserContext';
import { AlbumContext } from './src/contexts/AlbumContext';
import { AlbumsContext } from './src/contexts/AlbumsContext';
/* types */
import { User } from './src/types/user';
import { Album } from './src/types/album';

export default function App() {
  const [user, setUser] = useState<User>();
  // 正直Albumは一番上に持ってくる必要がないと思うので要議論
  const [albums, setAlbums] = useState<Album[]>([]);
  const [album, setAlbum] = useState<Album>();

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <AlbumsContext.Provider value={{ albums, setAlbums }}>
        <AlbumContext.Provider value={{ album, setAlbum }}>
          <AppNavigator />
        </AlbumContext.Provider>
      </AlbumsContext.Provider>
    </UserContext.Provider>
  );
}
