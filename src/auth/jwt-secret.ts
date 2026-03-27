export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();

  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV === 'test') {
    return 'test_jwt_secret';
  }

  throw new Error('JWT_SECRET environment variable is required');
}
