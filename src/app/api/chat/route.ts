import { NextRequest } from 'next/server';
import { LLMClient, Config } from 'coze-coding-dev-sdk';

// 使用 Node.js runtime
export const maxDuration = 10;

// 回复风格对应的提示词
const stylePrompts: Record<string, string> = {
  humorous: '回复带点幽默感，可以适当调侃、自嘲，让气氛轻松愉快',
  sincere: '真诚自然地表达，像朋友聊天一样，不刻意讨好也不过于拘谨',
  'high-eq': '照顾对方感受的同时表达自己，回复巧妙但不油腻',
  flirty: '适当暧昧一下，用轻松撩人的方式增进感情，但不要太油腻',
  gentle: '语气温柔细腻，多表达关心和在意，让对方感到温暖',
};

export async function POST(request: NextRequest) {
  try {
    const { chatHistory, myProfile, theirProfile, style } = await request.json();

    if (!chatHistory) {
      return new Response(JSON.stringify({ error: '请提供聊天记录' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 构建系统提示词
    const systemPrompt = `你是一个相亲聊天助手，你的核心任务是**扮演用户本人**来回复消息。

## 核心原则
你生成的回复要像用户自己说的一样，不要有AI的机械感，不要像写作文，要像真人发微信。

## 分析用户的说话风格
仔细阅读聊天记录中"我"说的每一句话，分析：
- 用词习惯：喜欢用什么词、什么语气词（比如"哈哈"、"嗯嗯"、"呀"、"呢"等）
- 句式特点：喜欢长句还是短句？喜欢用表情吗？
- 表达风格：是活泼外向还是内敛含蓄？说话直接还是委婉？

## 模拟用户语气生成回复
根据分析出的风格，**以用户的身份**回复对方最后一条消息。

## 用户背景信息
${myProfile ? `关于用户：${myProfile}` : ''}
${theirProfile ? `关于对方：${theirProfile}` : ''}

## 当前回复风格
${stylePrompts[style] || stylePrompts.sincere}

## ⚠️ 禁止事项
- 禁止用AI的语气，如"作为一个..."、"建议你可以..."
- 禁止过于书面化
- 禁止回复太长，微信聊天都是短句为主
- 禁止说教，要像朋友聊天

## 输出格式
生成3条回复，用"---"分隔，每条回复口语化、自然。`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      {
        role: 'user' as const,
        content: `这是我和相亲对象的聊天记录：\n${chatHistory}\n\n请分析我的说话风格，然后模拟我的语气，帮我回复对方最后一条消息。生成3个回复供我选择。`,
      },
    ];

    // 初始化 LLM 客户端
    const config = new Config();
    const client = new LLMClient(config);

    // 使用非流式调用
    const response = await client.invoke(messages, {
      temperature: 0.9,
    });

    // 返回结果
    return new Response(JSON.stringify({ content: response.content }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('API Error:', error);
    const errorMsg = error instanceof Error ? error.message : '服务器错误';
    return new Response(JSON.stringify({ error: `生成失败: ${errorMsg}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
