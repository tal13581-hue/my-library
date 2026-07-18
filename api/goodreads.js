export default async function handler(req, res) {
  const { author } = req.query;

  if (!author) {
    return res.status(400).json({ error: 'Author name required' });
  }

  try {
    const url = `https://www.goodreads.com/quotes/search?q=${encodeURIComponent(author)}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (!response.ok) {
      return res.status(404).json({ error: `Goodreads HTTP ${response.status}` });
    }

    const html = await response.text();
    const quotes = parseGoodreadsQuotes(html, author);

    if (!quotes.length) {
      return res.status(404).json({ error: 'No quotes found on Goodreads' });
    }

    return res.status(200).json({ quotes, source: 'Goodreads' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

function decodeEntities(s) {
  return s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

function parseGoodreadsQuotes(html, author) {
  const results = [];
  const authorLower = author.toLowerCase();
  const blocks = html.split(/<div class="quoteText"[^>]*>/i).slice(1);

  for (const block of blocks.slice(0, 30)) {
    const chunk = block.slice(0, 1000);

    const authorMatch = chunk.match(/class="authorOrTitle"[^>]*>\s*([^<]+?)\s*</i);
    const attributedAuthor = authorMatch ? decodeEntities(authorMatch[1]).trim() : '';
    if (!attributedAuthor) continue;
    if (!attributedAuthor.toLowerCase().includes(authorLower) && !authorLower.includes(attributedAuthor.toLowerCase())) continue;

    let textPart = chunk.split(/<br\s*\/?>/i)[0];
    textPart = decodeEntities(textPart.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
    textPart = textPart.replace(/^[“"]+|[”"]+$/g, '').trim();
    if (textPart.length < 25 || textPart.length > 500) continue;

    const bookMatch = chunk.match(/href="\/work\/quotes[^"]*"[^>]*>\s*([^<]+?)\s*</i);
    const book = bookMatch ? decodeEntities(bookMatch[1]).trim() : '';

    results.push({ text: textPart, book });
  }

  return results;
}
