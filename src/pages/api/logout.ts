import type { APIRoute } from 'astro';
import { clearSessionCookie } from '../../lib/auth';

export const POST: APIRoute = ({ cookies }) => {
  clearSessionCookie(cookies);
  return Astro.redirect('/');
};

export const GET: APIRoute = ({ cookies }) => {
  clearSessionCookie(cookies);
  return Astro.redirect('/');
};
