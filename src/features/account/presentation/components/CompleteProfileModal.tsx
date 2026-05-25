import { Text, View } from 'react-native';
import { BaseModal, CompactButton, Input } from '@components';
import type { FieldStatus } from '../../models/account.types';
import { FieldStatusIcon } from './FieldStatusIcon';

type CompleteProfileModalProps = {
  visible: boolean;
  nickname: string;
  handle: string;
  onChangeNickname: (next: string) => void;
  onChangeHandle: (next: string) => void;
  nicknameStatus: FieldStatus;
  handleStatus: FieldStatus;
  handleReason: string | null;
  isValid: boolean;
  isSaving: boolean;
  onSave: () => void;
};

/**
 * Hard-gate modal: subscribed users without a nickname + handle can't be
 * found by other members in TheBuzz search, so we block search entirely
 * until they fill it in. No Cancel, no backdrop dismiss — the only path
 * out is a successful Save (which flips `isProfileIncomplete` to false
 * and unmounts the modal upstream).
 *
 * Stays dumb (props only) per the presentation-component rule. Form
 * state flows in from `useCompleteProfile` via `useBuzzTab`'s
 * `welcomeProps`.
 */
export const CompleteProfileModal = ({
  visible,
  nickname,
  handle,
  onChangeNickname,
  onChangeHandle,
  nicknameStatus,
  handleStatus,
  handleReason,
  isValid,
  isSaving,
  onSave,
}: CompleteProfileModalProps) => {
  return (
    <BaseModal
      visible={visible}
      contentClassName="max-w-[360px] rounded-4 bg-bg-default p-6 gap-4"
    >
      <Text className="w-full font-poppins-semiBold text-xl leading-tight text-text-default">
        Create a profile to start
      </Text>

      <View className="w-full gap-4">
        <Text className="font-lexend-regular text-base leading-6 text-text-secondary">
          First, create a nickname and an unique handle. This is how
          you&rsquo;ll search for each other.
        </Text>
        <Text className="font-lexend-regular text-base leading-6 text-text-secondary">
          This is what people will see.
        </Text>

        <View className="w-full gap-4 rounded-5 bg-bg-weak p-6">
          <Input
            label="Nickname"
            value={nickname}
            onChangeText={onChangeNickname}
            placeholder="Your nickname"
            rightAccessory={<FieldStatusIcon status={nicknameStatus} />}
          />
          <View className="w-full gap-1">
            <Input
              label="Handle"
              value={handle}
              onChangeText={onChangeHandle}
              placeholder="@yourhandle"
              autoCapitalize="none"
              autoCorrect={false}
              rightAccessory={<FieldStatusIcon status={handleStatus} />}
            />
            {handleStatus === 'error' && handleReason ? (
              <Text className="font-lexend-regular text-xs leading-[18px] text-text-critical">
                {handleReason}
              </Text>
            ) : null}
          </View>
        </View>

        <Text className="text-text-tertiary font-lexend-regular text-xs leading-[18px]">
          You can edit this anytime in the &ldquo;Menu&rdquo; above.
        </Text>
      </View>

      <CompactButton
        label="Save"
        className="self-stretch"
        loading={isSaving}
        disabled={!isValid}
        onPress={onSave}
      />
    </BaseModal>
  );
};
