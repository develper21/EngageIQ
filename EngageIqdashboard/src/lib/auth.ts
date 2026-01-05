import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-prod';

export interface AuthUser {
    id: string;
    email: string;
}

export async function getAuthUser(req: NextRequest): Promise<AuthUser | null> {
    const authHeader = req.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return null;

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
        return decoded;
    } catch (error) {
        return null;
    }
}

export async function requireAuth(req: NextRequest) {
    const user = await getAuthUser(req);
    if (!user) {
        throw new Error('Unauthorized');
    }
    return user;
}
