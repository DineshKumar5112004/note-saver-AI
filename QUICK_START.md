# 🚀 Quick Start Guide - NoteSaver Pro

Get your NoteSaver Pro application running in under 10 minutes!

---

## ⚡ Super Quick Start (For Experienced Developers)

### Prerequisites
- Node.js 18+ installed
- A Supabase account (free at supabase.com)

### Steps

1. **Install Dependencies**
   ```bash
   cd notesaver-pro
   npm install
   ```

2. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Fill in details and create

3. **Run Database Migrations**
   - Go to SQL Editor in Supabase
   - Run these 3 files in order:
     1. `supabase/schema.sql`
     2. `supabase/rls_policies.sql`
     3. `supabase/storage.sql`

4. **Get API Keys**
   - Go to Project Settings > API
   - Copy Project URL and anon key

5. **Configure Environment**
   ```bash
   # Create .env.local
   notepad .env.local
   ```
   
   Add:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

7. **Open Browser**
   - App runs at: `http://localhost:3000`

**Done!** 🎉

---

## 📋 Detailed Step-by-Step

### Step 1: Install Node.js (if not installed)

1. Download from [nodejs.org](https://nodejs.org/)
2. Install LTS version (18+)
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Install Project Dependencies

```bash
cd c:\Users\Bhoomika\Desktop\dinesh\notesaver-pro
npm install
```

This will install all required packages (~150 packages, may take 1-2 minutes).

### Step 3: Create Supabase Account

1. Visit [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email
4. Verify your email

### Step 4: Create a New Project

1. Click "New Project" in Supabase dashboard
2. Fill in:
   - **Name**: `notesaver-pro`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier (perfect for starting)
3. Click "Create new project"
4. Wait 1-2 minutes for setup

### Step 5: Set Up Database

#### 5.1 Open SQL Editor
- In your Supabase project dashboard
- Click "SQL Editor" in left sidebar
- Click "New query"

#### 5.2 Run Schema (File 1)
1. Open `supabase/schema.sql` in your code editor
2. Copy ALL content
3. Paste into SQL Editor
4. Click "Run" button
5. Wait for "Success" message

**What this creates:**
- `profiles` table
- `notes` table
- `note_activity` table
- Indexes for performance
- Triggers for automation

#### 5.3 Run RLS Policies (File 2)
1. Click "New query"
2. Open `supabase/rls_policies.sql`
3. Copy ALL content
4. Paste into SQL Editor
5. Click "Run"

**What this does:**
- Enables Row Level Security
- Users can ONLY access their own data
- Database-level security

#### 5.4 Run Storage Setup (File 3)
1. Click "New query"
2. Open `supabase/storage.sql`
3. Copy ALL content
4. Paste into SQL Editor
5. Click "Run"

**What this creates:**
- `avatars` storage bucket
- Storage policies for avatar uploads

### Step 6: Enable Google OAuth (Optional but Recommended)

#### 6.1 Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "NoteSaver Pro"
3. Go to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client ID"
5. If prompted, configure consent screen:
   - User Type: External
   - Fill required fields
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: `notesaver-pro`
   - **Authorized redirect URIs**:
     ```
     https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
     ```
     (Replace `[YOUR-PROJECT-REF]` with your actual project ref)
7. Click "Create"
8. Copy **Client ID** and **Client Secret**

#### 6.2 Configure in Supabase

1. Go to Supabase dashboard
2. Authentication > Providers
3. Find "Google" and click it
4. Toggle "Enable Sign in with Google"
5. Paste:
   - Client ID
   - Client Secret
6. Click "Save"

### Step 7: Get Your API Keys

1. In Supabase dashboard
2. Go to **Project Settings** (gear icon)
3. Click **API**
4. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long string)

### Step 8: Configure Environment Variables

#### Option A: Using File Explorer
1. Navigate to `c:\Users\Bhoomika\Desktop\dinesh\notesaver-pro`
2. Create new file: `.env.local`
3. Open with Notepad
4. Add:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
5. Replace with your actual values
6. Save

#### Option B: Using Terminal
```bash
notepad .env.local
```
Then paste and edit as above.

**IMPORTANT:**
- Never commit `.env.local` to Git
- Keep your keys private
- The file is already in `.gitignore`

### Step 9: Start the Application

```bash
npm run dev
```

You should see:
```
VITE v6.4.2  ready in XXXms
➜  Local:   http://localhost:3000/
```

The app will automatically open in your browser!

### Step 10: Create Your First Account

1. App opens to login page
2. Click "Sign up" link
3. Fill in:
   - Full Name
   - Email
   - Password (min 6 characters)
   - Confirm Password
4. Click "Sign Up"
5. Check your email for verification link
6. Click verification link
7. Log in with your credentials

**Congratulations!** 🎉 You're now ready to use NoteSaver Pro!

---

## 🧪 Test the Application

Try these features:

### Create Notes
1. Dashboard shows welcome screen
2. Navigate to "All Notes"
3. Click "Create Note" (if button exists)
4. Fill in title and content
5. Watch it autosave!

### Organize Notes
- Click star to favorite
- Click pin to pin to top
- Change note color
- Add category
- Add tags

### Search & Filter
- Use search bar to find notes
- Filter by category
- Sort by date/name

### Try Dark/Light Mode
- Click sun/moon icon in navbar
- Theme toggles instantly!

---

## 🐛 Troubleshooting

### "Missing Supabase environment variables"

**Problem:** App won't start, shows error about missing env vars

**Solution:**
1. Check `.env.local` exists in project root
2. Verify it contains both variables
3. Values are correct (no typos)
4. Restart dev server: `Ctrl+C` then `npm run dev`

### "Failed to fetch" or Network Errors

**Problem:** Can't connect to Supabase

**Solution:**
1. Check internet connection
2. Verify Supabase project is active
3. Check URL is correct (should start with `https://`)
4. Ensure project ref matches

### Sign Up Doesn't Work

**Problem:** No error but account not created

**Solution:**
1. Check browser console for errors (F12)
2. Verify email format is valid
3. Password is at least 6 characters
4. Check Supabase dashboard > Logs

### Google OAuth Fails

**Problem:** Google login shows error

**Solution:**
1. Verify redirect URL matches exactly:
   ```
   https://[PROJECT-REF].supabase.co/auth/v1/callback
   ```
2. Check Google OAuth is enabled in Supabase
3. Verify Client ID and Secret are correct
4. Check Google Cloud Console for errors

### Database Tables Don't Exist

**Problem:** Errors about missing tables

**Solution:**
1. Re-run `supabase/schema.sql`
2. Check SQL Editor for any errors
3. Verify all tables created:
   - Go to Table Editor in Supabase
   - Should see: profiles, notes, note_activity

### Can't Login After Sign Up

**Problem:** Just created account but can't login

**Solution:**
1. Check email for verification link
2. Click verification link
3. Then try logging in
4. If no email received, check spam folder

---

## 📱 Access Your App

### Local Development
- URL: `http://localhost:3000`
- Only accessible on your computer
- Hot reload enabled (changes appear instantly)

### Share on Network (Optional)
```bash
npm run dev -- --host
```
This exposes the app on your local network for testing on mobile devices.

---

## 🎯 Next Steps

1. **Explore the Features**
   - Create multiple notes
   - Try all organization features
   - Test search and filters

2. **Customize**
   - Change colors in `tailwind.config.js`
   - Add more categories in `src/constants/index.ts`
   - Modify UI in component files

3. **Deploy to Production**
   - Follow `DEPLOYMENT_GUIDE.md`
   - Deploy to Vercel (free)
   - Get a custom domain (optional)

4. **Add Features**
   - See `PROJECT_SUMMARY.md` for enhancement ideas
   - Check implementation guide for code examples

---

## 📚 Helpful Resources

| Resource | Link |
|----------|------|
| Supabase Docs | https://supabase.com/docs |
| React Docs | https://react.dev |
| Vite Docs | https://vitejs.dev |
| Tailwind CSS | https://tailwindcss.com |
| Vercel Docs | https://vercel.com/docs |

---

## 🆘 Need Help?

1. **Check Documentation**
   - `README.md` - General info
   - `DEPLOYMENT_GUIDE.md` - Deployment help
   - `PROJECT_SUMMARY.md` - Feature list

2. **Check Logs**
   - Browser console (F12)
   - Supabase logs (dashboard)
   - Terminal output

3. **Community Support**
   - Supabase Discord: https://discord.supabase.com
   - GitHub Issues (if open source)

---

## ✅ Verification Checklist

Before considering setup complete, verify:

- [ ] npm install completed without errors
- [ ] Supabase project created
- [ ] All 3 SQL files executed successfully
- [ ] Tables visible in Supabase Table Editor
- [ ] `.env.local` created with correct values
- [ ] `npm run dev` starts successfully
- [ ] App opens in browser at localhost:3000
- [ ] Can sign up with email
- [ ] Can log in after verification
- [ ] Can create a note
- [ ] Theme toggle works
- [ ] No console errors (F12)

---

**You're all set!** Enjoy your NoteSaver Pro application! 🚀

For deployment instructions, see `DEPLOYMENT_GUIDE.md`.
