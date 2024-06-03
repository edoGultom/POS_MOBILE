import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IlLoading } from '../../assets';
import { BORDERRADIUS, COLORS, FONTFAMILY } from '../../config';

const Loading = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <LottieView
          source={IlLoading}
          style={styles.animation}
          autoPlay
        />
        <Text style={styles.text}>Loading</Text>
      </View>
    </View>
  );
}
export default Loading;

const styles = StyleSheet.create({
  animation: {
    width: 90,
    height: 90,
    marginTop: -25,
  },
  container: {
    position: 'absolute',
    flex: 1,
    backgroundColor: COLORS.secondaryBlackRGBA,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 68,
    height: 68,
    flexDirection: 'column',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primaryWhiteHex,
    borderRadius: BORDERRADIUS.radius_10,
    marginBottom: 0
  },
  text: {
    marginTop: -15,
    fontSize: 14,
    fontFamily: FONTFAMILY.poppins_regular,
  },
});
