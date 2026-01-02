import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useSupabaseAuth() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Supabase auth state changed:', event, session?.user?.id);

        if (event === 'SIGNED_IN' && session?.user) {
          // Transform Supabase user to match your interface
          const user = {
            id: session.user.id,
            email: session.user.email || '',
            firstName: session.user.user_metadata?.firstName || 'Anonymous',
            lastName: session.user.user_metadata?.lastName || 'User',
            profileImageUrl: session.user.user_metadata?.avatar_url || null,
          };

          queryClient.setQueryData(['supabase-auth'], user);
        } else if (event === 'SIGNED_OUT') {
          queryClient.setQueryData(['supabase-auth'], null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return {
    initialize: async () => {
      // Check for existing session on app start
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const user = {
          id: session.user.id,
          email: session.user.email || '',
          firstName: session.user.user_metadata?.firstName || 'Anonymous',
          lastName: session.user.user_metadata?.lastName || 'User',
          profileImageUrl: session.user.user_metadata?.avatar_url || null,
        };
        queryClient.setQueryData(['supabase-auth'], user);
      }
    },
  };
}
