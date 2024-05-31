import { StyleSheet, Text, View, Dimensions, Modal, TouchableOpacity } from 'react-native'
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import ItemListMenu from '../ItemListMenu';
import { COLORS, FONTSIZE, SPACING } from '../../config';
import CustomIcon from '../CustomIcon';
import ModalCustom from '../Modal';
import TextInput from '../TextInput';

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
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const signOut = () => {
    AsyncStorage.multiRemove(['userProfile', 'token']).then(() => {
      navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] });
    });
  };
  return (
    <View style={styles.containerAccount}>
      <ItemListMenu
        text="Edit Profile"
        // onPress={() => navigation.navigate('EditProfile')}
        onPress={toggleModal}
      />
      <ItemListMenu text="SignOut" onPress={signOut} />
      <ModalCustom visible={modalVisible} onClose={toggleModal}>
        <TextInput
          label="Full Name"
          placeholder="Type your full name"
          value={inputValue}
          onChangeText={setInputValue}
        />
      </ModalCustom>
    </View >
  );
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
  tabView: {
    backgroundColor: COLORS.primaryBlackHex,
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