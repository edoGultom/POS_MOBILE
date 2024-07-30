import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config';
import { IcCoffeeOff, IcCoffeeOn, IcNonCoffeeOff, IcNonCoffeeOn } from '../../assets';
import useAxios from '../../api/useAxios';
import { StatusBar } from 'expo-status-bar';
import CoffeCard from '../../component/CoffeeCard'
import HeaderBar from '../../component/HeaderBar';
import { getMenu } from '../../redux/menuSlice';

const PosMenu = ({ navigation }) => {
    const ListRef = useRef();
    const dispatch = useDispatch();
    const { menus } = useSelector(state => state.menuReducer);
    const [sortedMenu, setSortedMenu] = useState(null);
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
    ];
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', getDataMenu);
        return unsubscribe;  // Cleanup the listener on unmount or when navigation changes
    }, [navigation, dispatch, axiosBe]);

    const getMenuList = (category, data) => {
        let coffeelist = data?.filter((item) => item.nama_kategori == category) || [];
        return coffeelist;
    };
    useEffect(() => {
        setSortedMenu([...getMenuList(catgoryMenu.category, menus)])
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
    return (
        <View style={styles.ScreenContainer}>
            <StatusBar style='light' />
            <HeaderBar />
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
                    onRefresh={fetchDatas}
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
                    renderItem={({ item, }) => {
                        return (
                            <CoffeCard
                                id={`${item.id}-${item.temperatur}`}
                                link={item.path}
                                name={item.nama_barang}
                                kind={item.nama_kategori}
                                price={item.harga}
                                buttonPressHandler={(valCheck) => CoffeCardAddToCart(item, valCheck)}
                            />
                        );
                    }}
                />

            </View>

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