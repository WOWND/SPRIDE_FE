import { User } from '../types/auth';

export class ProfileService {
  static async getUserProfile(): Promise<User> {
    console.log('API: Fetching user profile...');
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/profile/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const profile = await response.json();
        console.log('User profile fetched successfully:', profile);
        return profile;
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch user profile:', response.status, errorText);
        throw new Error(`Failed to fetch user profile: ${response.status} ${errorText}`);
      }
    } catch (error) {
      console.error('Network error fetching user profile:', error);
      throw new Error('Network error fetching user profile');
    }
  }
} 