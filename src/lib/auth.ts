import type { AstroCookies } from 'astro';

const SESSION_COOKIE = 'session';
const SESSION_EXPIRY = 7 * 24 * 60 * 60 * 1000;

export interface Session {
  userId: string;
  username: string;
  role: 'admin' | 'guest';
  expiresAt: number;
}

export function createSession(userId: string, username: string, role: 'admin' | 'guest'): string {
  const session: Session = {
    userId,
    username,
    role,
    expiresAt: Date.now() + SESSION_EXPIRY,
  };
  return btoa(JSON.stringify(session));
}

export function parseSession(token: string): Session | null {
  try {
    const session: Session = JSON.parse(atob(token));
    if (session.expiresAt < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export function getSession(cookies: AstroCookies): Session | null {
  const token = cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return parseSession(token);
}

export function setSessionCookie(cookies: AstroCookies, session: Session): void {
  const token = btoa(JSON.stringify(session));
  cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: SESSION_EXPIRY / 1000,
    path: '/',
  });
}

export function clearSessionCookie(cookies: AstroCookies): void {
  cookies.delete(SESSION_COOKIE, { path: '/' });
}

export function hashPassword(password: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'astorjs-salt-2024');
  return btoa(String.fromCharCode(...new Uint8Array(data)));
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

const GUEST_COOKIE = 'guest_id';

export function getOrCreateGuestSession(cookies: AstroCookies): { userId: string; username: string } {
  let guestId = cookies.get(GUEST_COOKIE)?.value;
  
  if (!guestId) {
    guestId = crypto.randomUUID();
    cookies.set(GUEST_COOKIE, guestId, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60,
      path: '/',
    });
  }
  
  return {
    userId: guestId,
    username: 'Tamu',
  };
}
