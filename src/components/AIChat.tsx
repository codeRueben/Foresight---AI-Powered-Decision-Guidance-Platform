import { useState, useRef, useEffect } from 'react';
import { AI_AGENTS } from '@/lib/ai-agents';
import type { ConversationMessage } from '@/types/ai-agents';
import { Send, X, MessageCircle, User, Bot, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface AIChatProps {
  agentId: string;
  decision: string;
  factors: {
    riskTolerance: number;
    financialStability: number;
    disciplineLevel: number;
    supportSystem: number;
  };
  onClose: () => void;
}

export function AIChat({ agentId, decision, factors, onClose }: AIChatProps) {
  const agent = AI_AGENTS.find(a => a.id === agentId);
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      id: 'welcome',
      agentId: agentId,
      content: `Hello! I'm ${agent?.name}, your ${agent?.role}. I've analyzed your decision about "${decision.slice(0, 50)}${decision.length > 50 ? '...' : ''}". What would you like to know more about?`,
      timestamp: new Date(),
      type: 'text',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      agentId: 'user',
      content: input.trim(),
      timestamp: new Date(),
      type: 'text',
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Convert messages to API format
      const messageHistory = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          role: m.agentId === 'user' ? 'user' as const : 'assistant' as const,
          content: m.content,
        }));

      const response = await apiClient.chatWithAgent({
        decision,
        factors,
        agentId,
        messageHistory,
        userMessage: input.trim(),
      });

      const agentResponse: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        agentId: agentId,
        content: response.response,
        timestamp: new Date(),
        type: 'text',
      };

      setMessages(prev => [...prev, agentResponse]);
    } catch (error) {
      const errorResponse: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        agentId: agentId,
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date(),
        type: 'warning',
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getMessageStyle = (type: ConversationMessage['type']) => {
    switch (type) {
      case 'insight':
        return 'border-l-4 border-blue-400 bg-blue-500/10';
      case 'warning':
        return 'border-l-4 border-yellow-400 bg-yellow-500/10';
      case 'suggestion':
        return 'border-l-4 border-green-400 bg-green-500/10';
      default:
        return '';
    }
  };

  if (!agent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl h-[80vh] glass-card-strong flex flex-col overflow-hidden">
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 border-b border-white/10"
          style={{ background: `linear-gradient(135deg, ${agent.color}20, transparent)` }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
              style={{ background: agent.color }}
            >
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg text-foresight-text">{agent.name}</h3>
              <p className="text-xs text-foresight-text-muted">{agent.role}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-foresight-text-muted" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex gap-3 message-enter ${getMessageStyle(message.type)}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {message.agentId === 'user' ? (
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-foresight-text-muted" />
                </div>
              ) : (
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: agent.color }}
                >
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`flex-1 ${message.agentId === 'user' ? 'text-right' : ''}`}>
                <div 
                  className={`inline-block max-w-[85%] p-3 rounded-2xl text-sm ${
                    message.agentId === 'user'
                      ? 'bg-foresight-accent/20 text-foresight-text'
                      : 'glass-card text-foresight-text'
                  }`}
                >
                  {message.content}
                </div>
                <p className="text-xs text-foresight-text-muted/50 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: agent.color }}
              >
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="glass-card inline-flex items-center gap-2 px-4 py-3 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-foresight-text-muted thinking-dot" />
                    <div className="w-2 h-2 rounded-full bg-foresight-text-muted thinking-dot" />
                    <div className="w-2 h-2 rounded-full bg-foresight-text-muted thinking-dot" />
                  </div>
                  <span className="text-xs text-foresight-text-muted">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask ${agent.name} a question...`}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foresight-text placeholder:text-foresight-text-muted/50 focus:outline-none focus:border-foresight-accent/50 focus:ring-2 focus:ring-foresight-accent/20"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="btn-primary px-4 py-3 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-foresight-text-muted/50 mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
