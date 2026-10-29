export type OtpPurpose = "signup" | "login" | "phone-change";

export interface OtpProvider {
  sendCode(phone: string, code: string): Promise<void>;
}
