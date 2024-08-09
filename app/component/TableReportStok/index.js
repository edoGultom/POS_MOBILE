import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config';
const windowWidth = Dimensions.get('window').width;
const TableReportStok = ({ data }) => {
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
                        <Text style={styles.tableHeader}>Bahan Baku</Text>
                    </View>
                    <View style={styles.tableCell}>
                        <Text style={styles.tableHeader}>Stok Awal</Text>
                    </View>
                    <View style={styles.tableCell}>
                        <Text style={styles.tableHeader}>Total Penggunaan</Text>
                    </View>
                    <View style={styles.tableCell}>
                        <Text style={styles.tableHeader}>Stok Akhir</Text>
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
                                <Text style={{ color: COLORS.primaryWhiteHex, fontSize: FONTSIZE.size_12, fontFamily: FONTFAMILY.poppins_extralight }}>{item.bahan_baku}</Text>
                            </View>
                            <View style={styles.tableCell}>
                                <Text style={{ color: COLORS.primaryWhiteHex, fontSize: FONTSIZE.size_12, fontFamily: FONTFAMILY.poppins_extralight }}>{item.stok_awal} {item.satuan}</Text>
                            </View>
                            <View style={styles.tableCell}>
                                <Text style={{ color: COLORS.primaryWhiteHex, fontSize: FONTSIZE.size_12, fontFamily: FONTFAMILY.poppins_extralight }}>{item.total_qty_terpakai} {item.satuan}</Text>
                            </View>
                            <View style={styles.tableCell}>
                                <Text style={{ color: COLORS.primaryWhiteHex, fontSize: FONTSIZE.size_12, fontFamily: FONTFAMILY.poppins_extralight }}>{item.stok_akhir} {item.satuan}</Text>
                            </View>
                        </View>
                    ))
                }
            </View>
        </ScrollView>
    )
}

export default TableReportStok

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