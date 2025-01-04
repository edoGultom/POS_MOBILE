import { Image } from 'expo-image'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useDispatch } from 'react-redux'
import { IcWaitingOrder } from '../../assets'
import Button from '../../component/Button'
import { COLORS, FONTFAMILY, FONTSIZE } from '../../config'
import { addToChartList } from '../../redux/orderSlice'

const SuccessOrder = ({ navigation }) => {
    const dispatch = useDispatch();
    const handleReorder = ()=>{
        dispatch(addToChartList([]))
        navigation.replace('MainAppAdmin', { screen: 'PosTable' })
    }
    const handleListOrder =()=>{
        dispatch(addToChartList([]))
        navigation.replace('MainAppAdmin', { screen: 'Orders' })
    }
    return (
        <View style={styles.ScreenContainer}>
            <StatusBar style='light' />
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <View style={{
                    flex: 2,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Image
                        source={IcWaitingOrder}
                        style={{ width: 300, height: 300 }}
                    />
                </View>
                <View style={styles.Content}>
                    <Text style={styles.title}>Kamu Membuat pesanan</Text>
                    <Text style={styles.subTitle}>Tetaplah di sini sementara</Text>
                    <Text style={[styles.subTitle, { marginBottom: 60 }]}>kami menyiapkan kopi atau makanan terbaik Anda</Text>

                    <View style={{ flexDirection: 'column', gap: 12, width: '50%' }}>
                        <View style={styles.buttonContainer}>
                            <Button
                                text="Pesan Lagi"
                                onPress={handleReorder}
                            />
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button
                                text="Lihat Pesanan"
                                onPress={handleListOrder}
                                color={COLORS.secondaryLightGreyHex}
                                textColor='white'

                            />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default SuccessOrder

const styles = StyleSheet.create({
    image: {
        width: '20%'
    },
    Content: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: COLORS.primaryWhiteHex,
    },
    ScreenContainer: {
        flex: 1,
        backgroundColor: COLORS.primaryWhiteHex,
    },
    LottieAnimation: {
        flex: 1,
    },
    title: {
        fontSize: FONTSIZE.size_20,
        fontFamily: FONTFAMILY.poppins_regular,
        color: COLORS.secondaryDarkGreyHex,
        marginBottom: 6
    },
    subTitle: {
        fontSize: FONTSIZE.size_14,
        fontFamily: FONTFAMILY.poppins_regular,
        color: COLORS.secondaryLightGreyHex,
    },
    buttonContainer: {
        width: '100%',
        // paddingHorizontal: 80,
    }
})