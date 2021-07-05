import { createContext } from 'react';
import { Album } from '../types/album';

type AlbumContextValue = {
  album: Album | null;
  setAlbum: (album: Album | null) => void;
};

export const AlbumContext = createContext<AlbumContextValue>({
  album: null,
  setAlbum: () => {
    // 何もしない
  },
});
