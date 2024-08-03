import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import { IcCoffee } from '../../assets'
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import CustomIcon from '../CustomIcon'

const Icon = ({ label, focused }) => {
    const { CartList } = useSelector(state => state.orderReducer);
    let countList = CartList.length;
    switch (label) {
        case 'PosTable':
            return focused ?
                <View style={styles.containerMenu}>
                    <CustomIcon
                        name={'table-restaurant'}
                        color={COLORS.primaryOrangeHex}
                        size={FONTSIZE.size_24}
                    />
                    <Text style={{ color: COLORS.primaryOrangeHex }}>Tables</Text>
                </View>
                :
                <View style={styles.containerMenu}>
                    <CustomIcon
                        name={'table-restaurant'}
                        color={COLORS.primaryLightGreyHex}
                        size={FONTSIZE.size_24}
                    />
                    <Text style={{ color: COLORS.primaryLightGreyHex }}>Tables</Text>
                </View>
        case 'PosMenu':
            return focused ?
                <View style={styles.containerMenu}>
                    <CustomIcon
                        name={'menu-book'}
                        color={COLORS.primaryOrangeHex}
                        size={FONTSIZE.size_24}
                    />
                    <Text style={{ color: COLORS.primaryOrangeHex }}>Menu</Text>
                </View>
                :
                <View style={styles.containerMenu}>
                    <CustomIcon
                        name={'menu-book'}
                        color={COLORS.primaryLightGreyHex}
                        size={FONTSIZE.size_24}
                    />
                    <Text style={{ color: COLORS.primaryLightGreyHex }}>Menu</Text>
                </View>
        case 'Orders':
            return focused ?
                <View style={styles.containerMenu}>
                    <CustomIcon
                        name={'shopping-bag'}
                        color={COLORS.primaryOrangeHex}
                        size={FONTSIZE.size_24}
                    />
                    <Text style={{ color: COLORS.primaryOrangeHex }}>Orders</Text>
                </View>
                :
                <View style={styles.containerMenu}>
                    <CustomIcon
                        name={'shopping-bag'}
                        color={COLORS.primaryLightGreyHex}
                        size={FONTSIZE.size_24}
                    />
                    <Text style={{ color: COLORS.primaryLightGreyHex }}>Orders</Text>
                </View>
        default:
            return 'Null'
    }
}
const AdminBottomNavigator = ({ state, descriptors, navigation }) => {
    const focusedOptions = descriptors[state.routes[state.index].key].options;
    if (focusedOptions.tabBarVisible === false) {
        return null;
    }

    return (

        <View style={styles.tabBarStyle}>
            {
                state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            // The `merge: true` option makes sure that the params inside the tab screen are preserved
                            navigation.navigate({ name: route.name, merge: true });
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    return (
                        <Pressable
                            key={index}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={{
                                padding: SPACING.space_15
                            }}
                        >
                            <Icon label={label} focused={isFocused} />
                        </Pressable>
                    );
                })
            }
        </View>
    )
}

export default AdminBottomNavigator

const styles = StyleSheet.create({
    containerMenu: {
        flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
    },
    counterList: {
        position: 'absolute',
        fontFamily: FONTFAMILY.poppins_bold,
        top: 10,
        right: 8,
        bottom: 14,
        fontSize: FONTSIZE.size_16
    },
    tabBarStyle: {
        height: 50,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        position: 'absolute',
        backgroundColor: COLORS.primaryWhiteHex,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.space_28,
        borderTopRightRadius: SPACING.space_20,
        borderTopLeftRadius: SPACING.space_20,
    },
})