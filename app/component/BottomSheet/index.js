import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { COLORS, SPACING } from '../../config';

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
        <View style={{ flex: 1 }}>
            <BottomSheetModal
                ref={ref}
                snapPoints={calculateSnapPoints()}
                {...rest}
            >
                <View ref={contentRef} onLayout={onLayoutContent} style={styles.content}>
                    {children}
                </View>
            </BottomSheetModal >
        </View>
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
