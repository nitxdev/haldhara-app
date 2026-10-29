import { createHash } from "node:crypto";
import OtpChallenge from "../../models/OtpChallenge.js";

const API_BASE = "https://2factor.in/API/V1";

function getApiKey(): string {
  const key = process.env.TWOFACTOR_API_KEY;
  if (!key) throw Object.assign(
    new Error("SMS OTP provider is not configured."),
    { status: 503 }
  );
  return key.trim();
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const local = digits.startsWith("91") && digits.length === 12
    ? digits.slice(2)
    : digits;

  if (!/^[6-9]\d{9}$/.test(local)) {
    throw Object.assign(
      new Error("Enter a valid Indian mobile number."),
      { status: 400 }
    );
  }

  return local;
}

function hashSession(sessionId: string): string {
  return createHash("sha256").update(sessionId).digest("hex");
}

export async function requestSignupOtp(phone: string) {
  const key = getApiKey();
  const mobile = normalizePhone(phone);

  const existing = await OtpChallenge.findOne({
    phone, purpose: "signup", verifiedAt: null,
    createdAt: { $gt: new Date(Date.now() - 60_000) }
  });

  if (existing) {
    throw Object.assign(
      new Error("Please wait 60 seconds before requesting another OTP."),
      { status: 429 }
    );
  }

  const url = `${API_BASE}/${encodeURIComponent(key)}/SMS/${mobile}/AUTOGEN`;
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  const data = await response.json() as { Status?: string; Details?: string };

  if (!response.ok || data.Status?.toLowerCase() !== "success" || !data.Details) {
    console.error("2Factor OTP request failed:", data.Status ?? "HTTP error");
    throw Object.assign(
      new Error("OTP could not be sent. Check provider account, balance, and API settings."),
      { status: 502 }
    );
  }

  await OtpChallenge.deleteOne({ phone, purpose: "signup" });
  await OtpChallenge.create({
    phone,
    purpose: "signup",
    codeHash: hashSession(data.Details),
    providerSessionId: data.Details,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    attempts: 0,
    verifiedAt: null
  });

  return { message: "OTP request accepted. Check your SMS inbox." };
}

export async function verifySignupOtp(phone: string, code: string) {
  if (!/^\d{4,8}$/.test(code)) {
    throw Object.assign(new Error("Enter the OTP from your SMS."), { status: 400 });
  }

  const challenge = await OtpChallenge.findOne({
    phone,
    purpose: "signup",
    verifiedAt: null,
    expiresAt: { $gt: new Date() },
    attempts: { $lt: 5 }
  }).select("+providerSessionId +codeHash");

  if (!challenge) {
    throw Object.assign(
      new Error("OTP expired or unavailable. Request a new OTP."),
      { status: 400 }
    );
  }

  challenge.attempts += 1;
  await challenge.save();

  const key = getApiKey();
  const url = `${API_BASE}/${encodeURIComponent(key)}/SMS/VERIFY/${encodeURIComponent(challenge.providerSessionId)}/${encodeURIComponent(code)}`;
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  const data = await response.json() as { Status?: string; Details?: string };

  if (!response.ok || data.Status?.toLowerCase() !== "success") {
    throw Object.assign(new Error("OTP is incorrect or verification failed."), { status: 400 });
  }

  challenge.verifiedAt = new Date();
  await challenge.save();

  return { message: "Phone verified successfully." };
}
