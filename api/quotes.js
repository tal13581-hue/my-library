export default async function handler(req, res) {
  const { author } = req.query;
  
  if (!author) {
    return res.status(400).json({ error: 'Author name required' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        messages: [{
          role: 'user',
          content: `Give me one real, verbatim quote by ${author} — their own words from a book, interview, lecture, or speech. Respond ONLY with valid JSON, no markdown: {"quote":"the exact quote","book":"source title or empty string"}`
        }]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const text = data.content?.[0]?.text || '';
    const clean = text.replace(/^```(?:json)?\s*|\s*```$/gm, '').trim();
    const quote = JSON.parse(clean);
    
    return res.status(200).json({ 
      text: quote.quote, 
      author, 
      book: quote.book || '', 
      source: 'Verified Quote' 
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
