const fs = require('fs');
const content = fs.readFileSync('C:/Users/Flipshope User/.gemini/antigravity/brain/6b5515af-381b-4d4b-83f5-99d43720649f/.user_uploaded/media_1795416553220_d0e70b87.html', 'utf8');

const m = content.match(/const QUIZ = {([\s\S]*?)};\s*\n/);
if (m) {
  fs.writeFileSync('scripts/quiz_data.json', '{\n' + m[1] + '\n}', 'utf8');
  console.log('Saved quiz data');
}
