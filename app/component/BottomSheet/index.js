import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useMemo, useRef, useState } from 'react';
import { Button, Dimensions, KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import { BORDERRADIUS, COLORS, SPACING } from '../../config';

const BottomSheetCustom = forwardRef(({ children, ...rest }, ref) => {
    const [contentHeight, setContentHeight] = useState(0);
    const contentRef = useRef(null);

    const calculateSnapPoints = useCallback(() => {
        const windowHeight = Dimensions.get('window').height;
        const percentageHeight = (contentHeight / windowHeight) * 100;
        const snapHeight = Math.max(percentageHeight, 25); // Ensure the minimum snap point is 25% of the screen height
        return [`${snapHeight}%`];
    }, [contentHeight]);

    const onLayoutContent = () => {
        if (contentRef.current) {
            contentRef.current.measure((x, y, width, height) => {
                setContentHeight(height);
            });
        }
    };
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <BottomSheetModal
                ref={ref}
                snapPoints={calculateSnapPoints()}
                {...rest}
            >
                <BottomSheetView>
                    <ScrollView>
                        <KeyboardAvoidingView behavior="padding" >
                            <View ref={contentRef} onLayout={onLayoutContent} style={styles.content}>
                                {children}
                            </View>
                        </KeyboardAvoidingView>
                    </ScrollView>
                </BottomSheetView>
            </BottomSheetModal >
        </View >
    );
});
const styles = StyleSheet.create({
    content: {
        flexGrow: 1,
        padding: SPACING.space_16,
        backgroundColor: COLORS.primaryDarkGreyHex,
    },
});
export default BottomSheetCustom;
