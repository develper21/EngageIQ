'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Brain, Send, Sparkles, User, Bot, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
};

// Initial welcome message
const INITIAL_MESSAGES: Message[] = [
    {
        id: '1',
        role: 'assistant',
        content: 'Hello! I am your EngageIQ AI assistant. I can help analyze your engagement, suggest content ideas, or find the best times to post. How can I help you today?',
        timestamp: new Date()
    }
];

export function AIAssistant() {
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!inputValue.trim()) return;

        const newUserMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsLoading(true);

        // Simulate AI response delay
        setTimeout(() => {
            const responses = [
                "Based on your recent data, shorter Reels (under 15s) are performing 20% better. I suggest focusing on quick tips.",
                "Your engagement peaks at 6 PM on weekdays. Try scheduling your next post then!",
                "Great question! I've noticed your carousel posts get more saves than single images. Consider doing a 'Top 5 Tips' carousel.",
                "I analyzed your competitors, and 'Behind the Scenes' content is trending in your niche."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];

            const newAiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: randomResponse,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, newAiMessage]);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <Card className="border-slate-800 bg-slate-900/50 h-[600px] flex flex-col">
            <CardHeader>
                <div className="flex items-center space-x-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Brain className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <CardTitle>AI Marketing Assistant</CardTitle>
                        <CardDescription>Get insights and content strategy in real-time</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="flex-1 overflow-y-auto space-y-4 pr-4">
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "flex items-start space-x-3 max-w-[80%]",
                                message.role === 'user' ? "ml-auto flex-row-reverse space-x-reverse" : ""
                            )}
                        >
                            <div className={cn(
                                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                                message.role === 'assistant' ? "bg-purple-500/10 text-purple-400" : "bg-indigo-500/10 text-indigo-400"
                            )}>
                                {message.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                            </div>
                            <div className={cn(
                                "p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                                message.role === 'assistant'
                                    ? "bg-slate-800 text-slate-200 rounded-tl-none"
                                    : "bg-indigo-600 text-white rounded-tr-none"
                            )}>
                                {message.content}
                            </div>
                        </motion.div>
                    ))}
                    {isLoading && (
                        <div className="flex items-center space-x-2 text-slate-500 text-sm ml-12">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Thinking...</span>
                        </div>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask about your performance..."
                            className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-500"
                        />
                        <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()} className="shrink-0 bg-indigo-600 hover:bg-indigo-700">
                            <Send className="w-4 h-4" />
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
}
