import { supabase } from './supabase';

export async function verifyPassword(password: string): Promise<boolean> {
    const { data, error } = await supabase
        .from('admins')
        .select('password')
        .single();

    if (error || !data) {
        console.error('Error fetching admin password:', error);
        return false;
    }

    // In a real app, you should use a library like bcrypt to compare a hashed password.
    // For this example, we'll do a simple string comparison.
    // This is NOT secure for production use.
    return data.password === password;
}

export function setAdminSession() {
    if (typeof window !== 'undefined') {
        localStorage.setItem('isAdmin', 'true');
    }
}

export function clearAdminSession() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('isAdmin');
    }
}

export function isAdminLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('isAdmin') === 'true';
    }
    return false;
}
