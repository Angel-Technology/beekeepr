export type BackgroundCheckFormState = {
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  state: string;
};

export type BackgroundCheckFormErrors = Partial<
  Record<keyof BackgroundCheckFormState, string>
>;

export type BuzzFlow = 'verify' | 'records' | 'active';
