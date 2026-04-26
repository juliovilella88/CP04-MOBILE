import { Stack } from 'expo-router';
import { View } from 'react-native';
import '../i18n';

export default function Layout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
