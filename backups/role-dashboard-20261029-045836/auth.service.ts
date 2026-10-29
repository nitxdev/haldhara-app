import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import OtpChallenge from "../../models/OtpChallenge.js";

function createToken(user: { _id: unknown; role: string }) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");

  return jwt.sign(
    { sub: String(user._id), role: user.role },
    secret,
    {
      expiresIn: "1h",
      issuer: "haldhara-api",
      audience: "haldhara-client"
    }
  );
}

export async function register(input: {
  name: string;
  phone: string;
  password: string;
  role: "farmer" | "buyer" | "transporter" | "expert";
}) {
  const verifiedChallenge = await OtpChallenge.findOne({
    phone: input.phone,
    purpose: "signup",
    verifiedAt: { $ne: null },
    expiresAt: { $gt: new Date() }
  });

  if (!verifiedChallenge) {
    throw Object.assign(
      new Error("Verify your phone number with OTP before registering."),
      { status: 403 }
    );
  }

  if (await User.exists({ phone: input.phone })) {
    throw Object.assign(
      new Error("Phone number already registered"),
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await User.create({
    name: input.name,
    phone: input.phone,
    passwordHash,
    role: input.role
  });

  // Consume the verified challenge after successful account creation.
  await OtpChallenge.deleteOne({ _id: verifiedChallenge._id });

  return {
    user: {
      id: String(user._id),
      name: user.name,
      phone: user.phone,
      role: user.role
    },
    token: createToken(user)
  };
}

export async function login(input: {
  phone: string;
  password: string;
}) {
  const user = await User.findOne({
    phone: input.phone
  }).select("+passwordHash");

  if (
    !user?.passwordHash ||
    !(await bcrypt.compare(input.password, user.passwordHash))
  ) {
    throw Object.assign(
      new Error("Invalid phone or password"),
      { status: 401 }
    );
  }

  return {
    user: {
      id: String(user._id),
      name: user.name,
      phone: user.phone,
      role: user.role
    },
    token: createToken(user)
  };
}
