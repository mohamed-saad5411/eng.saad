$root = "src"

$dirs = @(
  "$root/app/[locale]/(public)/about",
  "$root/app/[locale]/(public)/contact",
  "$root/app/[locale]/(public)/programs/[programSlug]",
  "$root/app/[locale]/(auth)/login",
  "$root/app/[locale]/(auth)/register",
  "$root/app/[locale]/(auth)/forgot-password",
  "$root/app/[locale]/student/dashboard",
  "$root/app/[locale]/student/programs/[programId]/units/[unitId]/lessons/[lessonId]",
  "$root/app/[locale]/student/exams/[examId]",
  "$root/app/[locale]/parent/dashboard",
  "$root/app/[locale]/parent/child/[studentId]",
  "$root/app/[locale]/admin/academic",
  "$root/app/[locale]/admin/content",
  "$root/app/[locale]/admin/commerce",
  "$root/app/[locale]/admin/exams",
  "$root/app/[locale]/admin/students",
  "$root/app/[locale]/admin/analytics",
  "$root/app/api/webhooks/paymob",
  "$root/app/api/webhooks/video",
  "$root/actions",
  "$root/components/ui",
  "$root/components/shared",
  "$root/components/landing",
  "$root/components/student",
  "$root/components/parent",
  "$root/components/admin",
  "$root/lib/supabase",
  "$root/lib/i18n",
  "$root/lib/auth",
  "$root/lib/permissions",
  "$root/lib/video",
  "$root/lib/utils",
  "$root/messages",
  "$root/services/users",
  "$root/services/programs",
  "$root/services/content",
  "$root/services/progress",
  "$root/services/commerce",
  "$root/services/exams",
  "$root/services/notifications",
  "$root/types"
)

$files = @(
  "$root/app/[locale]/(public)/layout.tsx",
  "$root/app/[locale]/(public)/page.tsx",
  "$root/app/[locale]/(public)/about/page.tsx",
  "$root/app/[locale]/(public)/contact/page.tsx",
  "$root/app/[locale]/(public)/programs/page.tsx",
  "$root/app/[locale]/(public)/programs/[programSlug]/page.tsx",
  "$root/app/[locale]/(auth)/login/page.tsx",
  "$root/app/[locale]/(auth)/register/page.tsx",
  "$root/app/[locale]/(auth)/forgot-password/page.tsx",
  "$root/app/[locale]/student/dashboard/page.tsx",
  "$root/app/[locale]/student/programs/[programId]/units/[unitId]/lessons/[lessonId]/page.tsx",
  "$root/app/[locale]/student/exams/[examId]/page.tsx",
  "$root/app/[locale]/parent/dashboard/page.tsx",
  "$root/app/[locale]/parent/child/[studentId]/page.tsx",
  "$root/app/[locale]/admin/academic/page.tsx",
  "$root/app/[locale]/admin/content/page.tsx",
  "$root/app/[locale]/admin/commerce/page.tsx",
  "$root/app/[locale]/admin/exams/page.tsx",
  "$root/app/[locale]/admin/students/page.tsx",
  "$root/app/[locale]/admin/analytics/page.tsx",
  "$root/app/api/webhooks/paymob/route.ts",
  "$root/app/api/webhooks/video/route.ts",
  "$root/app/globals.css",
  "$root/actions/programs.ts",
  "$root/actions/videos.ts",
  "$root/actions/progress.ts",
  "$root/actions/subscriptions.ts",
  "$root/actions/purchases.ts",
  "$root/actions/exams.ts",
  "$root/components/landing/navbar.tsx",
  "$root/components/landing/footer.tsx",
  "$root/components/landing/hero.tsx",
  "$root/components/landing/program-card.tsx",
  "$root/components/landing/section-heading.tsx",
  "$root/components/landing/how-it-works.tsx",
  "$root/lib/supabase/client.ts",
  "$root/lib/supabase/server.ts",
  "$root/lib/supabase/middleware.ts",
  "$root/lib/i18n/routing.ts",
  "$root/messages/ar.json",
  "$root/messages/en.json",
  "$root/services/users/index.ts",
  "$root/services/programs/index.ts",
  "$root/services/content/index.ts",
  "$root/services/progress/index.ts",
  "$root/services/commerce/index.ts",
  "$root/services/exams/index.ts",
  "$root/services/notifications/index.ts",
  "$root/types/database.ts",
  "$root/types/user.ts",
  "$root/types/program.ts",
  "$root/types/content.ts",
  "$root/types/commerce.ts",
  "$root/types/exam.ts",
  "$root/middleware.ts"
)

foreach ($d in $dirs) {
  New-Item -ItemType Directory -Force -Path $d | Out-Null
}

foreach ($f in $files) {
  if (-not (Test-Path $f)) {
    New-Item -ItemType File -Force -Path $f | Out-Null
  }
}

$folderCount = (Get-ChildItem -Recurse -Directory $root).Count
$fileCount = (Get-ChildItem -Recurse -File $root).Count
Write-Host "Structure created under $root/"
Write-Host "$folderCount folders, $fileCount files"