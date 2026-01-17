import { supabase } from "@/integrations/supabase/client";

export interface UserSubscription {
  email: string;
  plan: 'free' | 'normal' | 'master';
  status: 'active' | 'cancelled' | 'overdue';
  hasAccess: boolean;
}

export const checkSubscription = async (email: string): Promise<UserSubscription | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('email, plan, status')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error || !data) {
      return null;
    }

    // User has access only if status is active and plan is not free
    const hasAccess = data.status === 'active' && data.plan !== 'free';

    return {
      email: data.email,
      plan: data.plan as 'free' | 'normal' | 'master',
      status: data.status as 'active' | 'cancelled' | 'overdue',
      hasAccess
    };
  } catch (error) {
    console.error('Error checking subscription:', error);
    return null;
  }
};
