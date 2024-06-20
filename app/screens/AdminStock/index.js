import { BE_API_HOST } from '@env'
import axios from 'axios'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useDispatch } from 'react-redux'
import HeaderBar from '../../component/HeaderBar'
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import { addLoading } from '../../redux/globalSlice'
import { getData } from '../../utils'
const windowWidth = Dimensions.get('window').width;

const AdminStock = ({ navigation }) => {
    const dispatch = useDispatch();
    const [data, setData] = useState(null);

    const getFilter = async (token) => {
        dispatch(addLoading(true));
        try {
            const response = await axios.get(`${BE_API_HOST}/stok/current-stock`, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json'
                },
            });
            dispatch(addLoading(false));
            if (response.status === 200) {
                const { data } = response.data
                console.log(data, 'xdataaaaa')
                setData(data)
            } else {
                dispatch(addLoading(false));
                console.error('Response not okay');
            }
        } catch (error) {
            dispatch(addLoading(false));
            console.error('Error: ', error);
        }
    }

    useEffect(() => {
        getData('token').then((res) => {
            getFilter(res.value)
        });

    }, [])

    const formatCurrency = (amount, currency) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <View style={styles.ScreenContainer}>
            <StatusBar style='light' />
            <HeaderBar title="Stok Menu" onBack={() => navigation.goBack()} />
            <ScrollView vertical={true}>
                {data ? (
                    <>
                        <View style={[styles.container]}>
                            <View style={{
                                alignItems: 'center',
                                marginHorizontal: 15,
                                flexDirection: 'row',
                                marginVertical: 5
                            }}>
                                <Text style={{ fontFamily: FONTFAMILY.poppins_light, fontSize: FONTSIZE.size_12, width: windowWidth / 4, color: COLORS.primaryWhiteHex }}>Menu</Text>
                                {/* <Text style={{ fontFamily: FONTFAMILY.poppins_light, fontSize: FONTSIZE.size_12, width: windowWidth / 4, color: COLORS.primaryWhiteHex }}>Stok Awal</Text> */}
                                <Text style={{ fontFamily: FONTFAMILY.poppins_light, fontSize: FONTSIZE.size_12, width: windowWidth / 4, color: COLORS.primaryWhiteHex }}>Masuk</Text>
                                <Text style={{ fontFamily: FONTFAMILY.poppins_light, fontSize: FONTSIZE.size_12, width: windowWidth / 4, color: COLORS.primaryWhiteHex }}>Keluar</Text>
                                <Text style={{ fontFamily: FONTFAMILY.poppins_light, fontSize: FONTSIZE.size_12, width: windowWidth / 4, color: COLORS.primaryWhiteHex }}>Stok Akhir</Text>
                            </View>
                            {data.map((item, idx) => {
                                return (
                                    <View key={item.nama_barang} style={{
                                        alignItems: 'center',
                                        marginHorizontal: 15,
                                        flexDirection: 'row',
                                        marginVertical: 5
                                    }}>
                                        <Text style={{ fontFamily: FONTFAMILY.poppins_light, fontSize: FONTSIZE.size_12, width: windowWidth / 4, color: COLORS.primaryWhiteHex }}>{item.nama_barang}</Text>
                                        {/* <Text style={{ fontFamily: FONTFAMILY.poppins_light, fontSize: FONTSIZE.size_12, width: windowWidth / 4, color: COLORS.primaryWhiteHex }}>{item.stok_awal}</Text> */}
                                        <Text style={{ fontFamily: FONTFAMILY.poppins_light, fontSize: FONTSIZE.size_12, width: windowWidth / 4, color: COLORS.primaryWhiteHex }}>{item.masuk}</Text>
                                        <Text style={{ fontFamily: FONTFAMILY.poppins_light, fontSize: FONTSIZE.size_12, width: windowWidth / 4, color: COLORS.primaryWhiteHex }}>{item.keluar}</Text>
                                        <Text style={{ fontFamily: FONTFAMILY.poppins_light, fontSize: FONTSIZE.size_12, width: windowWidth / 4, color: COLORS.primaryWhiteHex }}>{item.stok_akhir}</Text>
                                    </View>
                                )
                            }
                            )}
                        </View>
                    </>
                ) : (
                    <View style={{ marginTop: SPACING.space_30, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: COLORS.secondaryLightGreyHex, fontSize: FONTSIZE.size_14, fontFamily: FONTFAMILY.poppins_light }}>Data Tidak Ditemukan</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    )
}

export default AdminStock

const styles = StyleSheet.create({

    container: {
        marginTop: SPACING.space_30
        // backgroundColor: 'gray'
    },
    ScreenContainer: {
        flex: 1,
        backgroundColor: COLORS.primaryBlackHex,
        // backgroundColor: COLORS.primaryWhiteHex,
    },
})