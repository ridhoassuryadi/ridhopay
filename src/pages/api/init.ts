import type { APIRoute } from 'astro';
import { KVStore } from '../../lib/kv';
import { hashPassword } from '../../lib/auth';

export const GET: APIRoute = async ({ locals }) => {
  const { KV } = locals.runtime.env;
  const kvStore = new KVStore({ KV });

  const users = await kvStore.getUsers();

  if (users.length === 0) {
    await kvStore.createUser({
      username: 'admin',
      password: hashPassword('admin123'),
      role: 'admin',
    });
    
    await kvStore.createUser({
      username: 'guest',
      password: hashPassword('guest123'),
      role: 'guest',
    });
  }

  return new Response(JSON.stringify({ initialized: true, userCount: users.length || 2 }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
