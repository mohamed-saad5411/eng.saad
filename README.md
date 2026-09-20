-- Reference tables
grades            (id, name_ar, name_en, order)
tracks            (id, name_ar, name_en)          -- nullable FK on programs
languages         (id, code)                       -- 'ar' | 'en' | 'de'

-- Program = the independent unit (Subject × Language × Grade × Track)
programs (
  id, slug,
  title,                -- single title, in the program's own content language
  language_id,           -- FK -> languages
  grade_id,               -- FK -> grades
  track_id,                -- FK -> tracks, nullable
  is_published
)

-- Content tree: Program -> Unit -> Lesson -> Video
units    (id, program_id, title, order)
lessons  (id, unit_id, title, order)
videos   (id, lesson_id, kind /* explanation | past_exam */, provider_url, duration)

-- Progress / unlock logic
video_views (id, student_id, video_id, watch_percentage, completed_at)
lesson_exams (id, lesson_id, passing_score)
lesson_exam_attempts (id, student_id, lesson_exam_id, score, passed_at)
unit_exams (id, unit_id, mcq_passing_score)
unit_exam_attempts (id, student_id, unit_exam_id, mcq_score, essay_status /* pending|graded */, essay_score)

-- Commerce — separate from content
products        (id, title, price, billing_type /* subscription|one_time */)
entitlements    (id, product_id, program_id  -- or unit_id/lesson_id for partial packages)
subscriptions   (id, student_id, product_id, status, current_period_end)
purchases       (id, student_id, product_id, paid_at)

-- Users
profiles (id, role /* student|parent|admin */, ...)
parent_student_links (parent_id, student_id)








src/
│
├── app/
│   ├── [locale]/                    # ar / en — UI language only, NOT content language
│   │   ├── (public)/
│   │   │   ├── page.tsx
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   └── programs/            # lists all 5 programs, filterable by grade/language
│   │   │       └── [programSlug]/   # sales page per program
│   │   │
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   │
│   │   ├── student/
│   │   │   ├── dashboard/           # "My Learning" — only enrolled programs shown
│   │   │   ├── programs/[programId]/units/[unitId]/lessons/[lessonId]/
│   │   │   └── exams/[examId]/
│   │   │
│   │   ├── parent/
│   │   │   ├── dashboard/
│   │   │   └── child/[studentId]/
│   │   │
│   │   └── admin/
│   │       ├── academic/            # grades, tracks, languages, programs CRUD
│   │       ├── content/             # units, lessons, videos
│   │       ├── commerce/            # products, entitlements, subscriptions, purchases
│   │       ├── exams/               # incl. essay grading queue
│   │       ├── students/
│   │       └── analytics/
│   │
│   └── api/
│       └── webhooks/                # ONLY external callbacks
│           ├── paymob/
│           └── video/               # Mux/Bunny watch-progress callback
│
├── actions/                         # Server Actions — replace old REST CRUD
│   ├── programs.ts
│   ├── videos.ts
│   ├── progress.ts
│   ├── subscriptions.ts
│   ├── purchases.ts
│   └── exams.ts
│
├── components/
│   ├── ui/
│   ├── shared/
│   ├── landing/
│   ├── student/
│   ├── parent/
│   └── admin/
│
├── lib/
│   ├── supabase/ { client.ts, server.ts, middleware.ts }
│   ├── i18n/ { routing.ts }          # UI locale only
│   ├── auth/
│   ├── permissions/                  # role checks: student/parent/admin
│   ├── video/                        # signed URL generation
│   └── utils/
│
├── messages/                         # UI strings ONLY — never lesson content
│   ├── ar.json
│   └── en.json
│
├── services/                         # business logic, called by actions/
│   ├── users/
│   ├── programs/
│   ├── content/                      # unit/lesson/video tree
│   ├── progress/                     # 90% watch-completion unlock logic
│   ├── commerce/                     # products, entitlements, subscriptions
│   ├── exams/                        # MCQ auto-grade + essay manual-grade
│   └── notifications/
│
├── types/
│   ├── database.ts
│   ├── user.ts
│   ├── program.ts                    # includes language, grade, track (nullable)
│   ├── content.ts                    # unit/lesson/video
│   ├── commerce.ts
│   └── exam.ts
│
└── middleware.ts                     # intl middleware -> auth check, in that order