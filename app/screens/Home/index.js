import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IcCoffeeOn, IcNonCoffeeOff } from '../../assets';
import CoffeCard from '../../component/CoffeeCard';
import HeaderBar from '../../component/HeaderBar';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

const Home = () => {
    const tabBarHeight = useBottomTabBarHeight();

    const BeanList = [
        {
            id: 'B1',
            name: 'Robusta Beans',
            description: `Robusta beans are larger and more rounded than the other bean varieties. These plants typically grow much larger than Arabica plants, measuring between 15 and 20 feet. Robusta beans are typically considered to be hardier because they can grow at lower altitudes and resist diseases. But recent research suggests that they don’t handle heat as well as was previously thought.`,
            roasted: 'Medium Roasted',
            imagelink_square: require('../../assets/coffee_assets/robusta_coffee_beans/robusta_coffee_beans_square.png'),
            imagelink_portrait: require('../../assets/coffee_assets/robusta_coffee_beans/robusta_coffee_beans_portrait.png'),
            ingredients: 'Africa',
            special_ingredient: 'From Africa',
            prices: [
                { size: '250gm', price: '5.50', currency: '$' },
                { size: '500gm', price: '10.50', currency: '$' },
                { size: '1Kg', price: '18.50', currency: '$' },
            ],
            average_rating: 4.7,
            ratings_count: '6,879',
            favourite: false,
            type: 'Bean',
            index: 0,
        },
        {
            id: 'B2',
            name: 'Arabica Beans',
            description: `Arabica beans are by far the most popular type of coffee beans, making up about 60% of the world’s coffee. These tasty beans originated many centuries ago in the highlands of Ethiopia, and may even be the first coffee beans ever consumed! The name Arabica likely comes from the beans’ popularity in 7th-century Arabia (present-day Yemen).`,
            roasted: 'Medium Roasted',
            imagelink_square: require('../../assets/coffee_assets/arabica_coffee_beans/arabica_coffee_beans_square.png'),
            imagelink_portrait: require('../../assets/coffee_assets/arabica_coffee_beans/arabica_coffee_beans_portrait.png'),
            ingredients: 'Africa',
            special_ingredient: 'From Africa',
            prices: [
                { size: '250gm', price: '5.50', currency: '$' },
                { size: '500gm', price: '10.50', currency: '$' },
                { size: '1Kg', price: '18.50', currency: '$' },
            ],
            average_rating: 4.7,
            ratings_count: '6,879',
            favourite: false,
            type: 'Bean',
            index: 1,
        },
        {
            id: 'B3',
            name: 'Arabica Beans',
            description: `Arabica beans are by far the most popular type of coffee beans, making up about 60% of the world’s coffee. These tasty beans originated many centuries ago in the highlands of Ethiopia, and may even be the first coffee beans ever consumed! The name Arabica likely comes from the beans’ popularity in 7th-century Arabia (present-day Yemen).`,
            roasted: 'Medium Roasted',
            imagelink_square: require('../../assets/coffee_assets/arabica_coffee_beans/arabica_coffee_beans_square.png'),
            imagelink_portrait: require('../../assets/coffee_assets/arabica_coffee_beans/arabica_coffee_beans_portrait.png'),
            ingredients: 'Africa',
            special_ingredient: 'From Africa',
            prices: [
                { size: '250gm', price: '5.50', currency: '$' },
                { size: '500gm', price: '10.50', currency: '$' },
                { size: '1Kg', price: '18.50', currency: '$' },
            ],
            average_rating: 4.7,
            ratings_count: '6,879',
            favourite: false,
            type: 'Bean',
            index: 1,
        },
        {
            id: 'B4',
            name: 'Arabica Beans',
            description: `Arabica beans are by far the most popular type of coffee beans, making up about 60% of the world’s coffee. These tasty beans originated many centuries ago in the highlands of Ethiopia, and may even be the first coffee beans ever consumed! The name Arabica likely comes from the beans’ popularity in 7th-century Arabia (present-day Yemen).`,
            roasted: 'Medium Roasted',
            imagelink_square: require('../../assets/coffee_assets/arabica_coffee_beans/arabica_coffee_beans_square.png'),
            imagelink_portrait: require('../../assets/coffee_assets/arabica_coffee_beans/arabica_coffee_beans_portrait.png'),
            ingredients: 'Africa',
            special_ingredient: 'From Africa',
            prices: [
                { size: '250gm', price: '5.50', currency: '$' },
                { size: '500gm', price: '10.50', currency: '$' },
                { size: '1Kg', price: '18.50', currency: '$' },
            ],
            average_rating: 4.7,
            ratings_count: '6,879',
            favourite: false,
            type: 'Bean',
            index: 1,
        },
    ];
    return (
        <View style={styles.ScreenContainer}>
            <StatusBar style='light' />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.ScrollViewFlex}>
                <HeaderBar />
                <Text style={styles.ScreenTitle}>
                    Find the best{'\n'}coffee for you
                </Text>
                {/* Choose Button */}
                <View style={styles.KindOuterContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            //   setPrice(data);
                        }}
                        style={[
                            styles.KindBox,
                            {
                                borderColor: COLORS.primaryOrangeHex
                            },
                        ]}>
                        <IcCoffeeOn />
                        <Text
                            style={[
                                styles.SizeText,
                                {
                                    fontSize: FONTSIZE.size_16,
                                    color: COLORS.primaryOrangeHex
                                },
                            ]}>
                            Coffee
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            //   setPrice(data);
                        }}
                        style={[
                            styles.KindBox,
                            {
                                borderColor: COLORS.primaryDarkGreyHex
                            },
                        ]}>
                        <IcNonCoffeeOff />
                        <Text
                            style={[
                                styles.SizeText,
                                {
                                    fontSize: FONTSIZE.size_16,
                                    color: COLORS.secondaryLightGreyHex
                                },
                            ]}>
                            Non Coffee
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* flatlist */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[
                        styles.CoffeeScrollViewStyle,
                        { height: tabBarHeight, flex: 1 },
                    ]}>
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        data={BeanList}
                        contentContainerStyle={[
                            styles.FlatListContainer,
                            { marginBottom: tabBarHeight },
                        ]}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity
                                // onPress={() => {
                                //     navigation.push('Details', {
                                //         index: item.index,
                                //         id: item.id,
                                //         type: item.type,
                                //     });
                                // }}
                                >
                                    <CoffeCard
                                        id={item.id}
                                        index={item.index}
                                        type={item.type}
                                        roasted={item.roasted}
                                        imagelink_square={item.imagelink_square}
                                        name={item.name}
                                        special_ingredient={item.special_ingredient}
                                        average_rating={item.average_rating}
                                        price={item.prices[2]}
                                    // buttonPressHandler={CoffeCardAddToCart}
                                    />
                                </TouchableOpacity>
                            );
                        }}
                    />
                </ScrollView>
            </ScrollView>
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    CoffeeScrollViewStyle: {
        backgroundColor: 'red'
    },
    FlatListContainer: {
        gap: SPACING.space_20,
        paddingVertical: SPACING.space_20,
        paddingHorizontal: SPACING.space_15,
    },
    ScreenContainer: {
        flex: 1,
        backgroundColor: COLORS.primaryBlackHex,
    },
    ScrollViewFlex: {
        flexGrow: 1,
    },
    ScreenTitle: {
        fontSize: FONTSIZE.size_24,
        fontFamily: FONTFAMILY.poppins_semibold,
        color: COLORS.primaryWhiteHex,
        paddingLeft: SPACING.space_15,
    },
    KindContainer: {
        flexDirection: 'row',
        paddingLeft: SPACING.space_15,
        marginTop: SPACING.space_28,
        backgroundColor: COLORS.primaryDarkGreyHex,
        alignItems: 'center',
    },
    KindOuterContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: SPACING.space_20,
        padding: SPACING.space_15
    },
    KindBox: {
        flex: 1,
        backgroundColor: COLORS.
            primaryDarkGreyHex,
        alignItems: 'center',
        justifyContent: 'center',
        height: SPACING.space_24 * 2,
        borderRadius: BORDERRADIUS.radius_10,
        borderWidth: 2,
    },
    SizeText: {
        fontFamily: FONTFAMILY.poppins_medium,
    },
})