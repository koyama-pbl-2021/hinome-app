import { createContext } from 'react';
import { Album } from '../types/album';

type AlbumsContextValue = {
  albums: Album[];
  setAlbums: (albums: Album[]) => void;
};

export const AlbumsContext = createContext<AlbumsContextValue>({
  albums: [],
  setAlbums: () => {
    // 何もしない
  },
});
