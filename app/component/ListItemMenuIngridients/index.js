import { BE_API_HOST } from '@env'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useCallback, useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import { TouchableOpacity } from 'react-native-gesture-handler'
import CustomIcon from '../CustomIcon'
import ButtonIcon from '../ButtonIcon'

const ListItemMenuIngridients = (props) => {
    const [photo, setPhoto] = useState(null);
    const { menu, url, list_bahan_baku, onPressUpdate, onPressDelete, onPressAdd } = props;

    useEffect(() => {
        const fetchData = () => {
            setPhoto(`${BE_API_HOST}/lihat-file/profile?path=${url}`);
        }
        fetchData();
        return () => setPhoto(null);
    }, [url]);

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
                        <Text style={styles.ItemTitle}>{menu}</Text>
                        <View style={{ flex: 1, flexDirection: 'column', gap: SPACING.space_2 }}>
                            {list_bahan_baku.length > 0 ? list_bahan_baku.map((item, idx) => (
                                <View key={item.id} style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity
                                        style={{ flexDirection: 'row' }}
                                        activeOpacity={0.4}
                                        onPress={() => onPressUpdate(item.id)}
                                    >
                                        <Text style={styles.ItemValue}>{item.bahan_baku}</Text>
                                        <Text style={styles.ItemUnit}>
                                            {` ${item.quantity}`} <Text style={styles.UnitValue}>{item.unit}</Text>
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={{ marginLeft: SPACING.space_8 }}>
                                        <ButtonIcon
                                            nameIcon='close'
                                            sizeIcon={FONTSIZE.size_20}
                                            colorIcon={COLORS.primaryRedHex}
                                            isBackground={false}
                                            onPress={() => onPressDelete(item.id)}
                                        />
                                    </View>
                                </View>
                            )) :
                                <Text style={{ color: COLORS.secondaryLightGreyHex, fontSize: FONTSIZE.size_12, fontFamily: FONTFAMILY.poppins_light }}>Belum ada bahan</Text>
                            }
                        </View>
                    </View>
                </View>
                <View style={styles.CartItemSingleQuantityContainer}>
                    <ButtonIcon
                        nameIcon='assignment-add'
                        sizeIcon={FONTSIZE.size_18}
                        colorIcon={COLORS.primaryOrangeHex}
                        isBackground={true}
                        onPress={onPressAdd}
                    />
                </View>
            </LinearGradient >
        </View >
    )
}

export default ListItemMenuIngridients

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

    ItemUnit: {
        fontFamily: FONTFAMILY.poppins_light,
        fontSize: FONTSIZE.size_16,
        color: COLORS.primaryOrangeHex,
        textDecorationLine: 'underline',
    },
    ItemBahanTitle: {
        color: COLORS.primaryWhiteHex,
    },
    ItemValue: {
        color: COLORS.primaryWhiteHex,
        fontSize: FONTSIZE.size_16,
        fontFamily: FONTFAMILY.poppins_light,
        textDecorationLine: 'underline',
    },
    UnitValue: {
        color: COLORS.primaryOrangeHex,
    },

    ItemSingleInfoContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'space-around',
    },

    ItemTitle: {
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_20,
        color: COLORS.primaryOrangeHex,
    },

    ItemSubtitle: {
        fontFamily: FONTFAMILY.poppins_regular,
        fontSize: FONTSIZE.size_12,
        color: COLORS.secondaryLightGreyHex,
    },
})