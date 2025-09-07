import OpenAI from 'openai';
import { SYSTEM_PROMPT } from './content';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.OPENAI_API_KEY || 'dummy-key',
  dangerouslyAllowBrowser: true // Only for client-side usage
});

export async function sendMessageToOpenAI(messages: Array<{role: 'user' | 'assistant', content: string}>): Promise<string> {
  console.log('🔍 sendMessageToOpenAI called with messages:', messages);
  
  // Отладочная информация
  console.log('API Key exists:', !!import.meta.env.VITE_OPENAI_API_KEY);
  console.log('API Key length:', import.meta.env.VITE_OPENAI_API_KEY?.length || 0);
  console.log('All env vars:', Object.keys(import.meta.env));
  
  // Проверяем наличие реального API ключа
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.OPENAI_API_KEY;
  console.log('Final API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND');
  
  if (!apiKey || apiKey === 'dummy-key') {
    console.log('❌ No valid API key found');
    return "I'm here to help you with your investment and trading questions! However, I need a valid OpenAI API key to provide AI-powered responses. Please add your API key to the environment variables.";
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        ...messages
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error('OpenAI API error:', error);
    return "Sorry, there was an error processing your request. Please try again.";
  }
}

