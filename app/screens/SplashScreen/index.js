import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { IcLogo } from '../../assets';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config';
import { getData } from '../../utils';
import { useRole } from '../../utils/roles';
import { CommonActions } from '@react-navigation/native';

const SplashScreen = ({ navigation }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 1) {
          clearInterval(progressInterval);
          getData('token').then(res => {
            if (res) {
              getData('userProfile').then((res) => {
                if (res?.scope?.includes('Admin')) {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 1,
                      routes: [{ name: 'Admin' }],
                    })
                  );
                  // navigation.reset({ index: 4, routes: [{ name: 'Admin' }] });
                } else {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 12,
                      routes: [{ name: 'MainApp' }],
                    })
                  );
                  // navigation.reset({ index: 0, routes: [{ name: 'MainApp' }] });
                }
              });
            } else {
              navigation.replace('SignIn');
            }
          });
          return 1;
        }
        return prevProgress + 0.1;
      });
    }, 100); // Setiap 300ms progress akan bertambah

    return () => clearInterval(progressInterval);
  }, [navigation]);


  return (
    <View style={styles.container}>
      <StatusBar style='light' />
      <Image
        source={IcLogo}
        style={{ width: 300, height: 280 }}
      />
      <View style={{ alignItems: 'center', gap: 8 }}>
        <Text style={styles.text}>Point Of Sales</Text>
        <Text style={styles.subTitle}>Langit Coffee Space</Text>
        <Progress.Bar progress={progress} width={200} color={COLORS.primaryOrangeHex} />
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  progressBar: {
    height: 10,
    marginBottom: 20,
    color: 'white'
  },
  container: {
    backgroundColor: COLORS.primaryBlackHex,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.space_30
  },
  text: { fontSize: FONTSIZE.size_18, color: COLORS.primaryWhiteHex, fontFamily: FONTFAMILY.poppins_light },
  subTitle: { marginBottom: SPACING.space_10, fontSize: FONTSIZE.size_30, color: COLORS.primaryWhiteHex, fontFamily: FONTFAMILY.poppins_medium },
});
