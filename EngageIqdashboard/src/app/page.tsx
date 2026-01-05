'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, Users, TrendingUp, MessageSquare, Instagram, Youtube, Twitter, Brain, FileText } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      router.push('/dashboard');
    }
  }, [router]);

  const features = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Multi-Platform Analytics",
      description: "Connect Instagram, YouTube, and X/Twitter to see all your data in one place"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Content Performance Analysis",
      description: "Understand which content performs best with detailed engagement metrics"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Best Time & Frequency",
      description: "AI-powered recommendations for optimal posting times and frequency"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Chat Assistant",
      description: "Ask questions about your performance in natural language and get instant insights"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Reports & Export",
      description: "Generate comprehensive reports and export data for presentations"
    }
  ];

  const platforms = [
    { icon: <Instagram className="w-8 h-8" />, name: "Instagram", color: "text-pink-500" },
    { icon: <Youtube className="w-8 h-8" />, name: "YouTube", color: "text-red-500" },
    { icon: <Twitter className="w-8 h-8" />, name: "X/Twitter", color: "text-blue-400" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Social Media Analytics</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/login')}
                className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium"
              >
                Login
              </button>
              <button
                onClick={() => router.push('/signup')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Data-Driven Content Strategy Optimizer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your social media performance with AI-powered insights. Connect all your platforms, 
            analyze content performance, and get actionable recommendations to grow your audience.
          </p>
        </div>

        <div className="flex justify-center space-x-8 mb-16">
          {platforms.map((platform, index) => (
            <div key={index} className="text-center">
              <div className={`${platform.color} mb-2`}>{platform.icon}</div>
              <span className="text-sm font-medium text-gray-700">{platform.name}</span>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-blue-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Optimize Your Social Media Strategy?</h2>
          <p className="mb-6 text-blue-100">
            Join thousands of creators and marketers who are already using data to drive their content decisions.
          </p>
          <button
            onClick={() => router.push('/signup')}
            className="bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started Free
          </button>
        </div>
      </main>
    </div>
  );
}
