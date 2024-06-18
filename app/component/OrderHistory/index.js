import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config';
import OrderHistoryItem from '../OrderHistoryItem';

const OrderHistory = ({
    detail,
    price,
    date,
}) => {
    const formatCurrency = (amount, currency) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };
    return (
        <View style={styles.CardContainer}>
            <View style={styles.CardHeader}>
                <View>
                    <Text style={styles.HeaderTitle}>Tanggal Order</Text>
                    <Text style={styles.HeaderSubtitle}>{date}</Text>
                </View>
                <View style={styles.PriceContainer}>
                    <Text style={styles.HeaderTitle}>Total</Text>
                    <Text style={styles.HeaderPrice}>{formatCurrency(price, 'IDR')}</Text>
                </View>
            </View>
            <View style={styles.ListContainer}>
                {detail && detail.map((item, idx) => (
                    <OrderHistoryItem
                        key={idx}
                        name={item.nama_barang}
                        kind={item.kategori}
                        link={item.link}
                        price={item.harga}
                        qty={item.qty}
                        temperatur={item.temperatur}
                        ItemPrice={item.total}
                    />
                ))}
            </View>
        </View>
    )
}

export default OrderHistory

const styles = StyleSheet.create({
    CardContainer: {
        gap: SPACING.space_10,
        marginHorizontal: 15,
        marginBottom: 15
    },
    CardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: SPACING.space_20,
        alignItems: 'center',
        marginHorizontal: 15,
        marginTop: 25
    },
    HeaderTitle: {
        fontFamily: FONTFAMILY.poppins_semibold,
        fontSize: FONTSIZE.size_16,
        color: COLORS.primaryWhiteHex,
    },
    HeaderSubtitle: {
        fontFamily: FONTFAMILY.poppins_light,
        fontSize: FONTSIZE.size_16,
        color: COLORS.primaryWhiteHex,
    },
    PriceContainer: {
        alignItems: 'flex-end',
    },
    ListContainer: {
        gap: SPACING.space_20,
    },
    HeaderPrice: {
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_18,
        color: COLORS.primaryOrangeHex,
    },
})