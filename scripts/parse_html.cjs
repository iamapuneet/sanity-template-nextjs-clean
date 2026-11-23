const fs = require('fs');

const content = fs.readFileSync('C:/Users/Flipshope User/.gemini/antigravity/brain/6b5515af-381b-4d4b-83f5-99d43720649f/.user_uploaded/media_1795416553220_d0e70b87.html', 'utf8');

const regex = /<section class="topic"[^>]*id="([^"]+)"[^>]*data-title="([^"]+)"/g;
let match;
const topics = [];
while ((match = regex.exec(content)) !== null) {
  topics.push({ id: match[1], title: match[2] });
}

console.log('Total Topics:', topics.length);
topics.forEach(t => console.log(`- ${t.id}: ${t.title}`));
