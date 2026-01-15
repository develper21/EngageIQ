import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Lightbulb, TrendingUp, MessageCircle, Target, BarChart3, Clock, Users } from 'lucide-react';
import { useState } from 'react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const suggestions = [
  { icon: TrendingUp, text: "Analyze my engagement trends" },
  { icon: Lightbulb, text: "Suggest content ideas" },
  { icon: MessageCircle, text: "Review my recent posts" },
  { icon: TrendingUp, text: "Optimize posting schedule" },
  { icon: Target, text: "Why did my last post perform poorly?" },
  { icon: BarChart3, text: "Compare Reels vs Carousels performance" },
  { icon: Clock, text: "Best time to post this week?" },
  { icon: Users, text: "Analyze my follower growth" }
];

const strategicInsights = [
  {
    type: 'engagement',
    title: 'Engagement Pattern Detected',
    insight: 'Your video content receives 3.2x more engagement than static posts. Audience is most active on Tuesdays and Thursdays 7-9 PM.',
    recommendation: 'Focus on creating more video content and schedule important posts for Tuesday/Thursday evenings.',
    confidence: 92
  },
  {
    type: 'content',
    title: 'Content Opportunity',
    insight: 'Your carousel posts about "how-to" topics perform 45% better than other content types.',
    recommendation: 'Create a weekly "how-to" carousel series to maintain high engagement.',
    confidence: 87
  },
  {
    type: 'timing',
    title: 'Optimal Posting Window',
    insight: 'Your audience engagement peaks at 8:15 PM on weekdays, with highest activity on Instagram.',
    recommendation: 'Schedule your most important content for 8:00-8:30 PM on weekdays, prioritizing Instagram.',
    confidence: 95
  }
];

export default function AIAssistant() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI social media assistant. I can help you analyze your performance, suggest content ideas, and optimize your social media strategy. Here are my latest insights for you:",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Add strategic insights to initial message
  useEffect(() => {
    const insightsMessage: Message = {
      id: '2',
      content: generateStrategicInsights(),
      role: 'assistant',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, insightsMessage]);
  }, []);

  const generateStrategicInsights = () => {
    return `
🎯 **STRATEGIC INSIGHTS FOR THIS WEEK**

📈 **Engagement Pattern Analysis:**
Your video content receives 3.2x more engagement than static posts. Peak activity: Tuesday & Thursday 7-9 PM.

💡 **Content Recommendation:**
"How-to" carousels perform 45% better than other content. Consider creating a weekly educational series.

⏰ **Optimal Timing:**
Schedule important posts for 8:00-8:30 PM on weekdays, prioritizing Instagram for maximum reach.

📊 **Performance Alert:**
Your recent Reel about "social media tips" is trending 50% above your average engagement rate.

---
Ask me anything about these insights or for specific recommendations!
    `;
  };

  const analyzeQuery = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    // Engagement analysis
    if (lowerQuery.includes('engagement') || lowerQuery.includes('perform')) {
      if (lowerQuery.includes('last') && lowerQuery.includes('post')) {
        return "Your last post (Instagram Reel about 'social media tips') performed 50% above average with 3.2K engagements. The high performance is due to: 1) Trending topic, 2) Optimal posting time (8:15 PM), 3) Video format. Recommendation: Create follow-up content within 24 hours to capitalize on momentum.";
      }
      return "Your overall engagement rate is 4.8%, above the industry average of 3.2%. Video content drives 68% of your total engagement. I recommend focusing more on Reels and educational carousels.";
    }
    
    // Content comparison
    if (lowerQuery.includes('reels') && lowerQuery.includes('carousels')) {
      return "Reels outperform carousels by 39% in engagement rate (8.9% vs 6.4%). However, carousels generate 2.3x more saves and shares. Strategy: Use Reels for reach and carousels for value-driven content that encourages saves.";
    }
    
    // Timing analysis
    if (lowerQuery.includes('time') || lowerQuery.includes('schedule')) {
      return "Based on your audience behavior: Best posting times are Tuesday & Thursday 7-9 PM (peak engagement), Wednesday 12-2 PM (high reach), Sunday 4-6 PM (weekend engagement). Your audience is 65% more active on Instagram during these times.";
    }
    
    // Content ideas
    if (lowerQuery.includes('content') || lowerQuery.includes('idea')) {
      return "Based on your top-performing content, I suggest: 1) 'How-to' series about social media marketing, 2) Behind-the-scenes of your content creation process, 3) Trend analysis posts in your niche. These formats align with your audience's preferences.";
    }
    
    // Poor performance analysis
    if (lowerQuery.includes('poor') || lowerQuery.includes('bad') || lowerQuery.includes('fail')) {
      return "Analyzing your recent underperforming posts: Common issues include 1) Posting outside optimal hours, 2) Generic captions without CTA, 3) Inconsistent branding. Recommendations: Post between 7-9 PM, include clear calls-to-action, maintain consistent visual style.";
    }
    
    // Fallback response
    return "I can help you analyze engagement patterns, compare content performance, suggest optimal posting times, and provide content recommendations. Would you like me to analyze any specific aspect of your social media performance?";
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: analyzeQuery(input),
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col min-h-screen ml-64">
        <DashboardHeader />
        
        <main className="flex-1 p-6 overflow-hidden">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">AI Assistant</h1>
              <p className="text-muted-foreground">Get personalized insights and recommendations for your social media strategy</p>
            </div>

            {/* Chat Container */}
            <Card className="flex-1 flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  AI Conversation
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-primary" />
                          </div>
                        )}
                        
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>

                        {message.role === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-primary" />
                        </div>
                        <div className="bg-muted rounded-lg p-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Suggestions */}
                {messages.length === 1 && (
                  <div className="p-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-3">Quick suggestions:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion, index) => {
                        const Icon = suggestion.icon;
                        return (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestion(suggestion.text)}
                            className="text-xs"
                          >
                            <Icon className="w-3 h-3 mr-1" />
                            {suggestion.text}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask me anything about your social media..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      className="flex-1"
                    />
                    <Button onClick={handleSend} disabled={!input.trim() || isTyping}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
