import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { BORDERRADIUS, COLORS, SPACING } from '../../config';
import CustomIcon from '../CustomIcon';

const ButtonIcon = ({ nameIcon, sizeIcon, colorIcon, isBackground, onPress }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.4}
            style={[isBackground ? styles.BtnIcon : null]}
            onPress={onPress}
        >
            <CustomIcon
                name={nameIcon}
                color={colorIcon}
                size={sizeIcon}
            />
        </TouchableOpacity>
    );
};

export default ButtonIcon;

const styles = StyleSheet.create({
    BtnIcon: {
        backgroundColor: COLORS.primaryBlackRGBA,
        padding: SPACING.space_12,
        borderRadius: BORDERRADIUS.radius_10,
    },
});
