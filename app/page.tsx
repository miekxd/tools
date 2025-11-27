import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If user is logged in, redirect to tools
  if (user) {
    redirect('/tools/task-manager');
  }

  const features = [
    {
      icon: '📝',
      title: 'Proposal Writer',
      description: 'Generate professional proposals by analyzing transcript content and component catalog data.'
    },
    {
      icon: '📊',
      title: 'CSV Processor',
      description: 'Process and analyze CSV files with advanced filtering and transformation options.'
    },
    {
      icon: '✅',
      title: 'Task Manager',
      description: 'Organize your tasks with a beautiful black and purple gradient theme.'
    },
    {
      icon: '💼',
      title: 'Insider Dashboard',
      description: 'Track LLM trading calls and monitor insider transaction performance in real-time.'
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'var(--bg-primary)', boxShadow: '0 1px 3px var(--shadow)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple">Tools</h1>
          <div className="flex gap-4">
            <Link
              href="/sign-in"
              className="px-4 py-2 font-medium hover:opacity-80 transition-opacity duration-200"
              style={{ color: 'var(--text-primary)' }}
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="btn-primary"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Your Personal Tool Suite
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Access powerful tools to boost your productivity. Sign up to get started with task management, data processing, and more.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/sign-up"
              className="btn-primary px-8 py-3 text-lg"
            >
              Create Free Account
            </Link>
            <Link
              href="/sign-in"
              className="btn-secondary px-8 py-3 text-lg"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card p-8 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                {feature.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center card p-12">
          <h3 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Ready to get started?
          </h3>
          <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
            Create your free account and start using our tools today.
          </p>
          <Link
            href="/sign-up"
            className="btn-primary inline-block px-8 py-3 text-lg"
          >
            Sign Up Now
          </Link>
        </div>
      </div>
    </div>
  );
}
