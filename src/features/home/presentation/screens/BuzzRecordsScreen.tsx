import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { X } from 'lucide-react-native';
import { Container, IconButton } from '@components';
import { useBuzzRecordsScreen } from '../../hooks/useBuzzRecordsScreen';
import { BuzzRecordsFlow } from '../components';

export const BuzzRecordsScreen = () => {
  const {
    applySelectedDate,
    backgroundCheckErrors,
    backgroundCheckForm,
    closeDatePicker,
    handleClose,
    handleDatePickerChange,
    handleSubmit,
    isDatePickerVisible,
    maximumDate,
    minimumDate,
    openDatePicker,
    selectedDate,
    setFieldValue,
  } = useBuzzRecordsScreen();

  return (
    <Container
      safeArea
      safeAreaEdges={['top', 'bottom']}
      className="gap-5 bg-bg-default"
    >
      <View className="w-full flex-row items-start justify-start px-3">
        <IconButton
          accessibilityLabel="Close records search"
          className="-ml-3 border-none bg-transparent"
          icon={<X size={24} strokeWidth={2.4} />}
          onPress={handleClose}
        />
      </View>
      <ScrollView className="w-full" showsVerticalScrollIndicator={false}>
        <BuzzRecordsFlow
          errors={backgroundCheckErrors}
          form={backgroundCheckForm}
          onChangeField={setFieldValue}
          onOpenDatePicker={openDatePicker}
          onGoBack={handleClose}
          onSubmit={handleSubmit}
        />
      </ScrollView>

      {isDatePickerVisible && Platform.OS === 'ios' ? (
        <Modal
          transparent
          animationType="fade"
          visible={isDatePickerVisible}
          onRequestClose={closeDatePicker}
        >
          <View className="flex-1 justify-end bg-black/20">
            <View className="rounded-t-6 bg-bg-default px-5 pb-8 pt-4">
              <View className="mb-3 flex-row items-center justify-between">
                <Pressable onPress={closeDatePicker}>
                  <Text className="font-sourceSans-semiBold text-base text-text-secondary">
                    Cancel
                  </Text>
                </Pressable>
                <Pressable onPress={applySelectedDate}>
                  <Text className="font-sourceSans-semiBold text-base text-text-default">
                    Done
                  </Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="spinner"
                maximumDate={maximumDate}
                minimumDate={minimumDate}
                onChange={handleDatePickerChange}
              />
            </View>
          </View>
        </Modal>
      ) : null}

      {isDatePickerVisible && Platform.OS === 'android' ? (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          onChange={handleDatePickerChange}
        />
      ) : null}
    </Container>
  );
};
