import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import useAxios from '../../api/useAxios';
import { IcCoffeeOff, IcCoffeeOn, IcFoodOff, IcFoodOn, IcNoMenu, IcNonCoffeeOff, IcNonCoffeeOn } from '../../assets';
import CoffeCard from '../../component/CoffeeCard';
import HeaderBar from '../../component/HeaderBar';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config';
import { getMenu } from '../../redux/menuSlice';
import { addToChartList } from '../../redux/orderSlice';

const Home = ({ navigation }) => {
    const tabBarHeight = useBottomTabBarHeight();
    const [sortedMenu, setSortedMenu] = useState(null);
    const ListRef = useRef();
    const dispatch = useDispatch();
    const { fetchData: axiosBe } = useAxios();
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
        {
            key: 2,
            label: 'Snack',
            iconOff: <IcFoodOff />,
            iconOn: <IcFoodOn />,
        },
    ];
    const getMenuList = (category, data) => {
        let coffeelist = data?.filter((item) => item.nama_sub_kategori == category) || [];
        return coffeelist;
    };
    useEffect(() => {
        if (menus) {
            setSortedMenu([...getMenuList(catgoryMenu.category, menus)])
            return () => {
                if (sortedMenu) {
                    setSortedMenu(null)
                }
            }
        }
    }, [menus]);

    const getDataMenu = async () => {
        try {
            await dispatch(getMenu(axiosBe)).unwrap();
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }

    };
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', getDataMenu);
        return unsubscribe;  // Cleanup the listener on unmount or when navigation changes
    }, [navigation, dispatch, axiosBe]);

    const CoffeCardAddToCart = (item, checked) => {
        const { id, nama, path, nama_kategori, nama_sub_kategori, harga } = item
        const data = {
            id, nama, path, nama_kategori, nama_sub_kategori, harga: checked.value, temperatur: checked.label
        }
        dispatch(addToChartList(data))
        ToastAndroid.showWithGravity(
            `${nama} is Added to Cart`,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
        )
    };

    const fetchDatas = useCallback(async () => {
        try {
            getDataMenu();
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        fetchDatas();
    }, [fetchDatas]);

    return (
        <View style={styles.ScreenContainer}>
            <StatusBar style='light' />
            <HeaderBar />
            <Text style={styles.ScreenTitle}>
                Find the best{'\n'}coffee or food for you
            </Text>
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}>
                <Text style={styles.ScreenTitle}>
                    Find the best{'\n'}coffee or food for you
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
                    marginBottom: tabBarHeight
                }}
            >
                <FlatList
                    ref={ListRef}
                    onRefresh={fetchDatas}
                    refreshing={false}
                    showsHorizontalScrollIndicator={false}
                    data={sortedMenu}
                    contentContainerStyle={styles.FlatListContainer}
                    ListEmptyComponent={
                        <View style={styles.EmptyListContainer}>
                            <IcNoMenu />
                            <Text style={styles.EmptyText}>No Menu Available</Text>
                        </View>
                    }
                    keyExtractor={item => item.id}
                    vertical
                    renderItem={({ item }) => {
                        return (
                            <CoffeCard
                                id={`${item.id}-${item.temperatur}`}
                                link={item.path}
                                name={item.nama}
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