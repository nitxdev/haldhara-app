import type { OtpChannel } from "./otp-provider.types.js";

const enabledChannels = new Set<OtpChannel>(["sms"]);

export function isOtpChannel(value: string): value is OtpChannel {
  return value === "sms" || value === "call" || value === "whatsapp";
}

export function isOtpChannelEnabled(channel: OtpChannel): boolean {
  if (channel === "sms") {
    return Boolean(process.env.TWOFACTOR_API_KEY);
  }

  if (channel === "call") {
    return process.env.TWOFACTOR_VOICE_ENABLED === "true";
  }

  if (channel === "whatsapp") {
    return process.env.WHATSAPP_OTP_ENABLED === "true";
  }

  return enabledChannels.has(channel);
}

export function getAvailableOtpChannels(): OtpChannel[] {
  return (["sms", "call", "whatsapp"] as const).filter(isOtpChannelEnabled);
}
