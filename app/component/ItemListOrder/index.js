import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config';
import { BE_API_HOST } from '@env'
import IcTableActive from '../../assets/Icon/IcTableActive';
import CustomIcon from '../CustomIcon';

const ItemListOrder = ({ image, name, onPress, qty, temperatur, price, priceExtra, type, id, bahanBaku, status, onProcess }) => {
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
            case 'chef_detail_order':
                return (
                    <>
                        <View style={styles.content}>
                            <Text style={styles.title}>{name}</Text>
                            <Text style={styles.temperatur}>
                                {temperatur}
                            </Text>
                            <Text style={{ color: COLORS.secondaryLightGreyHex }}>Bahan :</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {bahanBaku.length > 0 && bahanBaku.map((bahan, idx) => (
                                    <Text key={idx} style={{
                                        color: COLORS.secondaryLightGreyHex,
                                        fontFamily: FONTFAMILY.poppins_light,
                                        fontSize: FONTSIZE.size_12,
                                    }}
                                    >
                                        <View style={styles.dot} />{' '}
                                        {bahan.bahan_baku} {bahan.quantity} {bahan.unit}
                                    </Text>
                                ))}
                            </View>
                        </View>
                        <View style={{ justifyContent: 'flex-start' }}>
                            <Text style={styles.items}>{qty} items</Text>
                            {
                                status !== 'Ordered' && (
                                    <Text style={{ color: COLORS.primaryOrangeHex }}>{status}</Text>
                                )
                            }
                        </View>
                        <View style={styles.ContainerButtonChef}>
                            {
                                status === 'Ordered' &&
                                (
                                    <TouchableOpacity
                                        activeOpacity={0.4}
                                        style={styles.ButtonChef}
                                        onPress={onProcess}
                                    >
                                        <Text style={{ color: COLORS.primaryWhiteHex }}>Process</Text>
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                    </>
                );
            case 'ordered':
                return (
                    <>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', color: COLORS.primaryOrangeHex }}>
                            <View style={styles.content}>
                                <Text style={styles.title}>Order Number <Text style={{ fontFamily: FONTFAMILY.poppins_semibold }}>#{id}</Text></Text>
                                <View style={styles.row}>
                                    <Text style={styles.SizePrice}>{qty} <Text>items</Text></Text>
                                    <View style={styles.dot} />
                                    <Text style={styles.SizeCurrency}>
                                        IDR <Text style={styles.SizePrice}>{price.toLocaleString('id-ID')}</Text>
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </>
                );
            case 'past_order':
                return (
                    <>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', color: COLORS.primaryOrangeHex }}>
                            <View style={styles.content}>
                                <Text style={styles.title}>Order Number <Text style={{ fontFamily: FONTFAMILY.poppins_semibold }}>#{id}</Text></Text>
                                <View style={styles.row}>
                                    <Text style={styles.SizePrice}>{qty} <Text>items</Text></Text>
                                    <View style={styles.dot} />
                                    <Text style={styles.SizeCurrency}>
                                        IDR <Text style={styles.SizePrice}>{price.toLocaleString('id-ID')}</Text>
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.ContainerStatus}>
                                <View style={styles.StatusCard}>
                                    <Text style={styles.StatusName}>{status}</Text>
                                </View>
                            </View>
                        </View>
                    </>
                );
            default:
                //item pruduct
                return (
                    // fragment karena return hanya boleh mereturn 1 induk (tidak boleh nesting)
                    <>
                        <View style={styles.content}>
                            <Text style={styles.title}>{name}</Text>
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
                        ? COLORS.primaryBlackRGBA
                        : COLORS.secondaryBlackRGBA
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
                {status === 'ordered' || status === 'past_order' ?
                    <View style={styles.ContainerTable}>
                        <View style={[styles.ContainerTableNumber, { zIndex: 1 }]}>
                            <IcTableActive width={60} />
                        </View>
                        <View style={[styles.ContainerTableNumber, { zIndex: 2 }]}>
                            <Text style={[
                                styles.NameTable,
                                { color: COLORS.primaryOrangeHex }
                            ]}>{name}</Text>
                        </View>
                    </View>
                    : (
                        <Image source={{ uri: photo }} style={styles.image} />)
                }
                {/* <View style={styles.ContainerTable}>
                    <View style={[styles.ContainerTableNumber, { zIndex: 1 }]}>
                        <IcTableActive width={60} />
                    </View>
                    <View style={[styles.ContainerTableNumber, { zIndex: 2 }]}>
                        <Text style={[
                            styles.NameTable,
                            { color: COLORS.primaryOrangeHex }
                        ]}>{name}</Text>
                    </View>
                </View> */}

                {renderContent()}
            </View>
        </Pressable>
    )
}

export default ItemListOrder

const styles = StyleSheet.create({
    ButtonChef: {
        backgroundColor: COLORS.secondaryLightGreyHex,
        padding: SPACING.space_12,
        borderRadius: BORDERRADIUS.radius_10,
    },
    ContainerButtonChef: {
        marginLeft: 20,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        gap: SPACING.space_10,
        paddingHorizontal: SPACING.space_2
    },
    StatusName: {
        color: COLORS.secondaryDarkGreyHex,
        fontSize: FONTSIZE.size_14,
        fontFamily: FONTFAMILY.poppins_medium
    },
    StatusCard: {
        backgroundColor: COLORS.primaryOrangeHex,
        justifyContent: 'center',
        alignItems: 'center',
        width: 'auto',
        height: 30,
        borderRadius: 10,
        paddingHorizontal: 10,
        // opacity: 0.6
    },
    ContainerStatus: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    NameTable: {
        fontSize: FONTSIZE.size_12,
        fontFamily: FONTFAMILY.poppins_regular,
    },
    ContainerTable: {
        width: 60,
        height: 60,
        borderRadius: BORDERRADIUS.radius_20 + 5,
        position: 'relative',
        marginRight: 12
    },
    ContainerTableNumber: {
        borderRadius: 10,
        position: 'absolute',
        top: 0, // Center vertically
        bottom: 0, // Center horizontally
        left: 0, // Center horizontally
        right: 0, // Center horizontally
        justifyContent: 'center',
        alignItems: 'center',
    },
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
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontFamily: FONTFAMILY.poppins_regular,
        color: COLORS.secondaryLightGreyHex
    },
    subTitle: {
        fontSize: 14,
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