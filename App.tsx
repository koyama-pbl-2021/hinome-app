import React, { useState } from 'react';
/* navigators */
import { AppNavigator } from './src/navigation/AppNavigator';
/* contexts */
import { UserContext } from './src/contexts/UserContext';
/* types */
import { User } from './src/types/user';

export default function App() {
  const [user, setUser] = useState<User>();

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <AppNavigator />
    </UserContext.Provider>
  );
}
