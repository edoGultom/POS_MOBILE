import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../../config';

// const BottomSheetCustom = ({ refBtnSheet, onClose, children }) => {
const BottomSheetCustom = forwardRef(({ children, onClose }, ref) => {
    // const bottomSheetModalRef = useRef(null);

    // // Membuat fungsi present dan dismiss yang bisa diakses dari komponen induk
    // useImperativeHandle(ref, () => ({
    //     present: () => {
    //         bottomSheetModalRef.current?.present();
    //     },
    //     dismiss: () => {
    //         bottomSheetModalRef.current?.dismiss();
    //     },
    // }));

    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                pressBehavior="close"
                onPress={() => onClose()}
            />
        ),
        []
    );
    const { top, bottom } = useSafeAreaInsets();

    return (
        <BottomSheetModal
            // ref={bottomSheetModalRef}
            ref={ref}
            index={0}
            enableDynamicSizing
            enablePanDownToClose={false}
            backdropComponent={renderBackdrop}
            onDismiss={onClose}
            topInset={top}
            keyboardBehavior={Platform.OS === 'android' ? 'extend' : 'interactive'}
            keyboardBlurBehavior='none'
        >
            <BottomSheetView style={[{
                paddingBottom: bottom,
                backgroundColor: COLORS.primaryDarkGreyHex
            }]}>
                {children}
            </BottomSheetView>
        </BottomSheetModal>
    );
});

const styles = StyleSheet.create({
    contentContainer: {
        gap: 8,
        padding: SPACING.space_12,
        backgroundColor: COLORS.primaryDarkGreyHex,
    },
});

export default BottomSheetCustom;
