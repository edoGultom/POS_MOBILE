import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomIcon from '../CustomIcon';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config';

const ItemListMenu = ({ text, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.text}>{text}</Text>
        <CustomIcon
          name="caret-right"
          color={COLORS.primaryWhiteHex}
          size={FONTSIZE.size_10}
        />
      </View>
    </TouchableOpacity>
  );
};

export default ItemListMenu;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.space_10,
  },
  text: { fontSize: FONTSIZE.size_14, fontFamily: FONTFAMILY.poppins_regular, color: COLORS.primaryWhiteHex },
});
