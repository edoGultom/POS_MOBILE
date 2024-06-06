import React from 'react';
import { Text } from 'react-native';
import NumericFormat from 'react-number-format';

const Numbering = ({ number, style }) => {
  // if (type === 'decimal') {
  //   return (
  //     <NumberFormat
  //       value={number}
  //       displayType="text"
  //       renderText={(value) => <Text style={style}>{value}</Text>}
  //       decimalSeparator="."
  //       decimalScale={1}
  //       fixedDecimalScale
  //     />
  //   );
  // }
  console.log(number)
  return (
    <NumericFormat
      value={number}
      thousandSeparator="."
      displayType="text"
      prefix="IDR "
      renderText={(value) => <Text style={style}>{value}</Text>}
      decimalSeparator=","
    />
  );
};

export default Numbering;
