import { createContext } from 'react';

type VisibleCameraContextValue = {
  visibleCamera: boolean | null;
  setVisibleCamera: (visibleCamera: boolean | null) => void;
};

export const VisibleCameraContext = createContext<VisibleCameraContextValue>({
  visibleCamera: false,
  setVisibleCamera: () => {
    // 何もしない
  },
});
