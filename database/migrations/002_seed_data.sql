-- Seed initial admin users, subjects, topics, and questions
USE examforge;

-- Admin Users
INSERT IGNORE INTO admin_users (id, full_name, email, password_hash, status, created_at)
VALUES 
(1, 'Super Admin', 'admin@examforge.in', '$2a$10$e8V95yQx8zY8R1m2/q7L4O5a0b7n8p9q', 'active', NOW()),
(2, 'Pooja Choudhary (Exam Manager)', 'pooja@examforge.in', '$2a$10$e8V95yQx8zY8R1m2/q7L4O5a0b7n8p9q', 'active', NOW());

INSERT IGNORE INTO admin_role_map (admin_id, role_id)
VALUES 
(1, 1),
(2, 4);

-- Complete 7 Subjects for Rajasthan Informatics Assistant
INSERT IGNORE INTO subjects (id, name, code, description, icon, status)
VALUES 
(5, 'General Science', 'GEN_SCIENCE', 'Physics, Chemistry, Life Sciences and Everyday Science concepts', 'flask-conical', 'active'),
(6, 'Hindi Language', 'HINDI', 'General Hindi grammar, vocabulary, idioms and comprehension for Rajasthan exams', 'languages', 'active'),
(7, 'English Language', 'ENGLISH', 'English grammar, vocabulary, error spotting and sentence rearrangement', 'globe', 'active');

-- Link all subjects to Rajasthan Informatics Assistant (exam_id = 1)
INSERT IGNORE INTO exam_subjects (exam_id, subject_id)
VALUES 
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7);

-- Additional Topics
INSERT IGNORE INTO topics (id, subject_id, name, slug, parent_id, priority, level)
VALUES 
(7, 3, 'Data Communication & Protocols', 'data-communication-protocols', 6, 'high', 2),
(8, 3, 'DBMS & SQL Queries', 'dbms-sql-queries', NULL, 'high', 1),
(9, 4, 'Rajasthan History & Geography', 'rajasthan-history-geography', NULL, 'medium', 1),
(10, 5, 'Physical & Chemical Changes', 'physical-chemical-changes', NULL, 'medium', 1),
(11, 6, 'संधि एवं समास (Sandhi & Samas)', 'sandhi-samas', NULL, 'high', 1),
(12, 7, 'Tenses & Active-Passive Voice', 'tenses-voice', NULL, 'medium', 1);

-- Additional Bilingual Questions (Hindi & English)
INSERT IGNORE INTO questions (id, subject_id, topic_id, question_text, question_type, difficulty, status, explanation, default_marks, default_negative_marks, language_code, source)
VALUES 
(5, 3, 8, 'Which SQL keyword is used to eliminate duplicate rows from a query result set?', 'single_choice', 'easy', 'approved', 'The DISTINCT keyword is used in the SELECT statement to return only unique (different) values.', 1.00, 0.25, 'en', 'Informatics Assistant 2021 Previous Year Paper'),
(6, 6, 11, '\"हिमालय\" शब्द का सही संधि-विच्छेद क्या होगा?', 'single_choice', 'easy', 'approved', 'हिम + आलय = हिमालय। यह दीर्घ स्वर संधि का उदाहरण है जहाँ अ/आ + आ = आ बनता है।', 1.00, 0.25, 'hi', 'RSMSSB Hindi Standard Bank'),
(7, 4, 9, 'राजस्थान की सबसे लम्बी नदी कौन-सी है जो पूर्णतः राजस्थान राज्य में बहती है?', 'single_choice', 'medium', 'approved', 'बनास नदी पूर्णतः राजस्थान में बहने वाली सबसे लम्बी नदी है। इसकी कुल लम्बाई लगभग 512 किमी है। (चम्बल राज्य की कुल सबसे लम्बी नदी है, किन्तु पूर्णतः राजस्थान में नहीं)।', 1.00, 0.25, 'hi', 'Rajasthan GK Standard Compilation'),
(8, 2, 5, 'If the sum of two numbers is 55 and their difference is 7, what is the product of the two numbers?', 'single_choice', 'medium', 'approved', 'Let the numbers be x and y. x + y = 55, x - y = 7 => 2x = 62 => x = 31. Then y = 24. Product = 31 * 24 = 744.', 1.00, 0.25, 'en', 'Quantitative Aptitude Prep');

-- Options for Question 5
INSERT IGNORE INTO question_options (question_id, option_key, option_text, is_correct, order_index)
VALUES 
(5, 'A', 'UNIQUE', 0, 1),
(5, 'B', 'DISTINCT', 1, 2),
(5, 'C', 'DIFFERENT', 0, 3),
(5, 'D', 'FILTER', 0, 4);

-- Options for Question 6
INSERT IGNORE INTO question_options (question_id, option_key, option_text, is_correct, order_index)
VALUES 
(6, 'A', 'हिम + आलय', 1, 1),
(6, 'B', 'हिमा + लय', 0, 2),
(6, 'C', 'हिम् + आलय', 0, 3),
(6, 'D', 'हिम + लय', 0, 4);

-- Options for Question 7
INSERT IGNORE INTO question_options (question_id, option_key, option_text, is_correct, order_index)
VALUES 
(7, 'A', 'चम्बल', 0, 1),
(7, 'B', 'बनास', 1, 2),
(7, 'C', 'लूनी', 0, 3),
(7, 'D', 'माही', 0, 4);

-- Options for Question 8
INSERT IGNORE INTO question_options (question_id, option_key, option_text, is_correct, order_index)
VALUES 
(8, 'A', '720', 0, 1),
(8, 'B', '744', 1, 2),
(8, 'C', '756', 0, 3),
(8, 'D', '782', 0, 4);

-- Link more questions to Assessment 1
INSERT IGNORE INTO assessment_questions (assessment_id, section_id, question_id, order_index, marks, negative_marks)
VALUES 
(1, NULL, 5, 5, 1.00, 0.25),
(1, NULL, 6, 6, 1.00, 0.25),
(1, NULL, 7, 7, 1.00, 0.25),
(1, NULL, 8, 8, 1.00, 0.25);

-- Update Assessment 1 total_questions and total_marks
UPDATE assessments SET total_questions = 8, total_marks = 8.00 WHERE id = 1;

-- Sample Report
INSERT IGNORE INTO student_question_reports (id, student_id, question_id, report_type, description, status)
VALUES 
(1, 1, 3, 'unclear_question', 'Please clarify whether Register ALU pipeline stages are considered separately.', 'pending');
