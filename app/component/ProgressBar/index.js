// ProgressBar.js
import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

const ProgressBar = ({ progress }) => {
    return (
        <View style={styles.container}>
            <Svg height="10" width="200">
                <Rect
                    x="0"
                    y="0"
                    width={200 * progress}
                    height="10"
                    fill="blue"
                />
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ProgressBar;