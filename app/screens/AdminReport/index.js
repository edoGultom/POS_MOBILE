import { BE_API_HOST } from '@env'
import DateTimePicker from '@react-native-community/datetimepicker'
import axios from 'axios'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { Dimensions, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch } from 'react-redux'
import CustomIcon from '../../component/CustomIcon'
import HeaderBar from '../../component/HeaderBar'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import { addLoading } from '../../redux/globalSlice'
import { getData } from '../../utils'

const windowWidth = Dimensions.get('window').width;

const AdminReport = ({ navigation }) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);

    const [dateStart, setDateStart] = useState(new Date());
    const [showStart, setShowStart] = useState(false);

    const [dateEnd, setDateEnd] = useState(new Date());
    const [showEnd, setShowEnd] = useState(false);

    const onChangeStart = (event, selectedDate) => {
        const currentDateStart = selectedDate || dateStart;
        setShowStart(Platform.OS === 'ios');
        setDateStart(currentDateStart);
    };

    const onChangeEnd = (event, selectedDate) => {
        const currentDateEnd = selectedDate || dateEnd;
        setShowEnd(Platform.OS === 'ios');
        setDateEnd(currentDateEnd);
    };

    const formattedDateStart = format(new Date(dateStart), 'dd MMMM yyyy', { locale: id });
    const formattedDateEnd = format(new Date(dateEnd), 'dd MMMM yyyy', { locale: id });
    console.log(data, 'response')

    const getFilter = async (token, data) => {
        dispatch(addLoading(true));
        try {
            const response = await axios.post(`${BE_API_HOST}/report/by-date`, data, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json'
                },
            });
            dispatch(addLoading(false));
            if (response.status === 200) {
                const { data } = response.data
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

    const submitFilter = () => {
        const start = format(new Date(dateStart), 'yyyy-MM-dd', { locale: id });
        const end = format(new Date(dateEnd), 'yyyy-MM-dd', { locale: id });
        console.log(start, end);
        const data = {
            start,
            end
        }
        getData('token').then((res) => {
            getFilter(res.value, data)
        });
    }
    const formatCurrency = (amount, currency) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };
    let total = 0;
    return (
        <View style={styles.ScreenContainer}>
            <StatusBar style='light' />
            <HeaderBar title="Report" onBack={() => navigation.goBack()} />
            <View style={styles.containerFilter}>
                <View style={styles.containerCard}>
                    <TouchableOpacity
                        onPress={() => { setShowStart(true) }}
                        style={styles.btnCard}
                    >
                        <CustomIcon
                            name={'calendar-days'}
                            color={COLORS.primaryOrangeHex}
                            size={FONTSIZE.size_20}
                        />
                        <Text style={{ color: COLORS.primaryWhiteHex, fontFamily: FONTFAMILY.poppins_light }}>{formattedDateStart}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.containerCard}>
                    <TouchableOpacity
                        onPress={() => { setShowEnd(true) }}
                        style={styles.btnCard}
                    >
                        <CustomIcon
                            name={'calendar-days'}
                            color={COLORS.primaryOrangeHex}
                            size={FONTSIZE.size_20}
                        />
                        <Text style={{ color: COLORS.primaryWhiteHex, fontFamily: FONTFAMILY.poppins_light }}>{formattedDateEnd}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.containerCardSubmit}>
                    <TouchableOpacity
                        onPress={submitFilter}
                        style={styles.btnCard}
                    >
                        <CustomIcon
                            name={'searchengin'}
                            color={COLORS.primaryOrangeHex}
                            size={FONTSIZE.size_20}
                        />
                        <Text style={{ color: COLORS.primaryWhiteHex, fontFamily: FONTFAMILY.poppins_semibold }}>Cari Data</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView vertical={true}>
                <View style={styles.container}>
                    {data && data.map((item, idx) => {
                        total += total + item.total_sales_amount;
                        return (
                            <View key={idx} style={{
                                alignItems: 'center',
                                marginHorizontal: 15,
                                // backgroundColor: 'red',
                                flexDirection: 'row',
                                marginVertical: 5
                            }}>
                                <Text style={{ fontFamily: FONTFAMILY.poppins_light, fontSize: FONTSIZE.size_12, width: windowWidth / 4, color: COLORS.primaryWhiteHex }}>{format(item.date, "d MMMM yyyy", { locale: id })}</Text>
                                <Text style={{ fontFamily: FONTFAMILY.poppins_light, fontSize: FONTSIZE.size_12, width: windowWidth / 4, color: COLORS.primaryWhiteHex }}>{item.nama_barang}</Text>
                                <Text style={{ fontFamily: FONTFAMILY.poppins_light, fontSize: FONTSIZE.size_12, width: windowWidth / 4, color: COLORS.primaryWhiteHex }}>{item.total_quantity_sold}</Text>
                                <Text style={{ fontFamily: FONTFAMILY.poppins_light, fontSize: FONTSIZE.size_12, width: windowWidth / 4, color: COLORS.primaryWhiteHex }}>{formatCurrency(item.total_sales_amount, 'IDR')}</Text>
                            </View>
                        )
                    }
                    )}
                </View>
                {data > 0 && (
                    <View style={{
                        marginVertical: 5,
                        flexDirection: 'row',
                        justifyContent: 'space-around'
                    }}>

                        <View style={{
                            alignItems: 'flex-start',
                            // backgroundColor: 'blue',
                            paddingLeft: 15,
                            width: windowWidth / 2
                        }}>
                            <Text style={{
                                color: COLORS.primaryWhiteHex,
                                fontFamily: FONTFAMILY.poppins_semibold,
                                fontSize: FONTSIZE.size_14
                            }}>Total</Text>
                        </View>
                        <View style={{
                            width: windowWidth / 2,
                            alignItems: 'flex-end',
                            // backgroundColor: 'orange',
                            paddingRight: 15
                        }}>
                            <Text style={{
                                fontFamily: FONTFAMILY.poppins_semibold,
                                fontSize: FONTSIZE.size_14,
                                color: COLORS.primaryWhiteHex
                            }}>{formatCurrency(total, 'IDR')}</Text>
                        </View>
                    </View>
                )}

            </ScrollView>
            {showStart && (
                <DateTimePicker
                    value={dateStart}
                    mode="date"
                    display="default"
                    onChange={onChangeStart}
                />
            )}
            {showEnd && (
                <DateTimePicker
                    value={dateEnd}
                    mode="date"
                    display="default"
                    onChange={onChangeEnd}
                />
            )}
        </View>
    )
}

export default AdminReport

const styles = StyleSheet.create({
    container: {
        marginTop: 15,
        // backgroundColor: 'gray'
    },
    box1: {
        flexGrow: 1,
        backgroundColor: 'red',
    },

    containerFilter: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    containerCardSubmit: {
        paddingHorizontal: 15,
        flexDirection: 'row',
        width: Dimensions.get('window').width
    },
    containerCard: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        flexDirection: 'row',
        gap: SPACING.space_15,
        width: (Dimensions.get('window').width / 2)
    },
    btnCard: {
        flexDirection: 'row',
        flex: 1,
        backgroundColor: COLORS.primaryBlackHex,
        alignItems: 'center',
        justifyContent: 'center',
        height: SPACING.space_24 * 2.5,
        borderRadius: BORDERRADIUS.radius_10,
        borderWidth: 2,
        elevation: 1,
        borderColor: COLORS.primaryOrangeHex,
        gap: SPACING.space_15,
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
        elevation: 1,
        borderColor: COLORS.primaryOrangeHex,
    },
    ScreenContainer: {
        flex: 1,
        backgroundColor: COLORS.primaryBlackHex,
        // backgroundColor: COLORS.primaryWhiteHex,
    },
})