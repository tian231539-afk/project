import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 10;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chatHistory, myProfile, theirProfile, selectedStyle } = body;

    if (!chatHistory?.trim()) {
      return NextResponse.json({ error: '请输入聊天记录' }, { status: 400 });
    }

    const stylePrompts: Record<string, string> = {
      humorous: '回复带点幽默感，可以适当调侃、自嘲，让气氛轻松愉快',
      sincere: '真诚自然地表达，像朋友聊天一样，不刻意讨好也不过于拘谨',
      'high-eq': '照顾对方感受的同时表达自己，回复巧妙但不油腻',
      flirty: '适当暧昧一下，用轻松撩人的方式增进感情，但不要太油腻',
      gentle: '语气温柔细腻，多表达关心和在意，让对方感到温暖',
    };

    const systemPrompt = `你是一个相亲聊天助手，模拟用户本人回复消息。

规则：
- 分析用户说话风格（用词、语气、句式）
- 模拟用户身份回复
- 口语化、自然、像真人发微信
- 不要AI语气，不要书面化
- 不要太长，微信风格短句

用户信息：${myProfile || '未提供'}
对方信息：${theirProfile || '未提供'}
回复风格：${stylePrompts[selectedStyle] || '真诚温暖'}

输出3条回复，用"---"分隔。`;

    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.COZE_DOUBAO_API_KEY || 'b9c04fd4-3859-404a-91e6-bb2d702b6f07'}`,
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
      const errorText = await response.text();
      console.error('Doubao API Error:', response.status, errorText);
      
      let errorMessage = `API错误: ${response.status}`;
      try {
        const errData = JSON.parse(errorText);
        errorMessage = errData.error?.message || errorMessage;
      } catch {
        if (errorText) {
          errorMessage = `API错误: ${errorText}`;
        }
      }
      
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    if (!content) {
      console.error('Empty content in response:', data);
      return NextResponse.json({ error: '未生成回复内容' }, { status: 500 });
    }

    const parts = content.split('---').map((p: string) => p.trim()).filter(Boolean);
    const replies = parts.length > 0 ? parts : [content];

    return NextResponse.json({ replies });

  } catch (error) {
    console.error('Chat API Error:', error);
    const errorMessage = error instanceof Error ? error.message : '生成失败，请稍后重试';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
