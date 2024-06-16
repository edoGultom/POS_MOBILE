import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, FlatList, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { IcCoffeeOff, IcCoffeeOn, IcNonCoffeeOff, IcNonCoffeeOn } from '../../assets'
import CoffeCard from '../../component/CoffeeCard'
import CustomIcon from '../../component/CustomIcon'
import HeaderBar from '../../component/HeaderBar'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import { getMenu } from '../../redux/menuSlice'
import { addToChartList } from '../../redux/orderSlice'
import { getData } from '../../utils'

const IconTextView = ({ iconName, text, onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.box,
                { borderColor: COLORS.primaryOrangeHex }
            ]}>

            <CustomIcon
                name={iconName}
                color={COLORS.primaryOrangeHex}
                size={FONTSIZE.size_30}
            />
            <Text
                style={[
                    styles.SizeText,
                    {
                        fontSize: FONTSIZE.size_18,
                    },
                    { color: COLORS.primaryOrangeHex }
                ]}>
                {text}
            </Text>
        </TouchableOpacity>
    );
}
const Admin = ({ navigation }) => {
    const ListRef = useRef();
    const dispatch = useDispatch();
    const { menus } = useSelector(state => state.menuReducer);
    const { isLoading } = useSelector(state => state.globalReducer);

    const [catgoryMenu, setCategoryMenu] = useState({
        index: 0,
        category: 'Coffee',
    });
    const [sortedMenu, setSortedMenu] = useState(null);
    const getMenuList = (category, data) => {
        let coffeelist = data?.filter((item) => item.nama_kategori == category) || [];
        return coffeelist;
    };
    useEffect(() => {
        navigation.addListener('focus', () => {
            getDataMenu();
        });
    }, [navigation]);

    useEffect(() => {
        setSortedMenu([...getMenuList(catgoryMenu.category, menus)])
    }, [menus]);

    const getDataMenu = () => {
        getData('token').then((res) => {
            dispatch(getMenu(res.value))
        });
    };

    const navMenu = [
        {
            key: 1,
            label: 'Menu',
            icon: 'pen-to-square',
            onPress: () => {
                navigation.navigate('AdminMenu')
            },
        },
        {
            key: 2,
            label: 'POS',
            icon: 'shop',
            onPress: () => {
                navigation.navigate('AdminOrder')
            },
        },
        {
            key: 3,
            label: 'Laporan',
            icon: 'print',
            onPress: () => {
                navigation.navigate('AdminReport')
            },
        },
        {
            key: 4,
            label: 'Stok',
            icon: 'box-open',
            onPress: () => {
                navigation.navigate('AdminStok')
            },
        },
        {
            key: 5,
            label: 'Riwayat',
            icon: 'chart-simple',
            onPress: () => {
                // setMenuIndex({ index: 4, menu: 'Riwayat' });
            },
        },

    ]

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

    const CoffeCardAddToCart = (item) => {
        const { id, nama_barang, path, nama_kategori, harga } = item
        const data = {
            id, nama_barang, path, nama_kategori, harga
        }
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
            <HeaderBar />
            <View style={{
                paddingVertical: 15,
                paddingHorizontal: 15,
                flexDirection: 'row',
                gap: 10,
                flexWrap: 'wrap',
                justifyContent: 'center',
                flex: 1
            }}>
                {
                    navMenu.map((item) => (
                        <IconTextView key={item.key} index={item.key} iconName={item.icon} text={item.label} onPress={item.onPress} />
                    ))
                }
            </View>
            <View style={styles.containerMenuAdmin}>
                <Text style={styles.titleMenuAdmin}>Coffee Available</Text>
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
                                id={item.id}
                                link={item.path}
                                name={item.nama_barang}
                                kind={item.nama_kategori}
                                price={item.harga}
                                buttonPressHandler={() => CoffeCardAddToCart(item)}
                            />
                        );
                    }}
                />

            </View>

        </View>
    )
}

export default Admin

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