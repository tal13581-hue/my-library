export default async function handler(req, res) {
  const { author } = req.query;

  if (!author) {
    return res.status(400).json({ error: 'Author name required' });
  }

  try {
    const slug = author.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
    const url = `https://www.brainyquote.com/authors/${slug}-quotes`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (!response.ok) {
      return res.status(404).json({ error: `BrainyQuote HTTP ${response.status}` });
    }

    const html = await response.text();
    const quotes = parseBrainyQuotes(html);

    if (!quotes.length) {
      return res.status(404).json({ error: 'No quotes found on BrainyQuote' });
    }

    return res.status(200).json({ quotes, source: 'BrainyQuote' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

function decodeEntities(s) {
  return s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

function parseBrainyQuotes(html) {
  const results = [];
  const regex = /class="[^"]*\bb-qt\b[^"]*"[^>]*>([\s\S]*?)<\/(?:a|span|div)>/gi;
  let m;
  while ((m = regex.exec(html)) && results.length < 20) {
    const text = decodeEntities(m[1].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
    if (text.length >= 25 && text.length <= 400) {
      results.push({ text, book: '' });
    }
  }
  return results;
}
