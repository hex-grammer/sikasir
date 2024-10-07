import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// If in _layout.tsx or in a separate file like types.ts
export type RootStackParamList = {
  login: undefined;
  'point-of-sale': undefined;
  cart: undefined;
  '(tabs)': undefined;
};

export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    secondary: 'yellow',
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Poppins: require('../assets/fonts/Poppins-Regular.ttf'),
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <Stack>
        {/* Add the Login screen */}
        <Stack.Screen name="login" options={{ headerShown: false }} />

        {/* Point of Sale screen */}
        <Stack.Screen name="point-of-sale" options={{title: "Point of Sale", animation: 'slide_from_right'}} />

        {/* Cart screen */}
        <Stack.Screen name="cart" options={{title: "Cart", animation: 'slide_from_right'}} />
        
        {/* The main tab screens */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
  );
}
