const fs = require('fs');
const path = require('path');

const srcPath = 'C:/Users/Flipshope User/.gemini/antigravity/brain/6b5515af-381b-4d4b-83f5-99d43720649f/.user_uploaded/media_1795416553220_d0e70b87.html';
const raw = fs.readFileSync(srcPath, 'utf8');

// Parse quiz questions from raw
const quizMatch = raw.match(/const QUIZ = {([\s\S]*?)};\s*\n/);
let quizData = {};
if (quizMatch) {
  try {
    const fn = new Function('return {' + quizMatch[1] + '}');
    quizData = fn();
  } catch (e) {
    console.error('Quiz parse error:', e);
  }
}

// Topics regex
const topicRegex = /<section class="topic" id="([^"]+)" data-title="([^"]+)">([\s\S]*?)<\/section>/g;
let match;
const topicsMap = {};

while ((match = topicRegex.exec(raw)) !== null) {
  const id = match[1];
  const title = match[2];
  let inner = match[3];

  // Extract Q&As
  const qaMatches = [...inner.matchAll(/<details class="qa">\s*<summary>(?:<span class="m">([^<]+)<\/span>)?([\s\S]*?)<\/summary>\s*<div class="ans">([\s\S]*?)<\/div>\s*<\/details>/g)];
  const qas = qaMatches.map(m => ({
    marks: m[1] ? m[1].trim() : '2M',
    q: m[2].trim(),
    a: m[3].trim()
  }));

  // Remove simulators and quiz placeholders from inner html since they will be rendered as native React components
  const hasCpuSim = inner.includes('id="simCPU"');
  const hasBankerSim = inner.includes('id="simBanker"');
  const hasPageSim = inner.includes('id="simPage"');
  const hasQuiz = inner.includes('class="sim quiz"');

  // Clean inner html: remove details.qa, simulators, quizzes, and markdone from raw string
  let cleanHtml = inner
    .replace(/<details class="qa">[\s\S]*?<\/details>/g, '')
    .replace(/<div class="sim" id="simCPU">[\s\S]*?<\/div>\s*<\/div>/g, '')
    .replace(/<div class="sim" id="simBanker">[\s\S]*?<\/div>\s*<\/div>/g, '')
    .replace(/<div class="sim" id="simPage">[\s\S]*?<\/div>\s*<\/div>/g, '')
    .replace(/<div class="sim quiz"[\s\S]*?<\/div>\s*<\/div>/g, '')
    .replace(/<label class="markdone">[\s\S]*?<\/label>/g, '')
    .trim();

  topicsMap[id] = {
    id,
    title,
    html: cleanHtml,
    qas,
    hasCpuSim,
    hasBankerSim,
    hasPageSim,
    hasQuiz
  };
}

const units = [
  {
    id: 'u1',
    number: 1,
    title: 'Unit 1: Introduction & Process Management',
    desc: 'OS types, structures, system calls, system boot, processes, threads, IPC, and CPU scheduling.',
    topics: ['u1-intro', 'u1-structure', 'u1-services', 'u1-syscall', 'u1-process', 'u1-ipc', 'u1-threads', 'u1-cpusched', 'u1-qa'].map(id => topicsMap[id]),
    quiz: quizData.u1 || []
  },
  {
    id: 'u2',
    number: 2,
    title: 'Unit 2: Process Synchronization, Deadlocks & Memory Management',
    desc: 'Critical section problem, semaphores, classical sync problems, monitors, Banker\'s algorithm, paging, segmentation, and virtual memory page replacement.',
    topics: ['u2-cs', 'u2-sem', 'u2-monitor', 'u2-deadlock', 'u2-mem', 'u2-paging', 'u2-vm', 'u2-qa'].map(id => topicsMap[id]),
    quiz: quizData.u2 || []
  },
  {
    id: 'u3',
    number: 3,
    title: 'Unit 3: Open Source Software & Linux Basics',
    desc: 'Linux architecture, kernel vs shell, file system, inode structure, superblock, standard commands, process management, signals, and system calls.',
    topics: ['u3-intro', 'u3-arch', 'u3-fs', 'u3-cmds', 'u3-process', 'u3-syscalls', 'u3-qa'].map(id => topicsMap[id]),
    quiz: quizData.u3 || []
  },
  {
    id: 'u4',
    number: 4,
    title: 'Unit 4: Shell Programming & Scripting',
    desc: 'Shell types, redirection, pipes, vi & emacs editors, variables, control statements, find command, shell script examples, filters (grep, sed, awk), and C programming.',
    topics: ['u4-shell', 'u4-io', 'u4-editors', 'u4-vars', 'u4-control', 'u4-find', 'u4-c', 'u4-qa'].map(id => topicsMap[id]),
    quiz: quizData.u4 || []
  },
  {
    id: 'u5',
    number: 5,
    title: 'Unit 5: Linux System Administration & Management',
    desc: 'File listing, ownership, access permissions (chmod), user & group management, booting, boot loaders (GRUB), init system, and shutdown process.',
    topics: ['u5-ls', 'u5-perm', 'u5-users', 'u5-boot', 'u5-qa', 'final-qa'].map(id => topicsMap[id]).filter(Boolean),
    quiz: quizData.u5 || []
  }
];

const tsOutput = `// Auto-generated comprehensive Operating System study material data for Next.js

export interface QAItem {
  marks: string
  q: string
  a: string
}

export interface TopicData {
  id: string
  title: string
  html: string
  qas: QAItem[]
  hasCpuSim?: boolean
  hasBankerSim?: boolean
  hasPageSim?: boolean
  hasQuiz?: boolean
}

export interface UnitData {
  id: string
  number: number
  title: string
  desc: string
  topics: TopicData[]
  quiz: Array<{
    q: string
    o: string[]
    a: number
    exp?: string
  }>
}

export const OS_STUDY_UNITS: UnitData[] = ${JSON.stringify(units, null, 2)};
`;

const dest = path.join(__dirname, '..', 'frontend', 'components', 'study', 'StudyUnitsData.ts');
fs.writeFileSync(dest, tsOutput, 'utf8');
console.log('Successfully written StudyUnitsData.ts, size:', (fs.statSync(dest).size / 1024).toFixed(1), 'KB');
