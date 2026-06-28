import jwt, { type SignOptions } from 'jsonwebtoken';

const SECRET_KEY = import.meta.env.JWT_SECRET;

type JwtPayload = {
  expiresIn?: SignOptions['expiresIn'];
};

export const generateToken = ({ expiresIn }: JwtPayload) => {
  if (!SECRET_KEY) {
    throw new Error('JWT secret key not defined');
  }

  const payload = {
    user: import.meta.env.TOKEN_USER,
    password: import.meta.env.TOKEN_PASSWORD,
  };

  return jwt.sign(payload, SECRET_KEY, { expiresIn: expiresIn || '1h' });
};

let cachedToken: { value: string; expiresAt: number } | null = null;

export function getAuthToken(): string {
  const now = Date.now();

  if (!cachedToken || cachedToken.expiresAt - now < 60_000) {
    const token = generateToken({
      expiresIn: '5m',
    });

    cachedToken = {
      value: `Bearer ${token}`,
      expiresAt: now + 5 * 60 * 1000,
    };
  }

  return cachedToken.value;
}
