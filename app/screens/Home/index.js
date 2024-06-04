import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IcCoffeeOff, IcCoffeeOn, IcNonCoffeeOff, ImChocolate, ImCoffAmericano, ImLangitMatcha, ImLangitTaro } from '../../assets';
import CoffeCard from '../../component/CoffeeCard';
import HeaderBar from '../../component/HeaderBar';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

const Home = () => {
    const tabBarHeight = useBottomTabBarHeight();
    const ListRef = useRef();
    const [catgoryMenu, setCategoryMenu] = useState({
        index: 1,
        category: 'Coffee',
    });
    const categroyMenu = [
        {
            key: 1,
            label: 'Coffee',
            icon: <IcCoffeeOn />,
            onPress: () => {
                setCategoryMenu({ index: 1, category: 'Coffee' });
            },
        },
        {
            key: 2,
            label: 'Non Coffee',
            icon: <IcNonCoffeeOff />,
            onPress: () => {
                setCategoryMenu({ index: 2, category: 'Non Coffee' });
            },
        },
    ];
    const BeanList = [
        {
            id: 'B1',
            name: 'Chocolate',
            description: `Robusta beans are larger and more rounded than the other bean varieties. These plants typically grow much larger than Arabica plants, measuring between 15 and 20 feet. Robusta beans are typically considered to be hardier because they can grow at lower altitudes and resist diseases. But recent research suggests that they don’t handle heat as well as was previously thought.`,
            roasted: 'Medium Roasted',
            imagelink_square: ImChocolate,
            ingredients: 'Africa',
            kind: 'Non Coffee',
            prices: [
                { size: '250gm', price: '12.000', currency: 'K' },
                { size: '500gm', price: '13.000', currency: 'K' },
                { size: '1Kg', price: '15.000', currency: 'K' },
            ],
            average_rating: 4.7,
            ratings_count: '6,879',
            favourite: false,
            type: 'Bean',
            index: 0,
        },
        {
            id: 'B2',
            name: 'Americano',
            description: `Arabica beans are by far the most popular type of coffee beans, making up about 60% of the world’s coffee. These tasty beans originated many centuries ago in the highlands of Ethiopia, and may even be the first coffee beans ever consumed! The name Arabica likely comes from the beans’ popularity in 7th-century Arabia (present-day Yemen).`,
            roasted: 'Medium Roasted',
            imagelink_square: ImCoffAmericano,
            imagelink_portrait: require('../../assets/coffee_assets/arabica_coffee_beans/arabica_coffee_beans_portrait.png'),
            ingredients: 'Africa',
            kind: 'Coffee',
            prices: [
                { size: '250gm', price: '10.000', currency: 'K' },
                { size: '500gm', price: '10.000', currency: 'K' },
                { size: '1Kg', price: '18.000', currency: 'K' },
            ],
            average_rating: 4.7,
            ratings_count: '6,879',
            favourite: false,
            type: 'Bean',
            index: 1,
        },
        {
            id: 'B3',
            name: 'Langit Matcha',
            description: `Arabica beans are by far the most popular type of coffee beans, making up about 60% of the world’s coffee. These tasty beans originated many centuries ago in the highlands of Ethiopia, and may even be the first coffee beans ever consumed! The name Arabica likely comes from the beans’ popularity in 7th-century Arabia (present-day Yemen).`,
            roasted: 'Medium Roasted',
            imagelink_square: ImLangitMatcha,
            imagelink_portrait: require('../../assets/coffee_assets/arabica_coffee_beans/arabica_coffee_beans_portrait.png'),
            ingredients: 'Africa',
            kind: 'Non Coffee',
            prices: [
                { size: '250gm', price: '17.000', currency: 'K' },
                { size: '500gm', price: '19.000', currency: 'K' },
                { size: '1Kg', price: '20.000', currency: 'K' },
            ],
            average_rating: 4.7,
            ratings_count: '6,879',
            favourite: false,
            type: 'Bean',
            index: 1,
        },
        {
            id: 'B4',
            name: 'Langit Taro',
            description: `Arabica beans are by far the most popular type of coffee beans, making up about 60% of the world’s coffee. These tasty beans originated many centuries ago in the highlands of Ethiopia, and may even be the first coffee beans ever consumed! The name Arabica likely comes from the beans’ popularity in 7th-century Arabia (present-day Yemen).`,
            roasted: 'Medium Roasted',
            imagelink_square: ImLangitTaro,
            imagelink_portrait: require('../../assets/coffee_assets/arabica_coffee_beans/arabica_coffee_beans_portrait.png'),
            ingredients: 'Africa',
            kind: 'Non Coffee',
            prices: [
                { size: '250gm', price: '17.000', currency: 'K' },
                { size: '500gm', price: '19.000', currency: 'K' },
                { size: '1Kg', price: '20.000', currency: 'K' },
            ],
            average_rating: 4.7,
            ratings_count: '6,879',
            favourite: false,
            type: 'Bean',
            index: 1,
        },
    ];
    // console.log(Dimensions.get('window').width, 'width')
    return (
        <View style={styles.ScreenContainer}>
            <StatusBar style='light' />
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}>
                <HeaderBar />
                <Text style={styles.ScreenTitle}>
                    Find the best{'\n'}coffee for you
                </Text>
                <View style={styles.KindOuterContainer}>
                    {categroyMenu.map((item) => (
                        <TouchableOpacity
                            onPress={item.onPress}
                            style={[
                                styles.KindBox,
                                catgoryMenu.index === item.key
                                    ? { borderColor: COLORS.primaryOrangeHex } : {},
                            ]}>
                            {item.icon}
                            <Text
                                style={[
                                    styles.SizeText,
                                    {
                                        fontSize: FONTSIZE.size_16,
                                    },
                                    catgoryMenu.index === item.key
                                        ? { color: COLORS.primaryOrangeHex } : { color: COLORS.primaryWhiteHex },
                                ]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    ))}

                </View>
            </View>
            <View
                style={{
                    flex: 2,
                    // backgroundColor: 'blue'
                    marginBottom: tabBarHeight
                }}
            >
                <FlatList
                    ref={ListRef}
                    showsHorizontalScrollIndicator={false}
                    data={BeanList}
                    contentContainerStyle={styles.FlatListContainer}
                    ListEmptyComponent={
                        <View style={styles.EmptyListContainer}>
                            <Text style={styles.EmptyText}>No Coffee Available</Text>
                        </View>
                    }
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => {
                        return (

                            <CoffeCard
                                id={item.id}
                                index={item.index}
                                type={item.type}
                                roasted={item.roasted}
                                imagelink_square={item.imagelink_square}
                                name={item.name}
                                kind={item.kind}
                                average_rating={item.average_rating}
                                price={item.prices[2]}
                                buttonPressHandler={() => console.log('CoffeCardAddToCart')}
                            />
                        );
                    }}
                />
            </View>

        </View >
    )
}

export default Home

const styles = StyleSheet.create({
    FlatListContainer: {
        gap: SPACING.space_15,
        paddingVertical: SPACING.space_20,
        paddingHorizontal: SPACING.space_15,
    },
    ScreenContainer: {
        backgroundColor: COLORS.primaryBlackHex,
        flex: 1,
    },
    EmptyListContainer: {
        width: Dimensions.get('window').width - SPACING.space_30 * 2,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.space_36 * 3.6,
    },
    EmptyText: {
        fontFamily: FONTFAMILY.poppins_semibold,
        fontSize: FONTSIZE.size_16,
        color: COLORS.primaryLightGreyHex,
        marginBottom: SPACING.space_4,
    },
    ScreenTitle: {
        fontSize: FONTSIZE.size_24,
        fontFamily: FONTFAMILY.poppins_semibold,
        color: COLORS.primaryWhiteHex,
        paddingLeft: SPACING.space_15,
    },
    KindOuterContainer: {
        justifyContent: 'flex-end',
        flexDirection: 'row',
        gap: SPACING.space_15,
        paddingVertical: SPACING.space_15,
        paddingHorizontal: SPACING.space_15,
        // backgroundColor: 'red'
    },
    KindBox: {
        flex: 1,
        backgroundColor: COLORS.primaryDarkGreyHex,
        alignItems: 'center',
        justifyContent: 'center',
        height: SPACING.space_24 * 2.5,
        borderRadius: BORDERRADIUS.radius_10,
        borderWidth: 2,
        elevation: 1
    },
    SizeText: {
        fontFamily: FONTFAMILY.poppins_medium,
    },
})