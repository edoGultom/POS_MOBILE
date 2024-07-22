import { BE_API_HOST } from '@env'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useCallback, useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import { TouchableOpacity } from 'react-native-gesture-handler'
import CustomIcon from '../CustomIcon'

const ListItemTable = (props) => {
    const { id, name, onPressDelete, onPressUpdate } = props;

    return (
        <View>
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={[COLORS.primaryBlackHex, COLORS.primaryGreyHex]}
                style={styles.ItemSingleLinearGradient}>
                <View style={styles.ItemSingleInfoContainer}>
                    <View>
                        <Text style={styles.nameItem}>
                            {name}
                        </Text>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        activeOpacity={0.4}
                        style={styles.CartItemIcon}
                        onPress={onPressUpdate}
                    >
                        <CustomIcon
                            name="edit"
                            color={COLORS.primaryOrangeHex}
                            size={FONTSIZE.size_18}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.4}
                        style={styles.CartItemIcon}
                        onPress={onPressDelete}
                    >
                        <CustomIcon
                            name="delete-forever"
                            color={COLORS.primaryRedHex}
                            size={FONTSIZE.size_18}
                        />
                    </TouchableOpacity>

                </View>
            </LinearGradient>
        </View>
    )
}

export default ListItemTable

const styles = StyleSheet.create({
    CartItemIcon: {
        backgroundColor: COLORS.primaryBlackRGBA,
        padding: SPACING.space_12,
        borderRadius: BORDERRADIUS.radius_10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        gap: SPACING.space_10
    },
    ItemSingleLinearGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.space_12,
        gap: SPACING.space_12,
        borderRadius: BORDERRADIUS.radius_25,
        marginHorizontal: SPACING.space_15,
        marginVertical: SPACING.space_10
    },

    nameItem: {
        fontFamily: FONTFAMILY.poppins_semibold,
        fontSize: FONTSIZE.size_18,
        color: COLORS.primaryOrangeHex,
    },

    ItemSingleInfoContainer: {
        flex: 1,
        justifyContent: 'center'
    },

    ItemTitle: {
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_18,
        color: COLORS.primaryWhiteHex,
    },

    ItemSubtitle: {
        fontFamily: FONTFAMILY.poppins_regular,
        fontSize: FONTSIZE.size_12,
        color: COLORS.secondaryLightGreyHex,
    },
})