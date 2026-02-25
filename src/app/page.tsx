'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Copy, Send, Sparkles, User, Heart, MessageCircle, Loader2, Check, Trash2, Save, Settings } from 'lucide-react';

const replyStyles = [
  { id: 'humorous', name: '幽默风趣' },
  { id: 'sincere', name: '真诚温暖' },
  { id: 'high-eq', name: '高情商' },
  { id: 'flirty', name: '略带撩人' },
  { id: 'gentle', name: '温柔体贴' },
];

const STORAGE_KEY = 'dating_chat_assistant_data';
const API_KEY_STORAGE = 'dating_chat_api_key';

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
  const [apiKey, setApiKey] = useState('b9c04fd4-3859-404a-91e6-bb2d702b6f07');
  const [showSettings, setShowSettings] = useState(false);

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
    const savedApiKey = localStorage.getItem(API_KEY_STORAGE);
    if (savedApiKey) {
      setApiKey(savedApiKey);
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

  const saveApiKey = () => {
    localStorage.setItem(API_KEY_STORAGE, apiKey);
    setShowSettings(false);
    setError(null);
  };

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
    if (!apiKey.trim()) {
      setError('请先配置 API Key');
      setShowSettings(true);
      return;
    }
    setIsGenerating(true);
    setError(null);
    setReplies([]);
    const systemPrompt = `你是一个相亲聊天助手，模拟用户本人回复消息。
规则：
- 分析用户说话风格（用词、语气、句式）
- 模拟用户身份回复
- 口语化、自然、像真人发微信
- 不要AI语气，不要书面化
- 不要太长，微信风格短句
用户信息：${myProfile || '未提供'}
对方信息：${theirProfile || '未提供'}
回复风格：${stylePrompts[selectedStyle]}
输出3条回复，用"---"分隔。`;

    try {
      const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'doubao-seed-2-0-mini-260215',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `聊天记录：\n${chatHistory}\n\n请模拟我的语气回复对方最后一条消息，生成3个回复方案。` },
          ],
          temperature: 0.9,
          max_tokens: 500,
        }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || `API错误: ${response.status}`);
      }
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      const parts = content.split('---').map((p: string) => p.trim()).filter(Boolean);
      setReplies(parts.length > 0 ? parts : [content]);
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-7 h-7 text-pink-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
              聊天助手
            </h1>
            <Sparkles className="w-5 h-5 text-amber-500" />
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)} className="ml-2">
              <Settings className="w-5 h-5 text-gray-500" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            AI 帮你生成高情商回复
            {isSaved && <span className="text-green-600 ml-2">· 已自动保存</span>}
          </p>
        </div>
        {showSettings && (
          <Card className="mb-4 border-amber-200 bg-amber-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="w-4 h-4" />
                API 配置
              </CardTitle>
              <CardDescription>
                需要配置豆包 API Key 才能使用（
                <a href="https://console.volcengine.com/ark" target="_blank" className="text-pink-600 underline">
                  点击获取
                </a>
                ）
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input type="password" placeholder="输入豆包 API Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="flex-1" />
                <Button onClick={saveApiKey} className="bg-pink-500 hover:bg-pink-600">保存</Button>
              </div>
              <p className="text-xs text-gray-500">API Key 保存在浏览器本地，不会上传到服务器</p>
            </CardContent>
          </Card>
        )}
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-pink-500" />
                  聊天记录
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea placeholder="对方：你好啊\n我：你好呀\n对方：在干嘛？" className="min-h-[150px] resize-none" value={chatHistory} onChange={(e) => setChatHistory(e.target.value)} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="w-4 h-4 text-pink-500" />
                  人设信息（可选）
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="你的性格特点" value={myProfile} onChange={(e) => setMyProfile(e.target.value)} />
                <Input placeholder="TA 的信息" value={theirProfile} onChange={(e) => setTheirProfile(e.target.value)} />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <Tabs value={selectedStyle} onValueChange={setSelectedStyle}>
                  <TabsList className="w-full grid grid-cols-5 h-9">
                    {replyStyles.map((style) => (
                      <TabsTrigger key={style.id} value={style.id} className="text-xs">{style.name}</TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
            <div className="flex gap-2">
              <Button onClick={generateReply} disabled={isGenerating || !chatHistory.trim()} className="flex-1 h-11 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
                {isGenerating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />思考中...</> : <><Send className="w-4 h-4 mr-2" />生成回复</>}
              </Button>
              <Button variant="outline" onClick={clearAllData} className="px-3">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
          </div>
          <Card className="min-h-[400px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                AI 回复建议
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isGenerating && replies.length === 0 && (
                <div className="flex flex-col items-center justify-center h-[280px] text-gray-400">
                  <Heart className="w-12 h-12 mb-3 text-pink-200" />
                  <p>输入聊天记录，点击生成</p>
                </div>
              )}
              {!isGenerating && replies.length > 0 && (
                <div className="space-y-2">
                  {replies.map((reply, i) => (
                    <div key={i} className="p-3 bg-pink-50 rounded-lg border border-pink-100">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <Badge className="mb-1 bg-pink-100 text-pink-700">方案{i + 1}</Badge>
                          <p className="text-sm whitespace-pre-wrap">{reply}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => copyReply(i, reply)}>
                          {copiedIndex === i ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-pink-500" />}
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
