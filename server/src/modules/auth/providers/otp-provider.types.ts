export type OtpChannel = "sms" | "call" | "whatsapp";

export interface OtpDeliveryResult {
  providerSessionId: string;
  message: string;
}

export interface OtpProvider {
  readonly channel: OtpChannel;
  send(phone: string): Promise<OtpDeliveryResult>;
  verify(sessionId: string, code: string): Promise<boolean>;
}
