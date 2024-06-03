import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BORDERRADIUS, COLORS, FONTFAMILY, SPACING } from '../../config';

const Button = ({ text, color = COLORS.primaryOrangeHex, textColor = COLORS.primaryWhiteHex, onPress }) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <View style={styles.container(color)}>
        <Text style={styles.text(textColor)}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: (color) => ({
    backgroundColor: color,
    padding: SPACING.space_12,
    borderRadius: BORDERRADIUS.radius_8,
  }),
  text: (color) => ({
    fontSize: 14,
    fontFamily: FONTFAMILY.poppins_medium,
    color: color,
    textAlign: 'center',
  }),
});
