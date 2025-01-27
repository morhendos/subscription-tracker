import { AuthError } from './validation';
import { CustomUser, UserRole } from '@/types/auth';

interface StoredUser extends Omit<CustomUser, 'id'> {
  id: string;
  hashedPassword: string;
}

const USERS_STORAGE_KEY = 'st_users';

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

function getStoredUsers(): StoredUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error('Error reading users from storage:', error);
    return [];
  }
}

function saveUsers(users: StoredUser[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to storage:', error);
  }
}

export async function authenticateUser(
  email: string,
  password: string,
  usersJson?: string
): Promise<CustomUser> {
  let users: StoredUser[] = [];

  try {
    if (usersJson) {
      users = JSON.parse(usersJson);
    } else {
      users = getStoredUsers();
    }

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      throw new AuthError('No account found with this email. Please check your email or create a new account.', 'invalid_credentials');
    }

    if (!comparePasswords(password, user.hashedPassword)) {
      throw new AuthError('Incorrect password. Please try again.', 'invalid_credentials');
    }

    const { hashedPassword, ...safeUserData } = user;
    return safeUserData;

  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError('Something went wrong. Please try again.', 'invalid_credentials');
  }
}

export async function registerUser(
  email: string,
  password: string,
  name?: string
): Promise<CustomUser> {
  const users = getStoredUsers();
  
  if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
    throw new AuthError('This email is already registered. Please use a different email or log in.', 'email_exists');
  }

  const newUser: StoredUser = {
    id: generateUserId(),
    email,
    name: name || email.split('@')[0],
    hashedPassword: hashPassword(password),
    roles: [{ id: '1', name: 'user' }],
  };

  users.push(newUser);
  saveUsers(users);

  const { hashedPassword, ...safeUserData } = newUser;
  return safeUserData;
}