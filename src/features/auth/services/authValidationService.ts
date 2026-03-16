export const EMAIL_ADDRESS_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const authValidationService = {
  normalizeEmail(email: string) {
    return email.trim();
  },

  isValidEmail(email: string) {
    return EMAIL_ADDRESS_PATTERN.test(this.normalizeEmail(email));
  },

  createEmptyCodeDigits(length: number) {
    return Array.from({ length }, () => '');
  },

  sanitizeVerificationDigit(value: string) {
    return value.replace(/\D/g, '').slice(-1);
  },

  isVerificationCodeComplete(digits: string[]) {
    return digits.every((digit) => digit.length === 1);
  },

  joinVerificationCode(digits: string[]) {
    return digits.join('');
  },
};
