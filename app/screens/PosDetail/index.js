import { Image } from 'expo-image'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import useAxios from '../../api/useAxios'
import { IcSmallTable, IlDisableTable } from '../../assets'
import Button from '../../component/Button'
import HeaderBar from '../../component/HeaderBar'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import { getTables } from '../../redux/tableSice'

const PosDetail = ({ navigation }) => {
    const dispatch = useDispatch();
    const { tables } = useSelector(state => state.tablesReducer);
    const [selectedTable, setSelectedTable] = useState({
        id: null,
        table: '',
    });

    const { fetchData: axiosBe } = useAxios();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', getData);
        return unsubscribe;  // Cleanup the listener on unmount or when navigation changes
    }, [navigation, dispatch, axiosBe]);
    const getData = async () => {
        try {
            await dispatch(getTables(axiosBe)).unwrap();
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    console.log(selectedTable, 'xxx')

    return (
        <View style={styles.ScreenContainer}>
            <StatusBar style='light' />
            <HeaderBar />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.ScrollViewFlex}>
                <Text style={styles.ScreenTitle}>
                    Find the best{'\n'}coffee for you
                </Text>
                <View style={{
                    paddingVertical: 15,
                    paddingHorizontal: 15,
                    flexDirection: 'row',
                    gap: 10,
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start',
                    flex: 1,
                }}>
                    {tables.length > 0 && tables.map((item, index) => (
                        <TouchableOpacity
                            key={item.id}
                            onPress={() => {
                                setSelectedTable({ id: item.id, table: item.nomor_meja })
                            }}
                            style={[
                                styles.ContainerTable,
                                selectedTable.id === item.id
                                    ? { backgroundColor: COLORS.secondaryBlackRGBA, borderColor: COLORS.primaryOrangeHex } : { backgroundColor: COLORS.primaryBlackRGBA, borderColor: COLORS.secondaryLightGreyHex },
                            ]}
                        >
                            <View style={[styles.ContainerTableNumber, { zIndex: 1 }]}>
                                {/* <IcTableActive /> */}
                                <Image
                                    source={IlDisableTable}
                                    style={{ height: 147, width: 147 }}
                                />
                            </View>
                            <View style={[styles.ContainerTableNumber, { zIndex: 2 }]}>
                                <Text style={[
                                    styles.NameTable,
                                    selectedTable.id === item.id ?
                                        { color: COLORS.primaryOrangeHex } : { color: COLORS.secondaryLightGreyHex }
                                ]}>{item.nomor_meja}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            <View style={{
                position: 'absolute',
                bottom: '5%',
                backgroundColor: COLORS.primaryOrangeHex,
                justifyContent: 'center',
                alignItems: 'center',
                flex: 2,
                width: '100%',
                height: '12%',
                gap: SPACING.space_10
            }}>
                <View style={{ flexDirection: 'row', gap: SPACING.space_10 }}>
                    <IcSmallTable />
                    <Text style={{
                        fontSize: FONTSIZE.size_14,
                        fontFamily: FONTFAMILY.poppins_semibold
                    }}>Table <Text style={{
                        marginLeft: 10,
                        fontFamily: FONTFAMILY.poppins_semibold,
                        color: COLORS.primaryWhiteHex
                    }}>
                            {selectedTable.table}
                        </Text>
                    </Text>
                </View>
                <Button text="Select and Continue" textColor={COLORS.primaryWhiteHex} onPress={() => { closeModal() }} color={COLORS.secondaryBlackRGBA} />
            </View>
        </View >
    )
}

export default PosDetail

const styles = StyleSheet.create({
    ScrollViewFlex: {
        flexGrow: 1,
    },
    ContainerTable: {
        width: 165,
        height: 164,
        borderRadius: BORDERRADIUS.radius_20 + 5,
        position: 'relative',
        borderWidth: 2,

    },
    ContainerTableNumber: {
        borderRadius: 10,
        position: 'absolute',
        top: 0, // Center vertically
        bottom: 0, // Center horizontally
        left: 0, // Center horizontally
        right: 0, // Center horizontally
        justifyContent: 'center',
        alignItems: 'center',
    },

    NameTable: {
        fontSize: FONTSIZE.size_18,
        fontFamily: FONTFAMILY.poppins_semibold,
    },

    ScreenContainer: {
        backgroundColor: COLORS.primaryBlackHex,
        flex: 1,
    },
    ScreenTitle: {
        fontSize: FONTSIZE.size_24,
        fontFamily: FONTFAMILY.poppins_semibold,
        color: COLORS.primaryWhiteHex,
        paddingLeft: SPACING.space_15,
    },

})