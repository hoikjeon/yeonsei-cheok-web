import type { SupabaseClient } from '@supabase/supabase-js';

export interface ConsultationSubmitInput {
  name: string;
  phone: string;
  message: string;
  consultationType: string;
  preferredDate: string;
  marketingAgreed: boolean;
}

const missingColumnTokens = ['consultation_type', 'preferred_date', 'marketing_agreed'];

const isMissingConsultationColumnError = (message: string) => (
  missingColumnTokens.some((token) => message.includes(token)) ||
  message.includes('schema cache') ||
  message.includes('Could not find')
);

const buildFallbackMessage = (input: ConsultationSubmitInput) => {
  const details = [
    `상담내용: ${input.consultationType}`,
    `희망 날짜: ${input.preferredDate}`,
    `마케팅 수신 동의: ${input.marketingAgreed ? '동의' : '미동의'}`,
  ];

  const message = input.message.trim();
  return message ? `${details.join('\n')}\n\n${message}` : details.join('\n');
};

export const submitConsultation = async (
  supabase: SupabaseClient,
  input: ConsultationSubmitInput
) => {
  const createdAt = new Date().toISOString();
  const basePayload = {
    name: input.name.trim(),
    phone: input.phone.trim(),
    message: input.message.trim(),
    created_at: createdAt,
  };

  const { error } = await supabase
    .from('consultations')
    .insert([
      {
        ...basePayload,
        consultation_type: input.consultationType,
        preferred_date: input.preferredDate || null,
        marketing_agreed: input.marketingAgreed,
      },
    ]);

  if (!error) return { error: undefined };

  if (!isMissingConsultationColumnError(error.message)) {
    return { error: error.message };
  }

  const { error: fallbackError } = await supabase
    .from('consultations')
    .insert([
      {
        ...basePayload,
        message: buildFallbackMessage(input),
      },
    ]);

  return { error: fallbackError?.message };
};
