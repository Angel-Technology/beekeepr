import { ActivityIndicator } from 'react-native';
import { CircleCheck, CircleX } from 'lucide-react-native';
import type { FieldStatus } from '../../models/account.types';

type FieldStatusIconProps = {
  status: FieldStatus;
};

export const FieldStatusIcon = ({ status }: FieldStatusIconProps) => {
  if (status === 'saving') {
    return <ActivityIndicator size="small" color="rgba(0,0,0,0.5)" />;
  }
  if (status === 'success') {
    return <CircleCheck size={24} color="#00A93E" />;
  }
  if (status === 'error') {
    return <CircleX size={24} color="#FF0000" />;
  }
  return null;
};
