-- ExamForge Database Schema
-- MySQL 8.0+
-- Engine: InnoDB
-- Charset: utf8mb4

CREATE DATABASE IF NOT EXISTS examforge
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE examforge;

-- =====================================================
-- 1. EXAMS
-- =====================================================

CREATE TABLE exams (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =====================================================
-- 2. SUBJECTS
-- =====================================================

CREATE TABLE subjects (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(100) DEFAULT 'book',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE exam_subjects (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    exam_id BIGINT UNSIGNED NOT NULL,
    subject_id BIGINT UNSIGNED NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_exam_subject (exam_id, subject_id),
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- 3. TOPICS AND SUBTOPICS
-- =====================================================

CREATE TABLE topics (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    subject_id BIGINT UNSIGNED NOT NULL,
    parent_id BIGINT UNSIGNED NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    code VARCHAR(100) NULL,
    description TEXT,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    level INT UNSIGNED DEFAULT 1,
    order_index INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_subject_slug (subject_id, slug),
    INDEX idx_subject_parent (subject_id, parent_id),
    INDEX idx_topic_priority (priority),
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES topics(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- 4. QUESTION BANK
-- =====================================================

CREATE TABLE questions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    subject_id BIGINT UNSIGNED NOT NULL,
    topic_id BIGINT UNSIGNED NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM(
        'single_choice',
        'multiple_choice'
    ) DEFAULT 'single_choice',
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    status ENUM('draft', 'pending', 'approved', 'rejected') DEFAULT 'pending',
    explanation TEXT,
    default_marks DECIMAL(7,2) DEFAULT 1.00,
    default_negative_marks DECIMAL(7,2) DEFAULT 0.25,
    language_code VARCHAR(10) DEFAULT 'hi',
    source VARCHAR(255) NULL,
    created_by BIGINT UNSIGNED NULL,
    reviewed_by BIGINT UNSIGNED NULL,
    reviewed_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_question_filter (subject_id, topic_id, difficulty, status),
    INDEX idx_question_type (question_type),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (topic_id) REFERENCES topics(id)
) ENGINE=InnoDB;

CREATE TABLE question_options (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    question_id BIGINT UNSIGNED NOT NULL,
    option_key VARCHAR(10) NOT NULL,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_question_option (question_id, option_key),
    INDEX idx_question_options (question_id),
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE question_tags (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE question_tag_map (
    question_id BIGINT UNSIGNED NOT NULL,
    tag_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (question_id, tag_id),
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES question_tags(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE question_media (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    question_id BIGINT UNSIGNED NOT NULL,
    media_type ENUM('image', 'audio', 'video') NOT NULL,
    media_url VARCHAR(1000) NOT NULL,
    alt_text VARCHAR(255),
    order_index INT DEFAULT 0,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE question_revisions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    question_id BIGINT UNSIGNED NOT NULL,
    version INT UNSIGNED NOT NULL,
    question_data JSON NOT NULL,
    changed_by BIGINT UNSIGNED NULL,
    change_reason VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_question_version (question_id, version),
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =====================================================
-- 5. STUDENTS AND AUTHENTICATION
-- =====================================================

CREATE TABLE students (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile VARCHAR(20) UNIQUE,
    profile_photo VARCHAR(1000),
    date_of_birth DATE NULL,
    gender ENUM('male', 'female', 'other', 'prefer_not_to_say') NULL,
    state VARCHAR(100),
    district VARCHAR(100),
    account_status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    email_verified_at DATETIME NULL,
    mobile_verified_at DATETIME NULL,
    last_login_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE student_credentials (
    student_id BIGINT UNSIGNED PRIMARY KEY,
    password_hash VARCHAR(255) NOT NULL,
    password_changed_at DATETIME NULL,
    failed_login_attempts INT UNSIGNED DEFAULT 0,
    locked_until DATETIME NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE student_sessions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT UNSIGNED NOT NULL,
    refresh_token_hash VARCHAR(255) NOT NULL UNIQUE,
    device_name VARCHAR(255),
    device_type VARCHAR(50),
    ip_address VARCHAR(45),
    expires_at DATETIME NOT NULL,
    revoked_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_student_sessions (student_id, expires_at),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE student_preferences (
    student_id BIGINT UNSIGNED PRIMARY KEY,
    language_code VARCHAR(10) DEFAULT 'hi',
    theme ENUM('light', 'dark', 'system') DEFAULT 'system',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE student_activity_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT UNSIGNED NOT NULL,
    activity_type VARCHAR(100) NOT NULL,
    description TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_student_activity (student_id, created_at),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- 6. ASSESSMENTS / PRACTICE / MOCK TESTS
-- =====================================================

CREATE TABLE assessments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    exam_id BIGINT UNSIGNED NULL,
    subject_id BIGINT UNSIGNED NULL,
    topic_id BIGINT UNSIGNED NULL,
    assessment_type ENUM(
        'practice',
        'mock',
        'sectional',
        'topic_test',
        'full_length'
    ) NOT NULL,
    duration_minutes INT UNSIGNED NOT NULL DEFAULT 60,
    total_questions INT UNSIGNED DEFAULT 0,
    total_marks DECIMAL(8,2) DEFAULT 100.00,
    passing_percentage DECIMAL(5,2) DEFAULT 40.00,
    shuffle_questions BOOLEAN DEFAULT FALSE,
    shuffle_options BOOLEAN DEFAULT FALSE,
    allow_retake BOOLEAN DEFAULT TRUE,
    show_result_immediately BOOLEAN DEFAULT TRUE,
    show_correct_answers BOOLEAN DEFAULT TRUE,
    start_at DATETIME NULL,
    end_at DATETIME NULL,
    max_attempts INT UNSIGNED NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    created_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_assessment_filter (exam_id, subject_id, assessment_type, status),
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE SET NULL,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE assessment_sections (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    assessment_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INT UNSIGNED NULL,
    total_questions INT UNSIGNED DEFAULT 0,
    total_marks DECIMAL(8,2) DEFAULT 0.00,
    order_index INT DEFAULT 0,
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE assessment_questions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    assessment_id BIGINT UNSIGNED NOT NULL,
    section_id BIGINT UNSIGNED NULL,
    question_id BIGINT UNSIGNED NOT NULL,
    order_index INT DEFAULT 0,
    marks DECIMAL(7,2) NOT NULL DEFAULT 1.00,
    negative_marks DECIMAL(7,2) NOT NULL DEFAULT 0.25,
    UNIQUE KEY uq_assessment_question (assessment_id, question_id),
    INDEX idx_assessment_questions (assessment_id, order_index),
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES assessment_sections(id) ON DELETE SET NULL,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =====================================================
-- 7. ASSESSMENT ATTEMPTS
-- =====================================================

CREATE TABLE assessment_attempts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT UNSIGNED NOT NULL,
    assessment_id BIGINT UNSIGNED NOT NULL,
    attempt_number INT UNSIGNED NOT NULL DEFAULT 1,
    status ENUM(
        'in_progress',
        'submitted',
        'auto_submitted',
        'expired',
        'abandoned'
    ) DEFAULT 'in_progress',
    start_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time DATETIME NULL,
    submission_time DATETIME NULL,
    total_questions INT UNSIGNED DEFAULT 0,
    attempted_questions INT UNSIGNED DEFAULT 0,
    correct_answers INT UNSIGNED DEFAULT 0,
    incorrect_answers INT UNSIGNED DEFAULT 0,
    unanswered_questions INT UNSIGNED DEFAULT 0,
    obtained_marks DECIMAL(8,2) DEFAULT 0.00,
    total_marks DECIMAL(8,2) DEFAULT 0.00,
    percentage DECIMAL(6,2) DEFAULT 0.00,
    accuracy DECIMAL(6,2) DEFAULT 0.00,
    time_taken_seconds INT UNSIGNED DEFAULT 0,
    passed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_student_attempt (student_id, assessment_id, attempt_number),
    INDEX idx_student_attempts (student_id, created_at),
    INDEX idx_assessment_attempts (assessment_id, status),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE RESTRICT,
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =====================================================
-- 8. ATTEMPT QUESTION SNAPSHOTS
-- =====================================================

CREATE TABLE assessment_attempt_questions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    attempt_id BIGINT UNSIGNED NOT NULL,
    question_id BIGINT UNSIGNED NOT NULL,
    question_version INT UNSIGNED NOT NULL DEFAULT 1,
    order_index INT NOT NULL,
    marks DECIMAL(7,2) NOT NULL,
    negative_marks DECIMAL(7,2) NOT NULL,
    question_snapshot JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_attempt_question (attempt_id, question_id),
    UNIQUE KEY uq_attempt_order (attempt_id, order_index),
    FOREIGN KEY (attempt_id) REFERENCES assessment_attempts(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =====================================================
-- 9. STUDENT ANSWERS
-- =====================================================

CREATE TABLE attempt_answers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    attempt_id BIGINT UNSIGNED NOT NULL,
    attempt_question_id BIGINT UNSIGNED NOT NULL,
    answer_status ENUM('unanswered', 'answered', 'marked_for_review') DEFAULT 'unanswered',
    is_correct BOOLEAN NULL,
    marks_awarded DECIMAL(7,2) DEFAULT 0.00,
    time_spent_seconds INT UNSIGNED DEFAULT 0,
    first_answered_at DATETIME NULL,
    last_answered_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_attempt_answer (attempt_id, attempt_question_id),
    FOREIGN KEY (attempt_id) REFERENCES assessment_attempts(id) ON DELETE CASCADE,
    FOREIGN KEY (attempt_question_id) REFERENCES assessment_attempt_questions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE attempt_answer_options (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    answer_id BIGINT UNSIGNED NOT NULL,
    option_id BIGINT UNSIGNED NOT NULL,
    UNIQUE KEY uq_answer_option (answer_id, option_id),
    FOREIGN KEY (answer_id) REFERENCES attempt_answers(id) ON DELETE CASCADE,
    FOREIGN KEY (option_id) REFERENCES question_options(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE attempt_question_reviews (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    attempt_id BIGINT UNSIGNED NOT NULL,
    attempt_question_id BIGINT UNSIGNED NOT NULL,
    is_marked BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_attempt_review (attempt_id, attempt_question_id),
    FOREIGN KEY (attempt_id) REFERENCES assessment_attempts(id) ON DELETE CASCADE,
    FOREIGN KEY (attempt_question_id) REFERENCES assessment_attempt_questions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE attempt_events (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    attempt_id BIGINT UNSIGNED NOT NULL,
    attempt_question_id BIGINT UNSIGNED NULL,
    event_type ENUM(
        'started',
        'question_viewed',
        'answer_selected',
        'answer_changed',
        'marked_for_review',
        'review_removed',
        'section_changed',
        'submitted',
        'auto_submitted'
    ) NOT NULL,
    event_data JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_attempt_events (attempt_id, created_at),
    FOREIGN KEY (attempt_id) REFERENCES assessment_attempts(id) ON DELETE CASCADE,
    FOREIGN KEY (attempt_question_id) REFERENCES assessment_attempt_questions(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =====================================================
-- 10. RESULTS AND PERFORMANCE
-- =====================================================

CREATE TABLE attempt_results (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    attempt_id BIGINT UNSIGNED NOT NULL UNIQUE,
    total_questions INT UNSIGNED NOT NULL,
    attempted_questions INT UNSIGNED NOT NULL,
    correct_answers INT UNSIGNED NOT NULL,
    incorrect_answers INT UNSIGNED NOT NULL,
    unanswered_questions INT UNSIGNED NOT NULL,
    positive_marks DECIMAL(8,2) DEFAULT 0.00,
    negative_marks DECIMAL(8,2) DEFAULT 0.00,
    obtained_marks DECIMAL(8,2) DEFAULT 0.00,
    total_marks DECIMAL(8,2) DEFAULT 0.00,
    percentage DECIMAL(6,2) DEFAULT 0.00,
    accuracy DECIMAL(6,2) DEFAULT 0.00,
    passed BOOLEAN DEFAULT FALSE,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (attempt_id) REFERENCES assessment_attempts(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE student_subject_performance (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT UNSIGNED NOT NULL,
    subject_id BIGINT UNSIGNED NOT NULL,
    total_attempts INT UNSIGNED DEFAULT 0,
    total_questions INT UNSIGNED DEFAULT 0,
    correct_answers INT UNSIGNED DEFAULT 0,
    incorrect_answers INT UNSIGNED DEFAULT 0,
    unanswered_questions INT UNSIGNED DEFAULT 0,
    total_marks_obtained DECIMAL(10,2) DEFAULT 0.00,
    accuracy DECIMAL(6,2) DEFAULT 0.00,
    average_time_seconds INT UNSIGNED DEFAULT 0,
    last_attempt_at DATETIME NULL,
    UNIQUE KEY uq_student_subject (student_id, subject_id),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE student_topic_performance (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT UNSIGNED NOT NULL,
    topic_id BIGINT UNSIGNED NOT NULL,
    total_attempts INT UNSIGNED DEFAULT 0,
    total_questions INT UNSIGNED DEFAULT 0,
    correct_answers INT UNSIGNED DEFAULT 0,
    incorrect_answers INT UNSIGNED DEFAULT 0,
    unanswered_questions INT UNSIGNED DEFAULT 0,
    accuracy DECIMAL(6,2) DEFAULT 0.00,
    average_time_seconds INT UNSIGNED DEFAULT 0,
    last_attempt_at DATETIME NULL,
    UNIQUE KEY uq_student_topic (student_id, topic_id),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE student_daily_stats (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT UNSIGNED NOT NULL,
    stat_date DATE NOT NULL,
    tests_attempted INT UNSIGNED DEFAULT 0,
    questions_attempted INT UNSIGNED DEFAULT 0,
    correct_answers INT UNSIGNED DEFAULT 0,
    study_time_seconds INT UNSIGNED DEFAULT 0,
    UNIQUE KEY uq_student_daily (student_id, stat_date),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- 11. BOOKMARKS AND REPORTS
-- =====================================================

CREATE TABLE student_bookmarks (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT UNSIGNED NOT NULL,
    question_id BIGINT UNSIGNED NOT NULL,
    note TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_student_bookmark (student_id, question_id),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE student_question_reports (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT UNSIGNED NOT NULL,
    question_id BIGINT UNSIGNED NOT NULL,
    report_type ENUM(
        'wrong_answer',
        'incorrect_explanation',
        'unclear_question',
        'incorrect_options',
        'other'
    ) NOT NULL,
    description TEXT,
    status ENUM('pending', 'reviewed', 'resolved', 'rejected') DEFAULT 'pending',
    reviewed_by BIGINT UNSIGNED NULL,
    reviewed_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_question_reports (question_id, status),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- 12. ADMIN AND ROLE MANAGEMENT
-- =====================================================

CREATE TABLE roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE admin_users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    last_login_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE admin_role_map (
    admin_id BIGINT UNSIGNED NOT NULL,
    role_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (admin_id, role_id),
    FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE admin_activity_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    admin_id BIGINT UNSIGNED NOT NULL,
    action VARCHAR(150) NOT NULL,
    entity_type VARCHAR(100),
    entity_id BIGINT UNSIGNED NULL,
    details JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_admin_activity (admin_id, created_at),
    FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =====================================================
-- 13. INITIAL ROLES
-- =====================================================

INSERT INTO roles (name, description) VALUES
('super_admin', 'Complete system access'),
('admin', 'Administrative access'),
('question_manager', 'Manage question bank'),
('exam_manager', 'Manage exams and assessments'),
('moderator', 'Review questions and reports');

-- =====================================================
-- 14. INITIAL EXAM AND SUBJECT
-- =====================================================

INSERT INTO exams (name, code, description)
VALUES (
    'Rajasthan Informatics Assistant',
    'RAJ_INFORMATICS_ASSISTANT',
    'Rajasthan Informatics Assistant examination preparation'
);

INSERT INTO subjects (name, code, description)
VALUES (
    'Reasoning',
    'REASONING',
    'Logical and analytical reasoning'
);

INSERT INTO exam_subjects (exam_id, subject_id)
SELECT e.id, s.id
FROM exams e
CROSS JOIN subjects s
WHERE e.code = 'RAJ_INFORMATICS_ASSISTANT'
AND s.code = 'REASONING';

-- =====================================================
-- 15. REASONING TOPICS
-- =====================================================

INSERT INTO topics (
    subject_id,
    parent_id,
    name,
    slug,
    priority,
    level,
    order_index
)
SELECT id, NULL, 'Blood Relation', 'blood-relation', 'high', 1, 1
FROM subjects
WHERE code = 'REASONING';

-- Level 1 - High Priority

INSERT INTO topics (
    subject_id,
    parent_id,
    name,
    slug,
    priority,
    level,
    order_index
)
SELECT
    t.subject_id,
    t.id,
    'Basic / One Line Questions',
    'basic-one-line',
    'high',
    2,
    1
FROM topics t
JOIN subjects s ON s.id = t.subject_id
WHERE s.code = 'REASONING'
AND t.slug = 'blood-relation';

-- Direct Relationship

INSERT INTO topics (
    subject_id,
    parent_id,
    name,
    slug,
    priority,
    level,
    order_index
)
SELECT
    t.subject_id,
    t.id,
    'Direct Relationship',
    'direct-relationship',
    'high',
    3,
    1
FROM topics t
JOIN subjects s ON s.id = t.subject_id
WHERE s.code = 'REASONING'
AND t.slug = 'basic-one-line';

-- =====================================================
-- END OF SCHEMA
-- =====================================================