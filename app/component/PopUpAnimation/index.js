import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';
import { COLORS } from '../../config';

const PopUpAnimation = ({ style, source }) => {
    return (
        <View style={styles.LottieAnimationContainer}>
            <LottieView style={style} source={source} autoPlay loop={true} />
        </View>
    )
}

export default PopUpAnimation

const styles = StyleSheet.create({
    LottieAnimationContainer: {
        flex: 1,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: COLORS.secondaryBlackRGBA,
        justifyContent: 'center',
    },

})