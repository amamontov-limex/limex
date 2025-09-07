import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for client-side usage
});

export async function sendMessageToOpenAI(messages: Array<{role: 'user' | 'assistant', content: string}>): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant for Limex, a fintech platform for traders. You help users with investment goals, trading strategies, and platform features. Be concise and professional. Do not greet the user with 'Hello' or similar greetings. Respond directly to their question or request."
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

