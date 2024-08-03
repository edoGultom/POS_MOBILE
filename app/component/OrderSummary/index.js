import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { COLORS, FONTFAMILY, FONTSIZE } from '../../config'
import Button from '../Button'
import ItemListOrder from '../ItemListOrder'
import ItemValue from '../ItemValue'
import useAxios from '../../api/useAxios'
import { addOrder } from '../../redux/orderSlice'
import { useDispatch } from 'react-redux'
import PopUpAnimation from '../PopUpAnimation'
import { IlSuccesFully } from '../../assets'

const OrderSummary = (props) => {
    const { status, table, ordered } = props.item;
    const { SetIsShowSuccess, closeModal } = props;
    const totalBayar = ordered.reduce((acc, curr) => acc + curr.totalHarga, 0);
    const { fetchData: axiosBe } = useAxios();
    const dispatch = useDispatch();

    const onOrdered = () => {
        try {
            const formData = {
                table,
                status,
                ordered,
            }
            const data = {
                formData,
                SetIsShowSuccess,
                closeModal,
                axiosBe,
            }
            // console.log(data, 'data'); return
            dispatch(addOrder(data))
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };
    return (
        <>
            <Text style={{ fontSize: FONTSIZE.size_20, color: COLORS.primaryOrangeHex }}>Order Summary</Text>
            <Text style={{ fontSize: FONTSIZE.size_12 + 1, color: COLORS.secondaryLightGreyHex }}>Silahkan periksa kembali pesanan Anda!</Text>

            <View style={styles.content}>
                <Text style={styles.label}>Item Ordered</Text>
                {ordered.map((item, idx) => (
                    <ItemListOrder
                        key={idx}
                        name={item.nama}
                        type="order_summary"
                        price={item.harga}
                        priceExtra={item.harga_ekstra}
                        temperatur={item.temperatur}
                        image={item.path}
                        qty={item.qty}
                    />
                ))}

                <ItemValue label="Total Harga" value={totalBayar} valueColor='#1ABC9C' type='currency' />
            </View>

            {/* <View style={styles.content}>
                <Text style={styles.label}>Deliver to:</Text>
                <ItemValue label="Name" value={'sdsdsd'} />
                <ItemValue label="Phone No." value={'sdsdsd'} />
            </View> */}

            <View style={styles.button}>
                <Button text="Pesan Sekarang" onPress={onOrdered} />
            </View>
        </>
    )
}

export default OrderSummary

const styles = StyleSheet.create({
    content: {
        marginTop: 24,
        borderRadius: 10,
        gap: 10
    },
    label: {
        fontFamily: FONTFAMILY.poppins_regular,
        fontSize: FONTSIZE.size_14,
        color: COLORS.primaryOrangeHex,
        marginBottom: 8,
    },
    button: {
        paddingHorizontal: 24,
        marginTop: 24
    },
    LottieAnimation: {
        flex: 1,
    },
})