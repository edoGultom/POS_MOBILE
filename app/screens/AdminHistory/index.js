import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useDispatch } from 'react-redux'
import HeaderBar from '../../component/HeaderBar'
import OrderHistory from '../../component/OrderHistory'
import { COLORS } from '../../config'
import { addLoading } from '../../redux/globalSlice'
import { getData } from '../../utils'
import { BE_API_HOST } from '@env'
import axios from 'axios'

const AdminHistory = ({ navigation }) => {
    const dispatch = useDispatch();
    const [data, setData] = useState(null);

    const getOrderHistory = async (token) => {
        dispatch(addLoading(true));
        try {
            const response = await axios.get(`${BE_API_HOST}/riwayat/order`, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json'
                },
            });
            dispatch(addLoading(false));
            if (response.status === 200) {
                const { data } = response.data
                // console.log(data, 'xdataaaaa')
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
            getOrderHistory(res.value)
        });
    }, [])

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
                        {data && data.map((item, idx) => (
                            <OrderHistory
                                key={idx}
                                detail={item.detail}
                                price={item.jumlah}
                                date={item.tanggal_pembayaran}
                            />
                        ))}
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