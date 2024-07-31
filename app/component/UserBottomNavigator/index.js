import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { IcCoffee } from '../../assets'
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import CustomIcon from '../CustomIcon'
import { useSelector } from 'react-redux'

const Icon = ({ label, focused }) => {
    const { CartList } = useSelector(state => state.orderReducer);
    let countList = CartList.length;
    switch (label) {
        case 'Home':
            return focused ?
                <CustomIcon
                    name={'home'}
                    color={COLORS.primaryOrangeHex}
                    size={FONTSIZE.size_20}
                />
                :
                <CustomIcon
                    name={'home'}
                    color={COLORS.primaryLightGreyHex}
                    size={FONTSIZE.size_20}
                />
        case 'Order':
            return <View
                style={{
                    marginTop: -40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 65,
                    width: 65,
                    backgroundColor: 'white',
                    borderRadius: 50,
                    elevation: 5,
                    position: 'relative'
                }}
            >
                <Text style={[
                    styles.counterList,
                    countList > 0
                        ? { color: COLORS.primaryOrangeHex }
                        : { color: COLORS.primaryRedHex },
                ]}>
                    +{CartList.length}
                </Text>
                <View style={{ position: 'absolute', top: 2, left: 0, bottom: 0 }}>
                    <IcCoffee />
                </View>
            </View >
        case 'Profile':
            return focused ?
                <CustomIcon
                    name={'supervised-user-circle'}
                    color={COLORS.primaryOrangeHex}
                    size={FONTSIZE.size_20}
                /> :
                <CustomIcon
                    name={'supervised-user-circle'}
                    color={COLORS.primaryLightGreyHex}
                    size={FONTSIZE.size_20}
                />
        default:
            return 'Null'
    }
}
const UserBottomNavigator = ({ state, descriptors, navigation }) => {
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

export default UserBottomNavigator

const styles = StyleSheet.create({
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