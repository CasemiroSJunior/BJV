import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const secret = '$2b$10$jhH49NbNUTo5Bihx2qEdEe0e9KInSnSVS4q8SCHYIPH/8kmxAPzT6'; // Defina sua chave secreta

export { secret }

export function generateToken(payload: object): string {
  return jwt.sign(payload, secret, { expiresIn: '4h' });
}

export function verifyToken(token: string): object | null {
  try {
    console.log(token)
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
}

const saltRounds = 10; // Número de saltos para o bcrypt (ajuste conforme necessário)

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

export function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

