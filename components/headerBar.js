import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Appbar, Avatar } from 'react-native-paper';

export default function HeaderBar({ title }) {
  const navigation = useNavigation();

  return (
    <Appbar.Header style={{ backgroundColor: '#2E7D32' }}>
      <Appbar.Action
        icon="menu"
        color="white"
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      />
      <Appbar.Content
        title={title}
        titleStyle={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}
      />
      <Avatar.Image
        size={36}
        source={{ uri: 'https://i.pravatar.cc/150' }}
        style={{ marginRight: 10 }}
      />
    </Appbar.Header>
  );
}
