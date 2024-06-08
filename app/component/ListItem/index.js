import { BE_API_HOST } from '@env'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useCallback, useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import { TouchableOpacity } from 'react-native-gesture-handler'
import CustomIcon from '../CustomIcon'

const ListItem = (props) => {
    const [photo, setPhoto] = useState(null);
    const { name, url, kind, price, onPressDelete, onPressUpdate } = props;
    const fetchData = useCallback(async () => {
        setPhoto(`${BE_API_HOST}/lihat-file/profile?path=${url}`);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const Item = ({ imageUrl }) => (
        <Image source={{ uri: photo }} style={styles.ItemSingleImage} />
    );
    return (
        <View>
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={[COLORS.primaryBlackHex, COLORS.primaryGreyHex]}
                style={styles.ItemSingleLinearGradient}>
                <View>
                    <Image source={{ uri: photo }} style={styles.ItemSingleImage} />
                </View>
                <View style={styles.ItemSingleInfoContainer}>
                    <View>
                        <Text style={styles.ItemTitle}>{name}</Text>
                        <Text style={styles.ItemSubtitle}>{kind}</Text>
                        <Text style={styles.SizeCurrency}>
                            IDR <Text style={styles.SizePrice}>{price.toLocaleString('id-ID')}</Text>
                        </Text>
                    </View>
                </View>
                <View style={styles.CartItemSingleQuantityContainer}>
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
                            name="trash-can"
                            color={COLORS.primaryRedHex}
                            size={FONTSIZE.size_18}
                        />
                    </TouchableOpacity>

                </View>
            </LinearGradient>
        </View>
    )
}

export default ListItem

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

    SizeCurrency: {
        fontFamily: FONTFAMILY.poppins_semibold,
        fontSize: FONTSIZE.size_18,
        color: COLORS.primaryOrangeHex,
    },

    SizePrice: {
        color: COLORS.primaryWhiteHex,
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
        fontFamily: FONTFAMILY.poppins_regular,
        fontSize: FONTSIZE.size_12,
        color: COLORS.secondaryLightGreyHex,
    },
})