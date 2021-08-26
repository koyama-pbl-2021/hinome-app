import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export const GarbageButton: React.FC = () => {
  return (
    <TouchableOpacity>
      <MaterialIcons name="delete" size={24} color="black" />
    </TouchableOpacity>
  );
};
