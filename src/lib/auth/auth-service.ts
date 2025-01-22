import { AuthError } from './validation';
import { CustomUser, UserRole } from '@/types/auth';

interface StoredUser extends Omit<CustomUser, 'id'> {
  id: string;
  hashedPassword: string;
}

const USERS_JSON = process.env.USERS_JSON || '[]';

function generateUserId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function hashPassword(password: string): string {
  // In a real app, use bcrypt or similar
  return Buffer.from(password).toString('base64');
}

function comparePasswords(plain: string, hashed: string): boolean {
  return hashPassword(plain) === hashed;
}

function parseUsers(usersJson: string): StoredUser[] {
  try {
    const users = JSON.parse(usersJson || USERS_JSON);
    if (!Array.isArray(users)) {
      throw new Error('Users data must be an array');
    }
    return users;
  } catch (error) {
    console.error('Error parsing users:', error);
    return [];
  }
}

export async function authenticateUser(
  email: string,
  password: string,
  usersJson?: string
): Promise<CustomUser> {
  const users = parseUsers(usersJson || '');
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    // Create new user
    const newUser: StoredUser = {
      id: generateUserId(),
      email,
      name: email.split('@')[0],
      hashedPassword: hashPassword(password),
      roles: [],
    };

    users.push(newUser);

    // In a real app, save to database
    console.log('Created new user:', { id: newUser.id, email: newUser.email });

    const { hashedPassword, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  // Verify password
  if (!comparePasswords(password, user.hashedPassword)) {
    throw new AuthError('Invalid password', 'invalid_credentials');
  }

  const { hashedPassword, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function getUserRoles(userId: string): Promise<UserRole[]> {
  const users = parseUsers('');
  const user = users.find(u => u.id === userId);
  return user?.roles || [];
}