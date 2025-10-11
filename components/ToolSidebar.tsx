'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useTheme } from '@/contexts/ThemeContext';

export default function ToolSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const tools = [
    {
      id: 'proposal-writer',
      name: 'Proposal Writer',
      icon: '📝',
      href: '/tools/proposal-writer'
    },
    {
      id: 'csv-processor',
      name: 'CSV Processor',
      icon: '📊',
      href: '/tools/csv-processor'
    },
    {
      id: 'task-manager',
      name: 'Task Manager',
      icon: '✅',
      href: '/tools/task-manager'
    }
    // Add more tools here as you create them
  ];

  return (
    <div className="flex flex-col h-full bg-secondary border-r" style={{ borderColor: 'var(--border-primary)' }}>
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--border-primary)' }}>
        <Link href="/" className="text-lg font-semibold text-purple hover:opacity-80 transition-opacity">
          Tools
        </Link>
      </div>

      {/* Tool List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              isSelected={pathname === tool.href}
            />
          ))}
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--border-primary)' }}>
        <button
          onClick={toggleTheme}
          className="w-full px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          style={{ 
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-primary)'
          }}
        >
          {theme === 'light' ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <span className="text-sm">Dark Mode</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-sm">Light Mode</span>
            </>
          )}
        </button>
      </div>

      {/* User Profile Section */}
      {user && (
        <div className="border-t p-4" style={{ borderColor: 'var(--border-primary)' }}>
          <div className="mb-3">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--purple-primary)' }}>
                <span className="text-white text-sm font-medium">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                  {user.email}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full px-3 py-2 text-sm text-red-600 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            style={{ backgroundColor: 'var(--bg-tertiary)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}

interface ToolCardProps {
  tool: {
    id: string;
    name: string;
    icon: string;
    href: string;
  };
  isSelected: boolean;
}

function ToolCard({ tool, isSelected }: ToolCardProps) {
  return (
    <Link href={tool.href}>
      <div
        className="p-3 mb-2 rounded-lg border cursor-pointer transition-all duration-200"
        style={{
          backgroundColor: isSelected ? 'var(--purple-light)' : 'var(--bg-primary)',
          borderColor: isSelected ? 'var(--purple-secondary)' : 'var(--border-primary)',
        }}
      >
        <div className="flex items-center space-x-2">
          <span className="text-lg">{tool.icon}</span>
          <h3 
            className="text-sm font-medium"
            style={{ color: isSelected ? 'var(--purple-primary)' : 'var(--text-primary)' }}
          >
            {tool.name}
          </h3>
        </div>
      </div>
    </Link>
  );
}

