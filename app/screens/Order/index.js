import React from 'react'
import { StatusBar, StyleSheet, View, ScrollView } from 'react-native'
import { COLORS, SPACING } from '../../config'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import HeaderBar from '../../component/HeaderBar';
import { ImChocolate } from '../../assets';
import OrderItem from '../../component/OrderItem';
import PaymentFooter from '../../component/PaymentFooter';


const Order = () => {
    const tabBarHeight = useBottomTabBarHeight();
    return (
        <View style={styles.ScreenContainer}>
            <StatusBar style='light' />
            <HeaderBar title="Orders Detail" />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.ScrollViewFlex}>
                <View style={[styles.ScrollViewInnerView, { marginBottom: tabBarHeight * 2 }]}>
                    <View style={styles.ItemContainer}>
                        <OrderItem
                            id={1}
                            name='Chocolate'
                            imagelink_square={ImChocolate}
                            kind='Non Coffee'
                            roasted='Medium Roasted'
                            prices='12.000'
                            type='Bean'
                        // incrementCartItemQuantityHandler={
                        //     incrementCartItemQuantityHandler
                        // }
                        // decrementCartItemQuantityHandler={
                        //     decrementCartItemQuantityHandler
                        // }
                        />
                        <OrderItem
                            id={1}
                            name='Chocolate'
                            imagelink_square={ImChocolate}
                            kind='Non Coffee'
                            roasted='Medium Roasted'
                            prices='12.000'
                            type='Bean'
                        // incrementCartItemQuantityHandler={
                        //     incrementCartItemQuantityHandler
                        // }
                        // decrementCartItemQuantityHandler={
                        //     decrementCartItemQuantityHandler
                        // }
                        />
                        <OrderItem
                            id={1}
                            name='Chocolate'
                            imagelink_square={ImChocolate}
                            kind='Non Coffee'
                            roasted='Medium Roasted'
                            prices='12.000'
                            type='Bean'
                        // incrementCartItemQuantityHandler={
                        //     incrementCartItemQuantityHandler
                        // }
                        // decrementCartItemQuantityHandler={
                        //     decrementCartItemQuantityHandler
                        // }
                        />

                        <OrderItem
                            id={1}
                            name='Chocolate'
                            imagelink_square={ImChocolate}
                            kind='Non Coffee'
                            roasted='Medium Roasted'
                            prices='12.000'
                            type='Bean'
                        // incrementCartItemQuantityHandler={
                        //     incrementCartItemQuantityHandler
                        // }
                        // decrementCartItemQuantityHandler={
                        //     decrementCartItemQuantityHandler
                        // }
                        />
                    </View>
                    <PaymentFooter
                        // buttonPressHandler={buttonPressHandler}
                        buttonTitle="Pay"
                        price={{ price: '12.000', currency: 'IDR' }}
                    />
                </View>


            </ScrollView>
        </View>

    )
}

export default Order

const styles = StyleSheet.create({
    ScreenContainer: {
        flex: 1,
        backgroundColor: COLORS.primaryBlackHex,
    },
    ScrollViewFlex: {
        flexGrow: 1,
    },
    ItemContainer: {
        flex: 1,
    },
    ScrollViewInnerView: {
        flex: 1,
        justifyContent: 'space-between',
    },
})