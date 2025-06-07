import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function testOpenAI() {
  try {
    console.log('Testing OpenAI connection...');
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Say hello and confirm the connection is working.' }
      ],
      max_tokens: 50,
      temperature: 0.7
    });

    console.log('OpenAI Response:', response.choices[0].message.content);
    console.log('✅ OpenAI connection successful!');
  } catch (error) {
    console.error('❌ OpenAI connection failed:', error.message);
  }
}

testOpenAI();