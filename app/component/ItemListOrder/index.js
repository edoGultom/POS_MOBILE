import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { COLORS, FONTFAMILY, FONTSIZE } from '../../config';
import { BE_API_HOST } from '@env'

const ItemListOrder = ({ image, name, onPress, qty, temperatur, price, priceExtra, type }) => {
    const [photo, setPhoto] = useState(null);
    useEffect(() => {
        const fetchData = () => {
            setPhoto(`${BE_API_HOST}/lihat-file/profile?path=${image}`);
        }
        fetchData();
        return () => setPhoto(null);
    }, [image]);
    const renderContent = () => {
        switch (type) {
            case 'order_summary':
                //item order summary
                return (
                    <>
                        <View style={styles.content}>
                            <Text style={styles.title}>{name}</Text>
                            <Text style={styles.SizeCurrency}>

                                IDR <Text style={styles.SizePrice}>{price.toLocaleString('id-ID')}</Text>
                            </Text>
                            <Text style={styles.temperatur}>
                                {priceExtra > 0 && (
                                    <Text>+IDR {priceExtra.toLocaleString('id-ID')} {` `}</Text>
                                )}
                                {temperatur}
                            </Text>
                        </View>
                        <Text style={styles.items}>{qty} items</Text>
                    </>
                );
            default:
                //item pruduct
                return (
                    // fragment karena return hanya boleh mereturn 1 induk (tidak boleh nesting)
                    <>
                        <View style={styles.content}>
                            <Text style={styles.title}>{name}</Text>
                            IDR. 0
                        </View>
                        <Rate />
                    </>
                );
        }
    }

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                {
                    backgroundColor: pressed
                        ? COLORS.primaryOrangeHex
                        : COLORS.primaryBlackRGBA
                },
                {
                    opacity: pressed
                        ? 0.7
                        : 1
                },
                styles.wrapperCustom

            ]}

        >
            <View style={styles.container}>
                <Image source={{ uri: photo }} style={styles.image} />
                {renderContent()}
            </View>
        </Pressable>
    )
}

export default ItemListOrder

const styles = StyleSheet.create({
    SizeCurrency: {
        fontFamily: FONTFAMILY.poppins_regular,
        fontSize: FONTSIZE.size_12 + 1,
        color: COLORS.secondaryLightGreyHex,
    },
    SizePrice: {
        fontSize: 13,
        color: COLORS.secondaryLightGreyHex,
        fontFamily: FONTFAMILY.poppins_regular,
    },
    temperatur: {
        fontSize: 13,
        color: COLORS.primaryLightGreyHex,
        fontFamily: FONTFAMILY.poppins_regular,
    },
    wrapperCustom: {
        borderRadius: 8,
        padding: 6
    },
    container: {
        flexDirection: 'row',
        paddingVertical: 8,
        alignItems: 'center',
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 8,
        overflow: 'hidden',
        marginRight: 12
    },
    content: {
        flex: 1
    },
    title: {
        fontSize: 16,
        fontFamily: FONTFAMILY.poppins_regular,
        color: COLORS.secondaryLightGreyHex
    },
    items: {
        fontSize: 13,
        fontFamily: FONTFAMILY.poppins_regular,
        color: COLORS.secondaryLightGreyHex
    },
    date: {
        fontFamily: "Poppins-Regular",
        fontSize: 10,
        color: '#8D92A3'
    },
    status: (status) => ({
        fontSize: 10,
        fontFamily: "Poppins-Regular",
        color: status === 'CANCELLED' ? '#D9435E' : '#1ABC9C'
    }),
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 3,
        backgroundColor: '#8D92A3',
        marginHorizontal: 4
    }
})