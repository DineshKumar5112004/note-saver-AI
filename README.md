# NoteSaver Pro

A modern, production-ready cloud-based note management platform built with React, Supabase, and Tailwind CSS.

![NoteSaver Pro](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Features

- 🔐 **Authentication** - Email/password login, Google OAuth, password reset
- 📝 **Full Note Management** - Create, read, update, delete notes
- 📌 **Organize** - Pin, favorite, archive, categorize, and tag notes
- 🔍 **Smart Search** - Debounced search with filters and sorting
- 🎨 **Customization** - Color labels, categories, tags
- 🌓 **Dark/Light Mode** - Theme toggle with system preference detection
- 💾 **Autosave** - Automatic saving every 5 seconds
- 📊 **Statistics** - Track your writing with detailed analytics
- 📤 **Export/Import** - Backup and restore notes as JSON or Markdown
- ⌨️ **Keyboard Shortcuts** - Quick access to common actions
- 📱 **Fully Responsive** - Mobile-first design with glassmorphism effects
- 🎭 **Animations** - Smooth transitions with Framer Motion

## Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Lucide React** - Beautiful icons
- **Framer Motion** - Animation library
- **Sonner** - Toast notifications
- **date-fns** - Date formatting

### Backend
- **Supabase Auth** - Authentication (Email + OAuth)
- **Supabase PostgreSQL** - Database
- **Supabase Storage** - File storage for avatars

### Deployment
- **Vercel** - Hosting platform

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd notesaver-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**

   a. Create a new project at [supabase.com](https://supabase.com)
   
   b. Run the SQL migrations in order:
      - Go to SQL Editor in your Supabase dashboard
      - Run `supabase/schema.sql`
      - Run `supabase/rls_policies.sql`
      - Run `supabase/storage.sql`
   
   c. Enable Google OAuth:
      - Go to Authentication > Providers
      - Enable Google provider
      - Add your Google OAuth credentials
      - Set redirect URL: `https://<your-project-ref>.supabase.co/auth/v1/callback`

4. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:3000`

## Project Structure

```
notesaver-pro/
├── public/
├── supabase/
│   ├── schema.sql              # Database schema
│   ├── rls_policies.sql        # Row Level Security policies
│   └── storage.sql             # Storage bucket setup
├── src/
│   ├── assets/                 # Static assets
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── forms/              # Form components
│   │   ├── notes/              # Note-related components
│   │   ├── dashboard/          # Dashboard components
│   │   └── layouts/            # Layout components
│   ├── pages/                  # Page components
│   ├── routes/                 # Route configuration
│   ├── hooks/                  # Custom React hooks
│   ├── services/               # API service layer
│   ├── context/                # React Context providers
│   ├── lib/                    # Third-party library config
│   ├── utils/                  # Utility functions
│   ├── constants/              # App constants
│   ├── types/                  # TypeScript type definitions
│   ├── styles/                 # Global styles
│   ├── App.tsx                 # Main app component
│   └── main.tsx                # Entry point
├── .env.example                # Environment variables template
├── .gitignore
├── index.html
├── package.json
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind configuration
└── tsconfig.json               # TypeScript configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests

## Database Schema

### Tables

#### profiles
- `id` (UUID, PK) - Links to auth.users
- `full_name` (TEXT)
- `avatar_url` (TEXT)
- `created_at` (TIMESTAMPTZ)

#### notes
- `id` (UUID, PK)
- `user_id` (UUID, FK to auth.users)
- `title` (TEXT)
- `content` (TEXT)
- `color` (TEXT)
- `category` (TEXT)
- `tags` (TEXT[])
- `is_pinned` (BOOLEAN)
- `is_favorite` (BOOLEAN)
- `is_archived` (BOOLEAN)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

#### note_activity
- `id` (UUID, PK)
- `note_id` (UUID, FK to notes)
- `action` (TEXT)
- `created_at` (TIMESTAMPTZ)

### Security

Row Level Security (RLS) is enabled on all tables:
- Users can only access their own data
- Foreign key constraints ensure data integrity
- Automatic profile creation on signup

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Set environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Configure build settings:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Deploy!

### Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] RLS policies enabled
- [ ] Storage bucket created
- [ ] OAuth providers configured
- [ ] Custom domain configured (optional)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Yes |

## Keyboard Shortcuts

- `Ctrl/Cmd + N` - Create new note
- `Ctrl/Cmd + F` - Focus search
- `Ctrl/Cmd + S` - Save note
- `Esc` - Close modal/editor
- `?` - Show keyboard shortcuts help

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For support, email support@notesaver.pro or open an issue in the repository.

---

Built with ❤️ using React and Supabase
