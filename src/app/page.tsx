'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Send, User, MessageSquare, Loader2, Check, Trash2 } from 'lucide-react';

const replyStyles = [
  { id: 'humorous', name: '幽默风趣' },
  { id: 'sincere', name: '真诚温暖' },
  { id: 'high-eq', name: '高情商' },
  { id: 'flirty', name: '略带撩人' },
  { id: 'gentle', name: '温柔体贴' },
];

const STORAGE_KEY = 'dating_chat_assistant_data';

interface StorageData {
  chatHistory: string;
  myProfile: string;
  theirProfile: string;
  selectedStyle: string;
}

const stylePrompts: Record<string, string> = {
  humorous: '回复带点幽默感，可以适当调侃、自嘲，让气氛轻松愉快',
  sincere: '真诚自然地表达，像朋友聊天一样，不刻意讨好也不过于拘谨',
  'high-eq': '照顾对方感受的同时表达自己，回复巧妙但不油腻',
  flirty: '适当暧昧一下，用轻松撩人的方式增进感情，但不要太油腻',
  gentle: '语气温柔细腻，多表达关心和在意，让对方感到温暖',
};

export default function DatingChatAssistant() {
  const [chatHistory, setChatHistory] = useState('');
  const [myProfile, setMyProfile] = useState('');
  const [theirProfile, setTheirProfile] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('sincere');
  const [replies, setReplies] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const data: StorageData = JSON.parse(savedData);
      setChatHistory(data.chatHistory || '');
      setMyProfile(data.myProfile || '');
      setTheirProfile(data.theirProfile || '');
      setSelectedStyle(data.selectedStyle || 'sincere');
      setIsSaved(true);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (chatHistory || myProfile || theirProfile) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          chatHistory, myProfile, theirProfile, selectedStyle,
        }));
        setIsSaved(true);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [chatHistory, myProfile, theirProfile, selectedStyle]);

  const clearAllData = () => {
    if (confirm('确定要清空所有数据吗？')) {
      setChatHistory('');
      setMyProfile('');
      setTheirProfile('');
      setReplies([]);
      localStorage.removeItem(STORAGE_KEY);
      setIsSaved(false);
    }
  };

  const generateReply = async () => {
    if (!chatHistory.trim()) {
      setError('请输入聊天记录');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setReplies([]);

    try {
      const response = await fetch('/api/doubao-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatHistory,
          myProfile,
          theirProfile,
          selectedStyle,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `API错误: ${response.status}`);
      }

      const data = await response.json();
      setReplies(data.replies || []);

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '生成失败';
      setError(errorMsg);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyReply = async (index: number, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold text-slate-800 mb-2 tracking-tight">
            聊天助手
          </h1>
          <p className="text-sm text-slate-500">
            AI 帮你生成高情商回复
            {isSaved && <span className="text-emerald-600 ml-2">· 已自动保存</span>}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 左侧输入 */}
          <div className="space-y-6">
            {/* 聊天记录 */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium text-slate-700 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-teal-500" />
                  聊天记录
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="对方：你好啊&#10;我：你好呀&#10;对方：在干嘛？"
                  className="min-h-[140px] resize-none border-slate-200 focus:border-teal-400 focus:ring-teal-400"
                  value={chatHistory}
                  onChange={(e) => setChatHistory(e.target.value)}
                />
              </CardContent>
            </Card>

            {/* 人设 */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium text-slate-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-teal-500" />
                  人设信息
                  <span className="text-xs font-normal text-slate-400 ml-1">可选</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="你的性格特点"
                  className="border-slate-200 focus:border-teal-400 focus:ring-teal-400"
                  value={myProfile}
                  onChange={(e) => setMyProfile(e.target.value)}
                />
                <Input
                  placeholder="TA 的信息"
                  className="border-slate-200 focus:border-teal-400 focus:ring-teal-400"
                  value={theirProfile}
                  onChange={(e) => setTheirProfile(e.target.value)}
                />
              </CardContent>
            </Card>

            {/* 风格选择 */}
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="pt-5">
                <Tabs value={selectedStyle} onValueChange={setSelectedStyle}>
                  <TabsList className="w-full h-9 bg-slate-100 border border-slate-200">
                    {replyStyles.map((style) => (
                      <TabsTrigger 
                        key={style.id} 
                        value={style.id} 
                        className="text-sm data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm"
                      >
                        {style.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>

            {/* 按钮 */}
            <div className="flex gap-3">
              <Button
                onClick={generateReply}
                disabled={isGenerating || !chatHistory.trim()}
                className="flex-1 h-10 bg-teal-600 hover:bg-teal-700 text-white font-medium shadow-sm"
              >
                {isGenerating ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />生成中...</>
                ) : (
                  <><Send className="w-4 h-4 mr-2" />生成回复</>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={clearAllData} 
                className="h-10 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              >
                <Trash2 className="w-4 h-4 text-slate-500" />
              </Button>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* 右侧回复 */}
          <Card className="border-slate-200 shadow-sm min-h-[500px]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium text-slate-700">
                AI 回复建议
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isGenerating && replies.length === 0 && (
                <div className="flex flex-col items-center justify-center h-[360px] text-slate-400">
                  <MessageSquare className="w-12 h-12 mb-3 text-slate-200" />
                  <p className="text-sm">输入聊天记录，点击生成</p>
                </div>
              )}
              
              {!isGenerating && replies.length > 0 && (
                <div className="space-y-3">
                  {replies.map((reply, i) => (
                    <div key={i} className="p-4 bg-white border border-slate-200 rounded-lg hover:border-teal-300 hover:shadow-sm transition-all">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <div className="text-xs font-medium text-teal-600 mb-2">
                            方案 {i + 1}
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{reply}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => copyReply(i, reply)}
                          className="h-8 w-8 hover:bg-slate-100"
                        >
                          {copiedIndex === i ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-slate-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
