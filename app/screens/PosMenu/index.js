import { Animated, Dimensions, FlatList, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config';
import { IcCoffeeOff, IcCoffeeOn, IcFoodOff, IcFoodOn, IcNoMenu, IcNonCoffeeOff, IcNonCoffeeOn } from '../../assets';
import useAxios from '../../api/useAxios';
import { StatusBar } from 'expo-status-bar';
import CoffeCard from '../../component/CoffeeCard'
import HeaderBar from '../../component/HeaderBar';
import { getMenu } from '../../redux/menuSlice';
import { addToChartList } from '../../redux/orderSlice';
import Button from '../../component/Button';

const PosMenu = ({ navigation }) => {
    const ListRef = useRef();
    const dispatch = useDispatch();
    const { menus } = useSelector(state => state.menuReducer);
    const { CartList } = useSelector(state => state.orderReducer);
    const [sortedMenu, setSortedMenu] = useState(null);
    const slideAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: (CartList.length > 0) ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [CartList.length > 0]);

    const slideUp = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [300, 0], // Adjust the 300 value to how far you want it to slide
    });

    const { fetchData: axiosBe } = useAxios();

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
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', getDataMenu);
        return unsubscribe;  // Cleanup the listener on unmount or when navigation changes
    }, [navigation, dispatch, axiosBe]);

    const getMenuList = (category, data) => {
        let coffeelist = data?.filter((item) => item.nama_sub_kategori == category) || [];
        return coffeelist;
    };
    useEffect(() => {
        setSortedMenu([...getMenuList(catgoryMenu.category, menus)])
        return () => {
            if (sortedMenu) {
                setSortedMenu(null)
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
    const fetchDatas = useCallback(async () => {
        setRefreshData(true);
        try {
            getDataMenu();
        } catch (error) {
            console.error(error, 'error get data');
        } finally {
            setRefreshData(false);
        }
    }, []);
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
    console.log(CartList, 'CartList')
    return (
        <View style={styles.ScreenContainer}>
            <StatusBar style='light' />
            <HeaderBar title="Menu" onBack={() => navigation.goBack()} />
            <View style={styles.containerMenuAdmin}>
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
                    renderItem={({ item, }) => {
                        return (
                            <CoffeCard
                                id={`${item.id}-${item.temperatur}`}
                                link={item.path}
                                name={item.nama}
                                sub_kind={item.nama_sub_kategori}
                                kind={item.nama_kategori}
                                price={item.harga}
                                buttonPressHandler={(valCheck) => CoffeCardAddToCart(item, valCheck)}
                            />
                        );
                    }}
                />

            </View>
            {
                CartList.length > 0 && (
                    <Animated.View style={[styles.container, { transform: [{ translateY: slideUp }] }]}>

                        <View style={{
                            // position: 'absolute',
                            // bottom: 0,
                            backgroundColor: COLORS.primaryOrangeHex,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            padding: SPACING.space_10,
                            gap: SPACING.space_10
                        }}>
                            <Button text="Select and Continue" textColor={COLORS.primaryWhiteHex} onPress={() => navigation.navigate('AdminOrder')} color={COLORS.secondaryBlackRGBA} />
                        </View>
                    </Animated.View>

                )
            }

        </View>
    )
}

export default PosMenu

const styles = StyleSheet.create({
    FlatListContainer: {
        gap: SPACING.space_15,
        paddingVertical: SPACING.space_20,
        flexGrow: 1,
    },
    EmptyListContainer: {
        width: Dimensions.get('window').width - SPACING.space_30 * 2,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.space_36 * 3.6,
        gap: SPACING.space_20
    },
    EmptyText: {
        fontFamily: FONTFAMILY.poppins_semibold,
        fontSize: FONTSIZE.size_16,
        color: COLORS.primaryLightGreyHex,
        marginBottom: SPACING.space_4,
    },
    KindOuterContainer: {
        justifyContent: 'flex-end',
        flexDirection: 'row',
        gap: SPACING.space_15,
        paddingVertical: 10
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
    titleMenuAdmin: {
        fontSize: FONTSIZE.size_20,
        fontFamily: FONTFAMILY.poppins_semibold,
        color: COLORS.primaryWhiteHex,
    },
    containerMenuAdmin: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        flex: 2,
    },
    ScreenContainer: {
        backgroundColor: COLORS.primaryBlackHex,
        flex: 1,
    },
    SizeText: {
        fontFamily: FONTFAMILY.poppins_medium,
    },

    text: {
        marginLeft: 10,
        fontSize: 18,
        color: COLORS.secondaryLightGreyHex
    },

    box: {
        flexGrow: 1,
        gap: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primaryBlackRGBA,
        flexDirection: 'column',
        width: 100,
        height: 100,
        borderRadius: BORDERRADIUS.radius_20,
        borderWidth: 2,
        elevation: 1
    },
})