import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import CustomIcon from '../CustomIcon'
import { id } from 'date-fns/locale'
import { format } from 'date-fns'

const ListItemStock = (props) => {
    const { tanggal, kode, tipe, onPressDelete, onPressUpdate } = props;
    return (
        <View>
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={[COLORS.primaryBlackHex, COLORS.primaryGreyHex]}
                style={styles.ItemSingleLinearGradient}>

                <View style={styles.ItemSingleInfoContainer}>
                    <View>
                        <Text style={styles.ItemTitle}>Kode: {kode}</Text>
                        <Text
                            style={[
                                styles.containerType,
                                tipe == 'Masuk'
                                    ? { color: COLORS.primaryOrangeHex }
                                    : { color: COLORS.primaryRedHex },
                            ]}
                        >
                            <Text style={styles.type}>Tipe: </Text>  {tipe}

                        </Text>
                        <Text style={styles.ItemSubtitle}>{format(new Date(tanggal), 'dd-MM-yyyy', { locale: id })}</Text>
                    </View>
                </View>
                <View style={styles.CartItemSingleQuantityContainer}>
                    <TouchableOpacity
                        activeOpacity={0.4}
                        style={styles.CartItemIcon}
                        onPress={onPressUpdate}
                    >
                        <CustomIcon
                            name="view-list"
                            color={COLORS.primaryOrangeHex}
                            size={FONTSIZE.size_20}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.4}
                        style={styles.CartItemIcon}
                        onPress={onPressUpdate}
                    >
                        <CustomIcon
                            name="edit"
                            color={COLORS.primaryOrangeHex}
                            size={FONTSIZE.size_20}
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
                            size={FONTSIZE.size_20}
                        />
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    )
}

export default ListItemStock

const styles = StyleSheet.create({
    CartItemIcon: {
        backgroundColor: COLORS.primaryBlackRGBA,
        padding: SPACING.space_12,
        borderRadius: BORDERRADIUS.radius_10,
    },
    CartItemSingleQuantityContainer: {
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
    ItemSingleImage: {
        height: 50,
        width: 50,
        borderRadius: BORDERRADIUS.radius_8,
    },

    containerType: {
        fontFamily: FONTFAMILY.poppins_light,
        fontSize: FONTSIZE.size_16,
    },

    type: {
        color: COLORS.primaryWhiteHex,
        fontFamily: FONTFAMILY.poppins_light
    },

    ItemSingleInfoContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'space-around',
    },

    ItemTitle: {
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_18,
        color: COLORS.primaryWhiteHex,
    },

    ItemSubtitle: {
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_12,
        color: COLORS.primaryLightGreyHex,
    },
})