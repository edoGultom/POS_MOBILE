import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from "../../config";
import CustomIcon from "../../component/CustomIcon";
import ItemListOrder from "../../component/ItemListOrder";
import { useState } from "react";

export default function ItemOrderChef({
    item,
    itemState,
    animatedHeight,
    handleHeight,
    openModal,
    onProcess,
    toggleContent,
    isVisible
}) {


    return (
        <>
            <View style={{
                borderWidth: 1,
                borderColor: COLORS.primaryWhiteHex,
                backgroundColor: COLORS.primaryLightGreyHex,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 15,
                paddingVertical: 15,
                borderTopStartRadius: 25,
                borderTopEndRadius: 25,
                zIndex: 1
            }}>
                <View style={{
                    gap: 4
                }}>
                    <Text style={styles.HeaderName}>Order-ID : #{item.id}</Text>
                    <Text style={styles.HeaderName}>Table : {item.meja.nomor_meja}</Text>
                </View>
                <View style={{
                    // backgroundColor: 'yellow',
                    gap: 4,
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end'
                }}>
                    <Text style={styles.HeaderName}>Waktu : {item.waktu}</Text>
                    <Text style={styles.HeaderName}>Waiter : {item.pelayan}</Text>
                </View>
                <TouchableOpacity
                    // ref={touchableOpacityRef}
                    onPress={() => toggleContent(item.id)}
                    style={{
                        backgroundColor: COLORS.primaryOrangeHex,
                        position: 'absolute',
                        bottom: -14,
                        left: '50%',
                        borderRadius: 50,
                        zIndex: 2
                    }}>
                    <CustomIcon
                        name={itemState.expanded ? 'keyboard-arrow-down' : 'keyboard-arrow-up'}
                        color={COLORS.primaryWhiteHex}
                        size={FONTSIZE.size_30}
                    />
                </TouchableOpacity>
            </View>
            {
                itemState.expanded && (
                    <Animated.View style={[{
                        height: animatedHeight,
                        borderWidth: 1,
                        borderColor: COLORS.primaryWhiteHex,
                        backgroundColor: COLORS.primaryBlackHex,
                        paddingHorizontal: 10,
                        // borderBottomStartRadius: 25,
                        // borderBottomEndRadius: 25,
                    }]}>
                        <ScrollView
                            onLayout={(event) => handleHeight(event)}>
                            {item.order_detail.map((detail, idx) => (//content order detail
                                <ItemListOrder
                                    kind={detail.menu.nama_kategori}
                                    key={idx}
                                    name={detail.menu.nama}
                                    table={item.meja.nomor_meja}
                                    type="chef_detail_order"
                                    price={detail.menu.harga}
                                    priceExtra={detail.menu.harga_ekstra}
                                    temperatur={detail.temperatur}
                                    image={detail.menu.path}
                                    qty={detail.quantity}
                                    bahanBaku={detail.menu.list_bahan_baku}
                                    status={detail.status}
                                    onProcess={() => onProcess(detail)}
                                />
                            ))}
                            {item.status === 'In Progress' && (//Button ketika seluruh pesanan di process
                                <View style={{ marginVertical: 20, justifyContent: 'center', alignItems: 'center' }}>
                                    <TouchableOpacity
                                        onPress={openModal}
                                        disabled={isVisible}
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: 150,
                                            padding: 15,
                                            backgroundColor: COLORS.primaryOrangeHex,
                                            borderRadius: 10
                                        }}>
                                        <Text style={{ color: COLORS.primaryWhiteHex }}>Ready to Waiters</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                        </ScrollView>
                    </Animated.View >
                )
            }
        </>
    )
}

const styles = StyleSheet.create({
    HeaderName: {
        color: COLORS.primaryWhiteHex,
        fontSize: FONTSIZE.size_14,
        fontFamily: FONTFAMILY.poppins_light
    },
})