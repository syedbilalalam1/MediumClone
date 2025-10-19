import { Router } from 'express';

const router = Router();

// POST /api/chat - Handle AI chat requests
router.post('/', async (req, res) => {
  try {
    const { message, conversation = [] } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('🤖 AI Chat request:', { message, conversationLength: conversation.length });

    // Prepare messages for OpenRouter API
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful AI assistant integrated into a Medium-like blogging platform. Help users with writing, content creation, and general questions about the platform.'
      },
      ...conversation.slice(-10), // Keep last 10 messages for context
      {
        role: 'user',
        content: message
      }
    ];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Medium Clone AI Chat'
      },
      body: JSON.stringify({
        model: 'qwen/qwen3-235b-a22b:free',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from OpenRouter API');
    }

    const aiResponse = data.choices[0].message.content;
    
    console.log('✅ AI response generated:', aiResponse.substring(0, 100) + '...');
    
    res.json({ 
      response: aiResponse,
      usage: data.usage 
    });

  } catch (error) {
    console.error('❌ Chat API error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat request',
      details: error.message 
    });
  }
});

export default router;
