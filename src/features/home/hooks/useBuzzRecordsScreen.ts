import type { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import type {
  BackgroundCheckFormErrors,
  BackgroundCheckFormState,
} from '../models/buzzFlow.types';

const initialFormState: BackgroundCheckFormState = {
  firstName: '',
  middleName: '',
  lastName: '',
  phoneNumber: '',
  dateOfBirth: '',
  state: '',
};

const parseDateString = (value: string) => {
  const [month, day, year] = value.split('/');

  if (!month || !day || !year) {
    return null;
  }

  const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const formatDateForField = (value: Date) => {
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  const year = String(value.getFullYear());

  return `${month}/${day}/${year}`;
};

const MAX_AGE_YEARS = 100;
const MIN_AGE_YEARS = 18;

const getMinimumDate = () => {
  const value = new Date();
  value.setFullYear(value.getFullYear() - MAX_AGE_YEARS);
  return value;
};

const getMaximumDate = () => {
  const value = new Date();
  value.setFullYear(value.getFullYear() - MIN_AGE_YEARS);
  return value;
};

export const useBuzzRecordsScreen = () => {
  const router = useRouter();
  const [backgroundCheckForm, setBackgroundCheckForm] =
    useState<BackgroundCheckFormState>(initialFormState);
  const [backgroundCheckErrors, setBackgroundCheckErrors] =
    useState<BackgroundCheckFormErrors>({});
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [datePickerValue, setDatePickerValue] = useState(getMaximumDate());

  const setFieldValue = (
    field: keyof BackgroundCheckFormState,
    value: string,
  ) => {
    setBackgroundCheckForm((current) => {
      return {
        ...current,
        [field]: value,
      };
    });

    setBackgroundCheckErrors((current) => {
      if (!current[field]) {
        return current;
      }

      return {
        ...current,
        [field]: undefined,
      };
    });
  };

  const openDatePicker = () => {
    setDatePickerValue(
      parseDateString(backgroundCheckForm.dateOfBirth) ?? getMaximumDate(),
    );
    setIsDatePickerVisible(true);
  };

  const closeDatePicker = () => {
    setIsDatePickerVisible(false);
  };

  const handleDatePickerChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (event.type === 'dismissed') {
      closeDatePicker();
      return;
    }

    if (!selectedDate) {
      return;
    }

    setDatePickerValue(selectedDate);

    if (Platform.OS === 'android') {
      setFieldValue('dateOfBirth', formatDateForField(selectedDate));
      closeDatePicker();
    }
  };

  const applySelectedDate = () => {
    setFieldValue('dateOfBirth', formatDateForField(datePickerValue));
    closeDatePicker();
  };

  const handleSubmit = () => {
    const nextErrors: BackgroundCheckFormErrors = {};

    if (!backgroundCheckForm.firstName.trim()) {
      nextErrors.firstName = 'First name is required.';
    }

    if (!backgroundCheckForm.lastName.trim()) {
      nextErrors.lastName = 'Last name is required.';
    }

    if (!backgroundCheckForm.phoneNumber.trim()) {
      nextErrors.phoneNumber = 'Phone number is required.';
    }

    if (!backgroundCheckForm.dateOfBirth.trim()) {
      nextErrors.dateOfBirth = 'Date of birth is required.';
    }

    if (!backgroundCheckForm.state.trim()) {
      nextErrors.state = 'State is required.';
    }

    setBackgroundCheckErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    router.replace('/?backgroundCheck=submitted');
  };

  return {
    backgroundCheckErrors,
    backgroundCheckForm,
    maximumDate: getMaximumDate(),
    minimumDate: getMinimumDate(),
    applySelectedDate,
    closeDatePicker,
    handleClose: () => router.back(),
    handleDatePickerChange,
    handleSubmit,
    isDatePickerVisible,
    openDatePicker,
    setFieldValue,
    selectedDate: datePickerValue,
  };
};
