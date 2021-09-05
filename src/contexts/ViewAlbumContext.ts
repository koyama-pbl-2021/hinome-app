import { createContext } from 'react';
import { Album } from '../types/album';

type ViewAlbumContextValue = {
  viewAlbum: Album | null;
  setViewAlbum: (album: Album | null) => void;
};

export const ViewAlbumContext = createContext<ViewAlbumContextValue>({
  viewAlbum: null,
  setViewAlbum: () => {
    // 何もしない
  },
});
