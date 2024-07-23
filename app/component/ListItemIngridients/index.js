import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import CustomIcon from '../CustomIcon'

const ListItemIngridients = (props) => {
    const { name, unit, onPressDelete, onPressUpdate } = props;
    return (
        <View>
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={[COLORS.primaryBlackHex, COLORS.primaryGreyHex]}
                style={styles.ItemSingleLinearGradient}>
                <View style={styles.ItemSingleInfoContainer}>
                    <View>
                        <Text style={styles.ItemTitle}>{name}</Text>
                        <Text style={styles.SizeCurrency}>
                            {unit}
                        </Text>
                    </View>
                </View>
                <View style={styles.ButtonContainer}>
                    <TouchableOpacity
                        activeOpacity={0.4}
                        style={styles.ButtonIcon}
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
                        style={styles.ButtonIcon}
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

export default ListItemIngridients

const styles = StyleSheet.create({
    ButtonIcon: {
        backgroundColor: COLORS.primaryBlackRGBA,
        padding: SPACING.space_12,
        borderRadius: BORDERRADIUS.radius_10,
    },
    ButtonContainer: {
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
    SizeCurrency: {
        fontSize: FONTSIZE.size_12,
        fontFamily: FONTFAMILY.poppins_semibold,
        color: COLORS.primaryOrangeHex,
    },
    ItemSingleInfoContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'space-around',
    },
    ItemTitle: {
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_18,
        color: COLORS.secondaryLightGreyHex,
    },
})