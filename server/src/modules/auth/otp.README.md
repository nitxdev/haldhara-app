# Phone OTP integration

OTP service scaffold only. It currently stores challenges in memory and does not send SMS.
Before real use, implement a verified SMS provider, persistent shared storage, per-phone/IP rate limits, resend cooldowns, and audit-safe logging. Do not use this scaffold as production authentication.
