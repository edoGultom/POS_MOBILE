// import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Router from './app/router';
import { useFonts } from 'expo-font';
import { useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();

const MainApp = () => {
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Black': require('./app/assets/Fonts/Poppins-Black.ttf'),
    'Poppins-Bold': require('./app/assets/Fonts/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('./app/assets/Fonts/Poppins-ExtraBold.ttf'),
    'Poppins-ExtraLight': require('./app/assets/Fonts/Poppins-ExtraLight.ttf'),
    'Poppins-Light': require('./app/assets/Fonts/Poppins-Light.ttf'),
    'Poppins-Medium': require('./app/assets/Fonts/Poppins-Medium.ttf'),
    'Poppins-Regular': require('./app/assets/Fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('./app/assets/Fonts/Poppins-SemiBold.ttf'),
    'Poppins-Thin': require('./app/assets/Fonts/Poppins-Thin.ttf'),
  });
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <NavigationContainer onLayout={onLayoutRootView}>
      <Router />
    </NavigationContainer>
  );
}

const App = () => {

  return (
    <View style={{ flex: 1 }}>
      <MainApp />
    </View>
  );
}
export default App;
