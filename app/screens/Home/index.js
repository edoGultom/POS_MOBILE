import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { IcCoffeeOff, IcCoffeeOn, IcNonCoffeeOff, IcNonCoffeeOn, ImChocolate, ImCoffAmericano, ImLangitMatcha, ImLangitTaro } from '../../assets';
import CoffeCard from '../../component/CoffeeCard';
import HeaderBar from '../../component/HeaderBar';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config';
import { useDispatch, useSelector } from 'react-redux';
import { getData } from '../../utils';
import { getMenu } from '../../redux/menuSlice';
import { addToChartList } from '../../redux/orderSlice';

const Home = ({ navigation }) => {
    const tabBarHeight = useBottomTabBarHeight();
    const ListRef = useRef();
    const dispatch = useDispatch();
    const { menus } = useSelector(state => state.menuReducer);

    const [catgoryMenu, setCategoryMenu] = useState({
        index: 0,
        category: 'Coffee',
    });
    const categroyMenu = [
        {
            key: 0,
            label: 'Coffee',
            iconOff: <IcCoffeeOff />,
            iconOn: <IcCoffeeOn />,
        },
        {
            key: 1,
            label: 'Non Coffee',
            iconOff: <IcNonCoffeeOff />,
            iconOn: <IcNonCoffeeOn />,
        },
    ];
    const [sortedMenu, setSortedMenu] = useState(null);
    const getMenuList = (category, data) => {
        let coffeelist = data?.filter((item) => item.nama_kategori == category) || [];
        return coffeelist;
    };
    useEffect(() => {
        setSortedMenu([...getMenuList(catgoryMenu.category, menus)])
    }, [menus]);

    const getDataMenu = () => {
        getData('token').then((res) => {
            dispatch(getMenu(res.value))
        });
    };
    useEffect(() => {
        navigation.addListener('focus', () => {
            getDataMenu();
        });
    }, [navigation]);

    const CoffeCardAddToCart = (item, checked) => {
        const { id, nama_barang, path, nama_kategori, harga } = item
        const data = {
            id, nama_barang, path, nama_kategori, harga: checked.value, temperatur: checked.label
        }
        console.log(data, 'xxx')
        dispatch(addToChartList(data))
        ToastAndroid.showWithGravity(
            `${nama_barang} is Added to Cart`,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
        )
    };

    const fetchData = useCallback(async () => {
        try {
            getDataMenu();
        } catch (error) {
            console.log(error);
        }
    }, []);
    useEffect(() => {
        fetchData();
    }, [fetchData]);
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
                    {categroyMenu.map((item, index) => (
                        <TouchableOpacity
                            key={item.key}
                            onPress={() => {
                                ListRef?.current?.scrollToOffset({
                                    animated: true,
                                    offset: 0,
                                });
                                setCategoryMenu({ index: item.key, category: item.label })
                                setSortedMenu([
                                    ...getMenuList(item.label, menus),
                                ]);
                            }}
                            style={[
                                styles.KindBox,
                                catgoryMenu.index === item.key
                                    ? { borderColor: COLORS.primaryOrangeHex } : { borderColor: COLORS.primaryLightGreyHex },
                            ]}>
                            {catgoryMenu.index === item.key ? item.iconOn : item.iconOff}
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
                    onRefresh={fetchData}
                    refreshing={false}
                    showsHorizontalScrollIndicator={false}
                    data={sortedMenu}
                    contentContainerStyle={styles.FlatListContainer}
                    ListEmptyComponent={
                        <View style={styles.EmptyListContainer}>
                            <Text style={styles.EmptyText}>No Coffee Available</Text>
                        </View>
                    }
                    keyExtractor={item => item.id}
                    vertical
                    renderItem={({ item }) => {
                        return (
                            <CoffeCard
                                id={`${item.id}-${item.temperatur}`}
                                link={item.path}
                                name={item.nama_barang}
                                kind={item.nama_kategori}
                                price={item.harga}
                                buttonPressHandler={(valChecked) => CoffeCardAddToCart(item, valChecked)}
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