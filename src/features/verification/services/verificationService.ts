import { environmentConfig } from '@src/lib/config/environment';
import type {
  StartVerificationInput,
  VerificationLaunchResult,
} from '../models/verification.types';

type PersonaModule = {
  Environment: {
    SANDBOX: unknown;
    PRODUCTION: unknown;
  };
  Inquiry: {
    fromTemplate: (templateId: string) => PersonaTemplateBuilder;
    fromInquiry: (inquiryId: string) => PersonaInquiryBuilder;
  };
};

type PersonaInquiryBuilder = {
  sessionToken: (sessionToken: string) => PersonaInquiryBuilder;
  onComplete: (
    callback: (
      inquiryId: string,
      status: string,
      fields?: Record<string, unknown>,
    ) => void,
  ) => PersonaInquiryBuilder;
  onCanceled: (
    callback: (inquiryId?: string, sessionToken?: string) => void,
  ) => PersonaInquiryBuilder;
  onError: (callback: (error: Error) => void) => PersonaInquiryBuilder;
  build: () => {
    start: () => void;
  };
};

type PersonaTemplateBuilder = PersonaInquiryBuilder & {
  environment: (environment: unknown) => PersonaTemplateBuilder;
  referenceId: (referenceId: string) => PersonaTemplateBuilder;
};

const getPersonaModule = (): PersonaModule => {
  try {
    return require('react-native-persona') as PersonaModule;
  } catch {
    throw new Error(
      'Persona SDK is not installed yet. Add `react-native-persona` before launching verification.',
    );
  }
};

const getPersonaEnvironment = (personaModule: PersonaModule) => {
  return environmentConfig.personaEnvironment === 'production'
    ? personaModule.Environment.PRODUCTION
    : personaModule.Environment.SANDBOX;
};

export const verificationService = {
  async startVerification(
    input: StartVerificationInput,
  ): Promise<VerificationLaunchResult> {
    const personaModule = getPersonaModule();
    const personaEnvironment = getPersonaEnvironment(personaModule);

    return await new Promise<VerificationLaunchResult>((resolve, reject) => {
      const bindCallbacks = (
        builder: PersonaInquiryBuilder | PersonaTemplateBuilder,
      ) => {
        if (input.sessionToken) {
          builder.sessionToken(input.sessionToken);
        }

        return builder
          .onComplete((inquiryId, status, fields) => {
            resolve({
              inquiryId,
              status,
              fields,
            });
          })
          .onCanceled(() => {
            reject(new Error('Verification was canceled before completion.'));
          })
          .onError((error) => {
            reject(error);
          })
          .build();
      };

      if (input.inquiryId) {
        bindCallbacks(
          personaModule.Inquiry.fromInquiry(input.inquiryId),
        ).start();
        return;
      }

      if (!environmentConfig.personaTemplateId) {
        reject(new Error('No Persona inquiry is available yet.'));
        return;
      }

      const builder = personaModule.Inquiry.fromTemplate(
        environmentConfig.personaTemplateId,
      ).environment(personaEnvironment);

      if (input.referenceId) {
        builder.referenceId(input.referenceId);
      }

      bindCallbacks(builder).start();
    });
  },
};
