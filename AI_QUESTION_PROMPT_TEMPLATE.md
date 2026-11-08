# 📋 AI Question Generator Prompt & JSON Format Guide

यह Prompt Template आप **ChatGPT**, **Claude**, या **Gemini** में Copy-Paste कर सकते हैं। AI आपको सीधे ExamForge के Standard JSON Format में Questions generate करके देगा, जिसे आप `mock_data` फोल्डर में रख सकते हैं या सीधे चैट में Paste कर सकते हैं।

---

## 🚀 AI को देने के लिए Master Prompt (Copy & Paste This)

```text
You are an expert exam paper setter for the Rajasthan Informatics Assistant (सूचना सहायक - IA) recruitment examination.

Generate high-quality multiple-choice questions (MCQs) in pure JSON format based on the following specifications:

- Exam: Rajasthan Informatics Assistant (IA)
- Subject: [INSERT_SUBJECT_NAME] (e.g. "Reasoning & Mental Ability", "Computer & Information Technology", "Mathematics", "General Knowledge (GK)")
- Topic: [INSERT_TOPIC_NAME] (e.g. "Blood Relation", "Computer Fundamentals", "Networking", "Percentage", "Rajasthan GK")
- Category / Subtopic: [INSERT_CATEGORY_NAME] (e.g. "Basic / One Line Questions", "Direct Relationship", "Memory & Storage")
- Subcategory (Optional): [INSERT_SUBCATEGORY]
- Difficulty: [Easy | Moderate | Hard | Easy to Moderate]
- Number of Questions: [20]
- Language: Hindi (Devanagari script for Hindi/Reasoning/GK, or Hindi/English mix for Computer terms)

RULES:
1. Output ONLY valid, parseable JSON. Do not wrap in markdown quotes if possible, and do not add any greeting or introductory/concluding text.
2. Each question must have exactly 4 options: "A", "B", "C", "D".
3. "correct_answer" must be exactly one letter: "A", "B", "C", or "D".
4. Provide a clear, educational "explanation" in Hindi for every question.
5. Strictly follow this exact JSON schema:

{
  "subject": "Reasoning & Mental Ability",
  "topic": "Blood Relation",
  "category": "Basic / One Line Questions",
  "subcategory": "Direct Relationship",
  "difficulty": "Easy to Moderate",
  "test_title": "Blood Relation (रक्त संबंध) – Level 1 Part 3 Practice Test",
  "questions": [
    {
      "question": "प्रश्न यहाँ लिखें?",
      "options": {
        "A": "विकल्प 1",
        "B": "विकल्प 2",
        "C": "विकल्प 3",
        "D": "विकल्प 4"
      },
      "correct_answer": "B",
      "explanation": "विस्तृत स्पष्टीकरण यहाँ लिखें।"
    }
  ]
}
```

---

## 📁 Questions Save करने की जगह (`mock_data` Folder)

सभी JSON फाइल्स ExamForge के इस फोल्डर में रखी जाती हैं:
```
ExamForge/mock_data/
├── 01_blood_relation_level1_part1.json
├── 02_blood_relation_level1_part2.json
└── 03_your_new_topic.json
```

---

## ⚡ नया JSON Database में Add करने का Automatic तरीका

जब भी आप कोई नया JSON लाएँ, आप बस चैट में JSON paste कर सकते हैं या Terminal में यह एक कमांड चला सकते हैं:

```bash
node database/import_json.mjs mock_data/<your_file_name>.json
```

यह script automatically:
1. Subject और Topic Hierarchy (Subject → Topic → Category → Subcategory) match/create कर देता है।
2. Questions और Options को MySQL Database में UTF-8 Hindi encoding के साथ सुरक्षित insert करता है।
3. Duplicate questions को automatically skip करता है।
4. Student Practice Portal (`http://localhost:3000/practice`) पर नया Test create कर देता है।

