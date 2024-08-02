import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ItemValue from '../ItemValue'
import Button from '../Button'

const OrderSummary = () => {
    const onOrdered = () => {
        return
    }
    return (
        <>
            <View style={styles.content}>
                <Text style={styles.label}>Item Ordered</Text>

                {/* <ItemListFood
                    name={item.name}
                    type="order_summary"
                    price={item.price}
                    image={{ uri: item.picturePath }}
                    items={transaction.totalItem}
                /> */}

                <Text style={styles.label}>Details Menus</Text>
                <ItemValue label={'itemname'} value='xcxc' type='currency' />
                <ItemValue label="Driver" value={12000} type='currency' />
                <ItemValue label="Tax 10%" value={12000} type='currency' />
                <ItemValue label="Total Price" value={12000} valueColor='#1ABC9C' type='currency' />
            </View>

            <View style={styles.content}>
                <Text style={styles.label}>Deliver to:</Text>
                <ItemValue label="Name" value={'sdsdsd'} />
                <ItemValue label="Phone No." value={'sdsdsd'} />
            </View>

            <View style={styles.button}>
                <Button text="Pesan Sekarang" onPress={onOrdered} />

            </View>
        </>
    )
}

export default OrderSummary

const styles = StyleSheet.create({
    content: {
        backgroundColor: 'white',
        paddingHorizontal: 24,
        paddingVertical: 16,
        marginTop: 24
    },
    label: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: '#020202',
        marginBottom: 8
    },
    button: {
        paddingHorizontal: 24,
        marginTop: 24
    }
})