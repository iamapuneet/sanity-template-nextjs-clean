# ExamForge – Government Exam Question Bank & Practice Platform

ExamForge is a comprehensive, production-ready Government Exam Question Bank and Practice Platform built with Next.js 16, React 19, Tailwind CSS, and MySQL architecture (with Sanity Studio preserved).

## Architecture & Project Structure

```
ExamForge/
│
├── frontend/             # Next.js 16 Application
│   ├── app/
│   │   ├── admin/        # Admin Panel (Dashboard, Subjects, Topics, Question Bank, Practice Tests, Settings)
│   │   ├── practice/     # Student MCQ Practice Portal (Upcoming in Step 2)
│   │   └── api/          # Next.js Route Handlers (MySQL CRUD Backend)
│   ├── components/       # Shared UI Components
│   ├── lib/              # Types, Database pool, Utilities
│   └── styles/
│
├── studio/               # Existing Sanity Studio (preserved)
│
├── database/             # Database migrations and schema definitions
│   └── migrations/
│
├── .env.example          # Environment variables template
└── README.md
```

## Admin Panel Modules

1. **Dashboard (`/admin`)**: Summary metrics, statistics, recently added questions, subject breakdown.
2. **Subject Management (`/admin/subjects`)**: Manage core subjects (Reasoning, Mathematics, Computer, GK, Science, Hindi, English).
3. **Hierarchical Topic Management (`/admin/topics`)**: Multi-level nested tree hierarchy with `parent_id` support (Subject → Topic → Sub-topic → Micro-topic).
4. **Question Bank (`/admin/questions`)**: Filterable MCQ repository with status approval workflow (Pending / Approved), difficulty levels, 4 options, explanations, and CRUD operations.
5. **Practice Test Builder (`/admin/practice-tests`)**: Checkbox question selection, marks allocation, negative marking, and timer controls.
6. **Results & Analytics (`/admin/results`)**: Performance tracking and attempt analytics.
7. **Settings (`/admin/settings`)**: Exam rules, marking scheme, and platform configurations.

## Development

```bash
# Install dependencies
npm install

# Run frontend (Next.js 16)
npm run dev:next

# Run Sanity Studio
npm run dev:studio
```
