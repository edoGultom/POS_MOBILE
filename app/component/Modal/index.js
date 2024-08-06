import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import CustomIcon from '../CustomIcon'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'

const ModalCustom = ({ visible, headerName, onClose, children }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalView}>
                    <Text style={{ fontSize: FONTSIZE.size_20, fontFamily: FONTFAMILY.poppins_bold }}>Konfirmasi {headerName}</Text>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <CustomIcon
                            name="close"
                            color={COLORS.primaryBlackHex}
                            size={FONTSIZE.size_30}
                        />
                    </TouchableOpacity>
                    <View style={{
                        marginTop: 24,
                        width: '100%',
                    }}>
                        {children}
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default ModalCustom

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: Dimensions.get('window').width - SPACING.space_30 * 3,
        padding: SPACING.space_20,
        backgroundColor: 'white',
        borderRadius: BORDERRADIUS.radius_25,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    closeButton: {
        position: 'absolute',
        top: SPACING.space_12,
        right: SPACING.space_12,
    },
})