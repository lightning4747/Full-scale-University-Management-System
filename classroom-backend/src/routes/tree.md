# File Tree: University-management-system

**Generated:** 2/18/2026, 10:04:34 PM
**Root Path:** `v:\React-projects\University-management-system`

```
├── 📁 classroom-backend
│   ├── 📁 apminsightdata
│   │   └── 📁 classroom-backend_10000
│   │       └── ⚙️ apminsight.json
│   ├── 📁 docs
│   │   ├── 📝 README.md
│   │   ├── 📝 database-erd.md
│   │   ├── 📝 database-schema.md
│   │   └── 📝 database-setup.md
│   ├── 📁 drizzle
│   │   ├── 📁 meta
│   │   │   ├── ⚙️ 0000_snapshot.json
│   │   │   ├── ⚙️ 0001_snapshot.json
│   │   │   └── ⚙️ _journal.json
│   │   ├── 📄 0000_sparkling_karnak.sql
│   │   └── 📄 0001_loose_spirit.sql
│   ├── 📁 src
│   │   ├── 📁 config
│   │   │   └── 📄 arcjet.ts
│   │   ├── 📁 db
│   │   │   ├── 📁 schema
│   │   │   │   ├── 📄 app.ts
│   │   │   │   ├── 📄 auth.ts
│   │   │   │   ├── 📄 index.ts
│   │   │   │   └── 📝 separation-pattern.md
│   │   │   ├── 📄 db.ts
│   │   │   └── 📄 index.ts
│   │   ├── 📁 lib
│   │   │   └── 📄 auth.ts
│   │   ├── 📁 middleware
│   │   │   ├── 📄 roleCheck.ts
│   │   │   ├── 📄 security.ts
│   │   │   └── 📄 session.ts
│   │   ├── 📁 routes
│   │   │   ├── 📄 classes.ts
│   │   │   ├── 📄 departments.ts
│   │   │   ├── 📄 enrollments.ts
│   │   │   ├── 📄 stats.ts
│   │   │   ├── 📄 subject.ts
│   │   │   └── 📄 user.ts
│   │   ├── 📄 express.d.ts
│   │   ├── 📄 index.ts
│   │   ├── 📄 seed.ts
│   │   └── 📄 type.d.ts
│   ├── ⚙️ .gitignore
│   ├── ⚙️ Swagger.json
│   ├── ⚙️ apminsightnode.json
│   ├── 📄 drizzle.config.js
│   ├── 📄 drizzle.config.ts
│   ├── ⚙️ package-lock.json
│   ├── ⚙️ package.json
│   ├── 📄 trigger_error.js
│   ├── 📄 trigger_error.ts
│   └── ⚙️ tsconfig.json
├── 📁 classroom-frontend
│   ├── 📁 .vite
│   │   └── 📁 deps
│   │       ├── ⚙️ _metadata.json
│   │       └── ⚙️ package.json
│   ├── 📁 public
│   │   └── 📄 favicon.ico
│   ├── 📁 src
│   │   ├── 📁 components
│   │   │   ├── 📁 refine-ui
│   │   │   │   ├── 📁 buttons
│   │   │   │   │   ├── 📄 clone.tsx
│   │   │   │   │   ├── 📄 create.tsx
│   │   │   │   │   ├── 📄 delete.tsx
│   │   │   │   │   ├── 📄 edit.tsx
│   │   │   │   │   ├── 📄 list.tsx
│   │   │   │   │   ├── 📄 refresh.tsx
│   │   │   │   │   └── 📄 show.tsx
│   │   │   │   ├── 📁 data-table
│   │   │   │   │   ├── 📄 data-table-filter.tsx
│   │   │   │   │   ├── 📄 data-table-pagination.tsx
│   │   │   │   │   ├── 📄 data-table-sorter.tsx
│   │   │   │   │   └── 📄 data-table.tsx
│   │   │   │   ├── 📁 form
│   │   │   │   │   ├── 📄 admin-sign-in-form.tsx
│   │   │   │   │   ├── 📄 forgot-password-form.tsx
│   │   │   │   │   ├── 📄 input-password.tsx
│   │   │   │   │   ├── 📄 sign-in-form.tsx
│   │   │   │   │   └── 📄 sign-up-form.tsx
│   │   │   │   ├── 📁 layout
│   │   │   │   │   ├── 📄 breadcrumb.tsx
│   │   │   │   │   ├── 📄 error-component.tsx
│   │   │   │   │   ├── 📄 header.tsx
│   │   │   │   │   ├── 📄 layout.tsx
│   │   │   │   │   ├── 📄 loading-overlay.tsx
│   │   │   │   │   ├── 📄 sidebar.tsx
│   │   │   │   │   ├── 📄 user-avatar.tsx
│   │   │   │   │   └── 📄 user-info.tsx
│   │   │   │   ├── 📁 notification
│   │   │   │   │   ├── 📄 toaster.tsx
│   │   │   │   │   ├── 📄 undoable-notification.tsx
│   │   │   │   │   └── 📄 use-notification-provider.tsx
│   │   │   │   ├── 📁 theme
│   │   │   │   │   ├── 📄 theme-provider.tsx
│   │   │   │   │   ├── 📄 theme-select.tsx
│   │   │   │   │   └── 📄 theme-toggle.tsx
│   │   │   │   └── 📁 views
│   │   │   │       ├── 📄 create-view.tsx
│   │   │   │       ├── 📄 edit-view.tsx
│   │   │   │       ├── 📄 list-view.tsx
│   │   │   │       └── 📄 show-view.tsx
│   │   │   ├── 📁 ui
│   │   │   │   ├── 📄 accordion.tsx
│   │   │   │   ├── 📄 alert-dialog.tsx
│   │   │   │   ├── 📄 alert.tsx
│   │   │   │   ├── 📄 aspect-ratio.tsx
│   │   │   │   ├── 📄 avatar.tsx
│   │   │   │   ├── 📄 badge.tsx
│   │   │   │   ├── 📄 breadcrumb.tsx
│   │   │   │   ├── 📄 button.tsx
│   │   │   │   ├── 📄 calendar.tsx
│   │   │   │   ├── 📄 card.tsx
│   │   │   │   ├── 📄 carousel.tsx
│   │   │   │   ├── 📄 chart.tsx
│   │   │   │   ├── 📄 checkbox.tsx
│   │   │   │   ├── 📄 collapsible.tsx
│   │   │   │   ├── 📄 command.tsx
│   │   │   │   ├── 📄 context-menu.tsx
│   │   │   │   ├── 📄 dialog.tsx
│   │   │   │   ├── 📄 drawer.tsx
│   │   │   │   ├── 📄 dropdown-menu.tsx
│   │   │   │   ├── 📄 form.tsx
│   │   │   │   ├── 📄 hover-card.tsx
│   │   │   │   ├── 📄 input-otp.tsx
│   │   │   │   ├── 📄 input.tsx
│   │   │   │   ├── 📄 label.tsx
│   │   │   │   ├── 📄 menubar.tsx
│   │   │   │   ├── 📄 navigation-menu.tsx
│   │   │   │   ├── 📄 pagination.tsx
│   │   │   │   ├── 📄 popover.tsx
│   │   │   │   ├── 📄 progress.tsx
│   │   │   │   ├── 📄 radio-group.tsx
│   │   │   │   ├── 📄 resizable.tsx
│   │   │   │   ├── 📄 scroll-area.tsx
│   │   │   │   ├── 📄 select.tsx
│   │   │   │   ├── 📄 separator.tsx
│   │   │   │   ├── 📄 sheet.tsx
│   │   │   │   ├── 📄 sidebar.tsx
│   │   │   │   ├── 📄 skeleton.tsx
│   │   │   │   ├── 📄 slider.tsx
│   │   │   │   ├── 📄 sonner.tsx
│   │   │   │   ├── 📄 switch.tsx
│   │   │   │   ├── 📄 table.tsx
│   │   │   │   ├── 📄 tabs.tsx
│   │   │   │   ├── 📄 textarea.tsx
│   │   │   │   ├── 📄 toggle-group.tsx
│   │   │   │   ├── 📄 toggle.tsx
│   │   │   │   └── 📄 tooltip.tsx
│   │   │   ├── 📄 auth-callback.tsx
│   │   │   ├── 📄 uploadwidget.tsx
│   │   │   └── 📄 user-avatar.tsx
│   │   ├── 📁 constants
│   │   │   ├── 📄 index.ts
│   │   │   └── 📄 mock-data.ts
│   │   ├── 📁 hooks
│   │   │   └── 📄 use-mobile.ts
│   │   ├── 📁 lib
│   │   │   ├── 📄 auth-client.ts
│   │   │   ├── 📄 cloudinary.ts
│   │   │   ├── 📄 schema.ts
│   │   │   └── 📄 utils.ts
│   │   ├── 📁 pages
│   │   │   ├── 📁 admin
│   │   │   │   └── 📄 login.tsx
│   │   │   ├── 📁 classes
│   │   │   │   ├── 📄 create.tsx
│   │   │   │   ├── 📄 list.tsx
│   │   │   │   └── 📄 show.tsx
│   │   │   ├── 📁 departments
│   │   │   │   ├── 📄 create.tsx
│   │   │   │   ├── 📄 list.tsx
│   │   │   │   └── 📄 show.tsx
│   │   │   ├── 📁 enrollments
│   │   │   │   ├── 📄 confirm.tsx
│   │   │   │   ├── 📄 create.tsx
│   │   │   │   └── 📄 join.tsx
│   │   │   ├── 📁 faculty
│   │   │   │   ├── 📄 list.tsx
│   │   │   │   └── 📄 show.tsx
│   │   │   ├── 📁 login
│   │   │   │   └── 📄 index.tsx
│   │   │   ├── 📁 register
│   │   │   │   └── 📄 index.tsx
│   │   │   ├── 📁 subjects
│   │   │   │   ├── 📄 create.tsx
│   │   │   │   ├── 📄 list.tsx
│   │   │   │   └── 📄 show.tsx
│   │   │   ├── 📁 teachers
│   │   │   │   └── 📄 dashboard.tsx
│   │   │   ├── 📄 dashboard.tsx
│   │   │   └── 📄 profile.tsx
│   │   ├── 📁 providers
│   │   │   ├── 📄 auth.ts
│   │   │   └── 📄 data.ts
│   │   ├── 📁 types
│   │   │   └── 📄 index.ts
│   │   ├── 🎨 App.css
│   │   ├── 📄 App.tsx
│   │   ├── 📄 index.tsx
│   │   └── 📄 vite-env.d.ts
│   ├── ⚙️ .npmrc
│   ├── 🐳 Dockerfile
│   ├── 📝 README.MD
│   ├── ⚙️ components.json
│   ├── 📄 eslint.config.js
│   ├── 🌐 index.html
│   ├── ⚙️ package-lock.json
│   ├── ⚙️ package.json
│   ├── ⚙️ tsconfig.json
│   ├── ⚙️ tsconfig.node.json
│   ├── ⚙️ vercel.json
│   └── 📄 vite.config.ts
├── ⚙️ .gitignore
├── 📝 AUTH_DEBUGGING_GUIDE.md
├── 📝 CHANGES.md
├── 📝 ENVIRONMENT_SETUP.md
├── 📝 OAUTH_FIXES_SUMMARY.md
├── 📝 OAUTH_IMPLEMENTATION.md
├── 📝 OAUTH_README.md
├── 📝 OAUTH_SETUP.md
├── 📝 QUICK_REFERENCE.md
├── 📝 README.md
├── 📝 TESTING_OAUTH.md
├── ⚙️ package-lock.json
├── ⚙️ package.json
├── ⚙️ pnpm-lock.yaml
└── ⚙️ railway.json
```

---
*Generated by FileTree Pro Extension*