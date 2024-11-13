import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreens from 'expo-splash-screen';
import { useCallback } from 'react';
import { View } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider, useSelector } from 'react-redux';
import Loading from './app/component/Loading';
import store from './app/redux/store';
import Router from './app/router';
import HeaderBar from './app/component/HeaderBar';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
SplashScreens.preventAutoHideAsync();

const MainApp = () => {
  const { isLoading } = useSelector(state => state.globalReducer);
  return (
    <NavigationContainer >
      <Router />
      {isLoading && <Loading />}
      <FlashMessage position="top" style={{ marginTop: 30 }} />
    </NavigationContainer>
  );
}

const App = () => {
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
      await SplashScreens.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Provider store={store}>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <GestureHandlerRootView
          style={{
            flex: 1,
          }}>
          <BottomSheetModalProvider>
            <MainApp />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </View>
    </Provider>
  );
}
export default App;
