import { createContext } from 'react';
import { Album } from '../types/album';

type ViewAlbumContextValue = {
  album: Album | null;
  setViewAlbum: (album: Album | null) => void;
};

export const ViewAlbumContext = createContext<ViewAlbumContextValue>({
  album: null,
  setViewAlbum: () => {
    // 何もしない
  },
});
