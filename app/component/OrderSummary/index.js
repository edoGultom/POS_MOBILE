import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useDispatch } from 'react-redux'
import useAxios from '../../api/useAxios'
import { COLORS, FONTFAMILY, FONTSIZE } from '../../config'
import { addOrder } from '../../redux/orderSlice'
import Button from '../Button'
import ItemListOrder from '../ItemListOrder'
import ItemValue from '../ItemValue'

const OrderSummary = ({ item, onAddOrder }) => {
    const { ordered, } = item;
    const totalBayar = ordered.reduce((acc, curr) => acc + curr.totalHarga, 0);

    return (
        <View
            style={{
                paddingHorizontal: 20,
                gap: 10
            }}>
            <Text style={{ fontSize: FONTSIZE.size_20, color: COLORS.primaryOrangeHex }}>Summary</Text>
            <Text style={{ fontSize: FONTSIZE.size_12 + 1, color: COLORS.secondaryLightGreyHex }}>Silahkan periksa kembali pesanan Anda!</Text>

            <View style={styles.content}>
                <Text style={styles.label}>Item Order</Text>
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
                <Button text="Pesan Sekarang" onPress={onAddOrder} />
            </View>
        </View>
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
        marginVertical: 24
    },
    LottieAnimation: {
        flex: 1,
    },
})