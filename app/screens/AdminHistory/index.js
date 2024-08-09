import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useDispatch } from 'react-redux'
import useAxios from '../../api/useAxios'
import HeaderBar from '../../component/HeaderBar'
import OrderHistory from '../../component/OrderHistory'
import { COLORS, FONTSIZE } from '../../config'
import { addLoading } from '../../redux/globalSlice'
import { getData } from '../../utils'

const AdminHistory = ({ navigation }) => {
    const dispatch = useDispatch();
    const [data, setData] = useState(null);
    const { fetchData: axiosBe } = useAxios();

    const getOrderHistory = async () => {
        dispatch(addLoading(true));
        try {
            const response = await axiosBe({
                url: `/riwayat/order`,
                method: "GET",
            })

            dispatch(addLoading(false));
            if (response.status) {
                const { data } = response
                setData(data)
            } else {
                dispatch(addLoading(false));
                // console.error('Response not okay');
            }
        } catch (error) {
            dispatch(addLoading(false));
            console.error('Error: ', error);
        }
    }
    useEffect(() => {
        getOrderHistory();
    }, [])

    console.log(data, 'datax')
    return (
        <View style={styles.ScreenContainer}>
            <StatusBar style='light' />
            <HeaderBar title="Order History" onBack={() => navigation.goBack()} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.ScrollViewFlex}>
                <View
                    style={[styles.ScrollViewInnerView]}>
                    <View style={styles.ItemContainer}>
                        {data ? data.map((item, idx) => (
                            <OrderHistory
                                key={idx}
                                detail={item.detail}
                                price={item.jumlah}
                                date={item.waktu_pembayaran}
                            />
                        )) : (
                            <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: FONTSIZE.size_18, color: COLORS.primaryLightGreyHex }}>Tidak ada item yang tersedia</Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default AdminHistory

const styles = StyleSheet.create({
    ItemContainer: {
        flex: 1,
    },
    ScrollViewInnerView: {
        flex: 1,
        justifyContent: 'space-between',
    },
    ScrollViewFlex: {
        flexGrow: 1,
    },
    ScreenContainer: {
        flex: 1,
        backgroundColor: COLORS.primaryBlackHex,
        // backgroundColor: COLORS.primaryWhiteHex,
    },
})