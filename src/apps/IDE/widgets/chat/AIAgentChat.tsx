import { Code, FileSearch, Send, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { IconButton } from '@/components/Action/role/IconButton';
import { Section } from '@/components/Section/Section.tsx';
import { cn } from '@/lib/utils.ts';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAgentChatProps {
  hideHeader?: boolean;
  className?: string;
}

export const AIAgentChat = ({ hideHeader = false, className = '' }: AIAgentChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI coding assistant. How can I help you today?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: '2',
      role: 'user',
      content: 'Can you explain the layer system in this codebase?',
      timestamp: new Date(Date.now() - 1000 * 60 * 4),
    },
    {
      id: '3',
      role: 'assistant',
      content:
        'Sure! The layer system uses 6 levels (0-5) to create depth:\n\n• Layer 0: Base background\n• Layer 1: Sunken surfaces\n• Layer 2: Default surfaces\n• Layer 3: Elevated elements\n• Layer 4: Floating elements\n• Layer 5: Modals\n\nEach layer has specific colors and shadows defined in tailwind.config.js.',
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm processing your request...",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 500);
  };

  return (
    <div className={cn('flex flex-col overflow-hidden h-full', className)}>
      {!hideHeader && (
        <>
          {/* Header */}
          <div className="flex items-center gap-2 px-3 py-2 bg-layer-1">
            <Sparkles size={16} className="text-accent" />
            <h2 className="text-sm font-semibold text-text">AI Assistant</h2>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-1 px-2 py-1.5 bg-layer-1">
            <button className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-layer-2 layer-1-interactive text-text-secondary">
              <Code size={16} />
              <span>Explain Code</span>
            </button>
            <button className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-layer-2 layer-1-interactive text-text-secondary">
              <FileSearch size={16} />
              <span>Find Files</span>
            </button>
          </div>
        </>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn('flex', {
              'justify-end': message.role === 'user',
              'justify-start': message.role === 'assistant',
            })}
          >
            <Section
              role="Container"
              prominence={message.role === 'user' ? 'Primary' : 'Tertiary'}
              className={cn('max-w-[85%] p-2 rounded-lg', {
                'bg-accent/10': message.role === 'user',
              })}
            >
              <div className="text-xs text-text whitespace-pre-wrap">{message.content}</div>
              <div className="mt-1 text-xs text-text-tertiary">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </Section>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-1 p-2 bg-layer-1 border-t border-border">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask anything..."
          className="flex-1 px-2 py-1.5 text-sm rounded bg-layer-0 text-text placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <IconButton
          size="sm"
          onClick={handleSend}
          className="bg-accent text-white hover:bg-accent-hover"
        >
          <Send size={16} />
        </IconButton>
      </div>
    </div>
  );
};
