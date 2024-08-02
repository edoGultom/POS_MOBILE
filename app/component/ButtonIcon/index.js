import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BORDERRADIUS, COLORS, FONTFAMILY, SPACING } from '../../config';
import CustomIcon from '../CustomIcon';

const ButtonIcon = ({ nameIcon, text, sizeIcon, colorIcon, isBackground, onPress }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.4}
            style={[isBackground ? styles.BtnIcon : null]}
            onPress={onPress}
        >
            <View style={[
                {
                    flexDirection: 'row', gap: SPACING.space_2, alignItems: 'center'
                },
            ]}>
                <CustomIcon
                    name={nameIcon}
                    color={colorIcon}
                    size={sizeIcon}
                />
                {text && <Text style={{ color: COLORS.primaryWhiteHex, fontFamily: FONTFAMILY.poppins_semibold }}>{text}</Text>}
            </View>
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
