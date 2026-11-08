-- ExamForge Seed Data for Subjects, Topics, and Questions

INSERT IGNORE INTO subjects (id, name, code, description, icon, status) VALUES
(1, 'Reasoning', 'REA-01', 'Verbal, non-verbal, analytical, and logical reasoning for government exams.', 'brain', 'active'),
(2, 'Mathematics', 'MTH-02', 'Quantitative aptitude, arithmetic, algebra, geometry, trigonometry.', 'calculator', 'active'),
(3, 'Computer', 'CMP-03', 'Computer fundamentals, hardware, software, MS Office, networking, cyber security.', 'monitor', 'active'),
(4, 'General Knowledge', 'GK-04', 'Indian Constitution, polity, history, geography, economics.', 'globe', 'active'),
(5, 'General Science', 'SCI-05', 'Everyday physics, chemistry, biology, human physiology.', 'atom', 'active'),
(6, 'Hindi', 'HND-06', 'Hindi grammar, sandhi, samas, muhavare, vilom shabd, paryayvachi.', 'book-open', 'active'),
(7, 'English', 'ENG-07', 'English grammar, vocabulary, idioms, sentence correction, reading comprehension.', 'languages', 'active');

INSERT IGNORE INTO topics (id, subject_id, parent_id, name, code, priority) VALUES
(101, 1, NULL, 'Blood Relation', 'REA-BR', 'high'),
(102, 1, 101, 'Level 1 – High Priority', 'REA-BR-L1', 'high'),
(103, 1, 102, 'Basic / One Line Questions', 'REA-BR-L1-B', 'high'),
(104, 1, 103, 'Direct Relationship', 'REA-BR-L1-B-DIR', 'high'),
(105, 1, 102, 'Coded Blood Relation', 'REA-BR-L1-COD', 'medium'),
(106, 1, 101, 'Level 2 – Puzzle Based', 'REA-BR-L2', 'medium'),
(107, 1, NULL, 'Syllogism', 'REA-SYL', 'high'),
(108, 1, NULL, 'Coding-Decoding', 'REA-COD', 'medium'),
(201, 2, NULL, 'Number System', 'MTH-NUM', 'high'),
(202, 2, 201, 'Divisibility & Remainders', 'MTH-NUM-DIV', 'high'),
(203, 2, NULL, 'Percentage', 'MTH-PCT', 'high'),
(204, 2, 203, 'Profit and Loss', 'MTH-PNL', 'high'),
(205, 2, NULL, 'Time and Work', 'MTH-TNW', 'medium'),
(301, 3, NULL, 'Computer Fundamentals', 'CMP-FND', 'high'),
(302, 3, 301, 'Memory & Storage Hierarchy', 'CMP-MEM', 'high'),
(303, 3, NULL, 'Computer Networks', 'CMP-NET', 'medium'),
(304, 3, 303, 'OSI & TCP/IP Model', 'CMP-OSI', 'high'),
(401, 4, NULL, 'Indian Constitution & Polity', 'GK-POL', 'high'),
(402, 4, 401, 'Fundamental Rights & Duties', 'GK-FR', 'high'),
(403, 4, NULL, 'Modern Indian History', 'GK-HIST', 'medium'),
(501, 5, NULL, 'Human Physiology & Biology', 'SCI-BIO', 'high'),
(502, 5, NULL, 'General Physics & Motion', 'SCI-PHY', 'medium'),
(601, 6, NULL, 'Sandhi & Samas', 'HND-SND', 'high'),
(602, 6, NULL, 'Muhavare & Lokoktiyan', 'HND-MHV', 'medium'),
(701, 7, NULL, 'Error Spotting & Grammar', 'ENG-ERR', 'high'),
(702, 7, NULL, 'Idioms and Phrases', 'ENG-IDM', 'medium');

INSERT IGNORE INTO questions (id, subject_id, topic_id, question_text, question_type, difficulty, status, explanation, marks, negative_marks) VALUES
(1, 1, 104, 'Pointing to a photograph of a boy, Suresh said, "He is the son of the only son of my mother." How is Suresh related to that boy?', 'single_choice', 'easy', 'approved', 'Suresh mother only son is Suresh himself. So, the boy is the son of Suresh. Thus, Suresh is the father of the boy.', 1.00, 0.25),
(2, 1, 104, 'A is B sister. C is B mother. D is C father. E is D mother. Then, how is A related to D?', 'single_choice', 'medium', 'approved', 'A is the sister of B and C is the mother of B, so A is the daughter of C. D is C father, which makes A the granddaughter of D.', 1.00, 0.25),
(3, 1, 105, 'If "P + Q" means P is the father of Q; "P - Q" means P is the sister of Q; "P * Q" means P is the brother of Q. Which of the following means that M is the maternal uncle of N?', 'single_choice', 'hard', 'pending', 'M * K means M is brother of K. K is mother of N. Therefore, M is maternal uncle of N.', 2.00, 0.50),
(4, 2, 203, 'If the price of sugar increases by 25%, by what percentage should a household reduce its consumption so that the total expenditure remains unchanged?', 'single_choice', 'medium', 'approved', 'Reduction % = [r / (100 + r)] * 100 = [25 / 125] * 100 = 20%.', 1.00, 0.25),
(5, 2, 202, 'What is the remainder when 7^84 is divided by 342?', 'single_choice', 'hard', 'pending', '7^3 = 343 = 342 + 1. Hence 7^84 = (7^3)^28 = (342 + 1)^28. Remainder is 1.', 2.00, 0.50),
(6, 3, 301, 'Which unit of the CPU is directly responsible for performing arithmetic and logical comparisons?', 'single_choice', 'easy', 'approved', 'The ALU (Arithmetic Logic Unit) executes mathematical operations and comparisons.', 1.00, 0.25),
(7, 3, 304, 'At which layer of the OSI model does the Internet Protocol (IP) operate?', 'single_choice', 'easy', 'approved', 'IP is a Layer 3 (Network Layer) protocol.', 1.00, 0.25),
(8, 4, 402, 'Which Article of the Indian Constitution is referred to as the "Heart and Soul of the Constitution" by Dr. B.R. Ambedkar?', 'single_choice', 'easy', 'approved', 'Article 32 provides the Right to Constitutional Remedies.', 1.00, 0.25);

INSERT IGNORE INTO question_options (question_id, option_key, option_text, is_correct) VALUES
(1, 'A', 'Brother', 0), (1, 'B', 'Uncle', 0), (1, 'C', 'Father', 1), (1, 'D', 'Cousin', 0),
(2, 'A', 'Grandmother', 0), (2, 'B', 'Granddaughter', 1), (2, 'C', 'Daughter', 0), (2, 'D', 'Aunt', 0),
(3, 'A', 'M * K + N', 0), (3, 'B', 'M - K + N', 0), (3, 'C', 'M * K - N', 0), (3, 'D', 'M * K + N (where K is mother of N)', 1),
(4, 'A', '20%', 1), (4, 'B', '25%', 0), (4, 'C', '16.67%', 0), (4, 'D', '33.33%', 0),
(5, 'A', '1', 1), (5, 'B', '7', 0), (5, 'C', '49', 0), (5, 'D', '341', 0),
(6, 'A', 'Control Unit (CU)', 0), (6, 'B', 'Arithmetic Logic Unit (ALU)', 1), (6, 'C', 'Memory Unit (MU)', 0), (6, 'D', 'Register Array', 0),
(7, 'A', 'Data Link Layer', 0), (7, 'B', 'Transport Layer', 0), (7, 'C', 'Network Layer', 1), (7, 'D', 'Session Layer', 0),
(8, 'A', 'Article 14', 0), (8, 'B', 'Article 19', 0), (8, 'C', 'Article 21', 0), (8, 'D', 'Article 32', 1);

