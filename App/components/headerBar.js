import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Appbar, Avatar } from 'react-native-paper';

export default function HeaderBar({ title, onBack }) {
  const navigation = useNavigation();

  return (
    <Appbar.Header style={{ backgroundColor: '#2E7D32' }}>
      {/* Back Button - Only shows if onBack is passed */}
      {onBack && (
        <Appbar.Action
          icon={() => <Ionicons name="arrow-back" size={24} color="white" />}
          onPress={onBack}
        />
      )}

      {/* Menu Button */}
      {!onBack && (
        <Appbar.Action
          icon="menu"
          color="white"
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        />
      )}

      {/* Title */}
      <Appbar.Content
        title={title}
        titleStyle={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}
      />

      {/* Avatar */}
      <Avatar.Image
        size={36}
        source={{ uri: 'https://i.pravatar.cc/150' }}
        style={{ marginRight: 10 }}
      />
    </Appbar.Header>
  );
}
