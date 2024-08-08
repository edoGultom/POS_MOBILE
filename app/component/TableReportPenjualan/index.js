import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config';
const windowWidth = Dimensions.get('window').width;
const TableReportPenjualan = ({ data }) => {
    const summary = data.reduce((total, item) => total + parseInt(item.total), 0);

    return (
        <ScrollView
            style={{
                paddingVertical: 10,
                paddingHorizontal: 10,
            }}
            vertical={true}>
            <View style={styles.table}>
                {/* Table Header */}
                <View style={styles.tableRow}>
                    <View style={styles.tableCell}>
                        <Text style={styles.tableHeader}>Tanggal</Text>
                    </View>
                    <View style={styles.tableCell}>
                        <Text style={styles.tableHeader}>Menu</Text>
                    </View>
                    <View style={styles.tableCell}>
                        <Text style={styles.tableHeader}>Qty</Text>
                    </View>
                    <View style={styles.tableCell}>
                        <Text style={styles.tableHeader}>Harga</Text>
                    </View>
                    <View style={styles.tableCell}>
                        <Text style={styles.tableHeader}>Total sales</Text>
                    </View>
                </View>

                {/* Table Body */}
                {
                    data.map((item, idx) => (
                        <View style={styles.tableRow} key={idx}>
                            <View style={styles.tableCell}>
                                <Text style={{ color: COLORS.primaryWhiteHex, fontSize: FONTSIZE.size_12, fontFamily: FONTFAMILY.poppins_extralight }}>{item.tanggal}</Text>
                            </View>
                            <View style={styles.tableCell}>
                                <Text style={{ color: COLORS.primaryWhiteHex, fontSize: FONTSIZE.size_12, fontFamily: FONTFAMILY.poppins_extralight }}>{item.menu}</Text>
                            </View>
                            <View style={styles.tableCell}>
                                <Text style={{ color: COLORS.primaryWhiteHex, fontSize: FONTSIZE.size_12, fontFamily: FONTFAMILY.poppins_extralight }}>{item.qty}</Text>
                            </View>
                            <View style={styles.tableCell}>
                                <Text style={{ color: COLORS.primaryWhiteHex, fontSize: FONTSIZE.size_12, fontFamily: FONTFAMILY.poppins_extralight }}>IDR {parseInt(item.harga).toLocaleString('id-ID')}</Text>
                            </View>
                            <View style={styles.tableCell}>
                                <Text style={{ color: COLORS.primaryWhiteHex, fontSize: FONTSIZE.size_12, fontFamily: FONTFAMILY.poppins_extralight }}>IDR {parseInt(item.total).toLocaleString('id-ID')}</Text>
                            </View>
                        </View>
                    ))
                }
                {/* Total Keseluruhan */}
                <View style={styles.tableRow}>
                    <View style={[styles.tableCell, { flex: 4.6 }]}>
                        <Text style={styles.tableHeader}>Total</Text>
                    </View>
                    <View style={styles.tableCell}>
                        <Text style={styles.tableHeader}>IDR {summary.toLocaleString('id-ID')}</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default TableReportPenjualan

const styles = StyleSheet.create({
    table: {
        width: windowWidth - 25,
        borderWidth: 1,
        borderColor: COLORS.secondaryLightGreyHex,
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableCell: {
        flex: 1,
        borderWidth: 1,
        borderColor: COLORS.secondaryLightGreyHex,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        color: COLORS.primaryWhiteHex,
        fontSize: FONTSIZE.size_12,
    },
    tableHeader: {
        textAlign: 'center',
        fontFamily: FONTFAMILY.poppins_semibold,
        fontSize: FONTSIZE.size_12,
        textAlign: 'center',
        color: COLORS.primaryWhiteHex,
    },
})