import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS, FONTFAMILY, FONTSIZE } from '../../config'

const ItemValue = ({ label, value, valueColor = '#020202', type }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            {type === 'currency' ? (
                <Text style={styles.SizeCurrency}>
                    IDR <Text style={styles.SizePrice}>{value.toLocaleString('id-ID')}</Text>
                </Text>
            ) : (
                <Text style={styles.value(valueColor)}>{value}</Text>
            )}
        </View>

    )
}

export default ItemValue

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    label: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#8D92A3'
    },
    value: (color) => ({
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: color
    }),
    SizeCurrency: {
        fontFamily: FONTFAMILY.poppins_semibold,
        fontSize: FONTSIZE.size_18,
        color: COLORS.primaryOrangeHex,
    },
    SizePrice: {
        color: COLORS.secondaryLightGreyHex,
    },
})