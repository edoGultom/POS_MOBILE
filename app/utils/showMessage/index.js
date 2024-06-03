import { showMessage as showToast } from 'react-native-flash-message';
import { COLORS } from '../../config';

export const showMessage = (message, type) => {
  showToast({
    message,
    type: type === 'success' ? 'success' : 'danger',
    backgroundColor: type === 'success' ? COLORS.primaryOrangeHex : COLORS.primaryRedHex,
  });
};
