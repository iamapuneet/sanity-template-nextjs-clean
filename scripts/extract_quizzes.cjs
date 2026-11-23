const fs = require('fs');
const content = fs.readFileSync('C:/Users/Flipshope User/.gemini/antigravity/brain/6b5515af-381b-4d4b-83f5-99d43720649f/.user_uploaded/media_1795416553220_d0e70b87.html', 'utf8');

const quizBlock = content.match(/const QUIZ = {[\s\S]*?};\s*\n/);
if (quizBlock) {
  console.log(quizBlock[0].slice(0, 500));
} else {
  // Let's search for quiz in script
  const scriptIdx = content.indexOf('<script>');
  if (scriptIdx !== -1) {
    const script = content.slice(scriptIdx);
    const m = script.match(/QUIZ\s*=\s*({[\s\S]*?});/);
    if (m) console.log('QUIZ found:', m[1].slice(0, 500));
    else console.log('QUIZ pattern not found in script');
  }
}
