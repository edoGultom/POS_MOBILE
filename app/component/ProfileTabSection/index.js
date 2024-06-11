import { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useRef, useState } from 'react';
import { Button, Dimensions, StyleSheet, Text, View } from 'react-native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { BORDERRADIUS, COLORS, SPACING } from '../../config';
import BottomSheetCustom from '../BottomSheet';
import ItemListMenu from '../ItemListMenu';
import AsyncStorage from '@react-native-async-storage/async-storage';

const renderTabBar = (props) => (
  <TabBar
    {...props}
    indicatorStyle={styles.indicator}
    style={styles.tabBarStyle}
    tabStyle={styles.tabStyle}
    renderLabel={({ route, focused }) => (
      <Text style={styles.tabText(focused)}>{route.title}</Text>
    )}
  />
);

const Account = () => {
  const navigation = useNavigation();
  const signOut = () => {
    AsyncStorage.multiRemove(['userProfile', 'token']).then(() => {
      navigation.reset({ index: 1, routes: [{ name: 'SignIn' }] });
    });
  };

  const bottomSheetModalRef = useRef(null);

  const openModal = () => {
    bottomSheetModalRef.current.present();
  };

  const closeModal = () => {
    bottomSheetModalRef.current.dismiss();
  };

  const tabBarHeight = useBottomTabBarHeight();
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  return (
    <>
      <View style={styles.containerAccount}>
        <ItemListMenu
          text="Edit Profile"
          onPress={openModal}
        />
        <ItemListMenu text="SignOut" onPress={signOut} />
      </View>

      {/* BOTTOM SHEET */}
      <BottomSheetCustom
        ref={bottomSheetModalRef}
        backdropComponent={renderBackdrop}
      >
        {/* Render your dynamic content here */}
        <View style={{ marginBottom: tabBarHeight + 5 }}>
          <Text style={[styles.text, { color: 'white' }]}>sdsdsdsdsdsdsdsd</Text>
          <Text style={[styles.text, { color: 'white' }]}>sdsdsdsdsdsdsdsd</Text>
          <Text style={[styles.text, { color: 'white' }]}>sdsdsdsdsdsdsdsd</Text>
          <Text style={[styles.text, { color: 'white' }]}>sdsdsdsdsdsdsdsd</Text>
          <Text style={[styles.text, { color: 'white' }]}>sdsdsdsdsdsdsdsd</Text>
          <Text style={[styles.text, { color: 'white' }]}>sdsdsdsdsdsdsdsd</Text>
          <View style={styles.containerButton}>
            <Button title="Tutup" onPress={closeModal} color={COLORS.primaryLightGreyHex} />
          </View>
        </View>
      </BottomSheetCustom>
    </>
  )
};

const PosApp = () => {
  return (
    <View style={styles.containerPosApp}>
      <ItemListMenu text="Rate App" />
      <ItemListMenu text="Help Center" />
      <ItemListMenu text="Privacy & Policy" />
      <ItemListMenu text="Terms & Conditions" />
    </View>
  );
};

const initialLayout = { width: Dimensions.get('window').width };

const ProfileTabSection = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: '1', title: 'Account' },
    { key: '2', title: 'POS Langit Coffee' },
  ]);
  const renderScene = SceneMap({
    1: Account,
    2: PosApp,
  });
  return (
    <TabView
      renderTabBar={renderTabBar}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      style={styles.tabView}
    />
  )
}

export default ProfileTabSection

const styles = StyleSheet.create({
  containerButton: {
    marginVertical: SPACING.space_15,
    marginLeft: SPACING.space_2,
    marginRight: SPACING.space_2,
    overflow: 'hidden',
    borderRadius: BORDERRADIUS.radius_25,
  },
  tabView: {
    backgroundColor: COLORS.primaryBlackHex,
    position: 'relative'
  },
  indicator: {
    backgroundColor: COLORS.primaryOrangeHex,
    height: 3,
    width: 1,
  },
  tabBarStyle: {
    backgroundColor: COLORS.primaryDarkGreyHex,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomColor: COLORS.primaryLightGreyHex,
    borderBottomWidth: 1,
  },
  tabText: (focused) => ({
    fontFamily: 'Poppins-Medium',
    color: focused ? COLORS.primaryWhiteHex : COLORS.primaryLightGreyHex,
  }),
  tabStyle: { width: 'auto' },
  containerAccount: { paddingTop: 8, paddingHorizontal: 24 },
  containerPosApp: { paddingTop: 8, paddingHorizontal: 24 },
})