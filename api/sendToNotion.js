export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Only POST requests allowed');
  }

  const notionToken = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;

  const { card_id, card_name, tempo, membro, data } = req.body;

  try {
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionToken}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: {
          "Card ID": { title: [{ text: { content: card_id } }] },
          "Card Name": { rich_text: [{ text: { content: card_name } }] },
          "Tempo": { rich_text: [{ text: { content: tempo } }] },
          "Membro": { rich_text: [{ text: { content: membro } }] },
          "Data": { date: { start: data } }
        }
      })
    });

    const result = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: result });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
