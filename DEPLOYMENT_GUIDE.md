# NoteSaver Pro - Complete Deployment Guide

## Pre-Deployment Checklist

Before deploying your NoteSaver Pro application, ensure you have completed the following:

### 1. Supabase Setup

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - Project name: `notesaver-pro`
   - Database password: (save this securely)
   - Region: Choose closest to your users
   - Pricing tier: Free tier is perfect for getting started

#### Run Database Migrations

Once your project is created:

1. Go to **SQL Editor** in the Supabase dashboard
2. Run the SQL files in this exact order:

**Step 1:** Run `supabase/schema.sql`
- Copy the entire content of the file
- Paste into the SQL Editor
- Click "Run"
- This creates the tables, indexes, and triggers

**Step 2:** Run `supabase/rls_policies.sql`
- Copy the entire content
- Paste into SQL Editor
- Click "Run"
- This enables Row Level Security policies

**Step 3:** Run `supabase/storage.sql`
- Copy the entire content
- Paste into SQL Editor
- Click "Run"
- This creates the avatar storage bucket

#### Enable Google OAuth

1. Go to **Authentication** > **Providers** in Supabase
2. Find **Google** and click it
3. Toggle "Enable Sign in with Google"
4. You need to create Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Go to **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Add authorized redirect URI: 
     ```
     https://<your-project-ref>.supabase.co/auth/v1/callback
     ```
   - Copy the **Client ID** and **Client Secret**
5. Paste these into Supabase Google OAuth settings
6. Click **Save**

#### Get Your API Keys

1. Go to **Project Settings** > **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbG...` (long string)

### 2. Local Environment Setup

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**IMPORTANT:** 
- Replace with your actual values
- Never commit this file to Git (it's in .gitignore)
- Keep your keys secure

### 3. Test Locally

Before deploying, test everything locally:

```bash
npm install
npm run dev
```

Test these features:
- [ ] Sign up with email
- [ ] Login with email
- [ ] Create a note
- [ ] Edit a note
- [ ] Delete a note
- [ ] Favorite a note
- [ ] Archive a note
- [ ] Search notes
- [ ] Theme toggle (dark/light)
- [ ] Sign out

---

## Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

#### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: NoteSaver Pro"
git branch -M main
git remote add origin https://github.com/yourusername/notesaver-pro.git
git push -u origin main
```

#### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/log in (GitHub login recommended)
3. Click **"Add New..."** > **Project**
4. Import your GitHub repository
5. Configure project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

#### Step 3: Set Environment Variables

In Vercel project settings:

1. Go to **Settings** > **Environment Variables**
2. Add these variables:
   ```
   VITE_SUPABASE_URL = https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY = your-anon-key-here
   ```
3. Make sure they're set for **Production**, **Preview**, and **Development**

#### Step 4: Deploy

1. Click **Deploy**
2. Wait for build to complete (~2-3 minutes)
3. Your app will be live at: `https://notesaver-pro.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name? notesaver-pro
# - Directory? ./
# - Override settings? N

# Set environment variables
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production

# Deploy to production
vercel --prod
```

---

## Custom Domain (Optional)

### Add Custom Domain to Vercel

1. Go to your Vercel project
2. Go to **Settings** > **Domains**
3. Add your domain (e.g., `notesaver.pro`)
4. Vercel will provide DNS records to configure:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```
5. Add these records to your domain registrar (Namecheap, GoDaddy, etc.)
6. Wait for DNS propagation (up to 48 hours)

---

## Post-Deployment Testing

After deployment, test your live application:

### Authentication
- [ ] Sign up works
- [ ] Email verification received
- [ ] Login works
- [ ] Google OAuth works
- [ ] Password reset works
- [ ] Logout works

### Notes Features
- [ ] Create note
- [ ] Edit note
- [ ] Delete note (with confirmation)
- [ ] Pin/unpin note
- [ ] Favorite/unfavorite note
- [ ] Archive/restore note
- [ ] Search notes
- [ ] Filter by category
- [ ] Sort notes

### UI/UX
- [ ] Responsive on mobile
- [ ] Theme toggle works
- [ ] Animations smooth
- [ ] Loading states show
- [ ] Error messages display
- [ ] Toast notifications work

### Security
- [ ] RLS policies working (users can't see others' notes)
- [ ] Protected routes redirect when logged out
- [ ] Session persists on refresh

---

## Troubleshooting

### "Missing Supabase environment variables"

**Solution:** 
- Ensure `.env.local` exists with correct values
- In Vercel, check environment variables are set
- Restart dev server after adding env vars

### Google OAuth Not Working

**Solution:**
- Verify redirect URL in Google Cloud Console matches exactly
- Check Google OAuth is enabled in Supabase
- Ensure Client ID and Secret are correct

### RLS Policy Errors

**Solution:**
- Run `supabase/rls_policies.sql` again
- Check Supabase logs in dashboard
- Verify user is authenticated before queries

### Build Fails on Vercel

**Solution:**
- Check build logs in Vercel
- Ensure all dependencies in package.json
- Verify environment variables are set
- Try `npm run build` locally first

### Notes Not Saving

**Solution:**
- Check browser console for errors
- Verify Supabase project is active
- Check database tables exist
- Verify RLS policies allow inserts

---

## Production Best Practices

### 1. Enable Supabase Backups
- Go to **Settings** > **Database**
- Enable automated backups
- Download backup regularly

### 2. Monitor Performance
- Use Supabase **Logs** to monitor queries
- Check Vercel **Analytics** for performance metrics
- Set up error tracking (Sentry recommended)

### 3. Security Enhancements
- Enable Supabase **WAF** (Web Application Firewall)
- Use strong passwords
- Regularly rotate API keys
- Monitor auth logs for suspicious activity

### 4. Database Optimization
- Indexes are already created for performance
- Monitor slow queries in Supabase logs
- Archive old notes to reduce database size

### 5. Backup Strategy
- Export notes regularly using the export feature
- Keep local backups of important data
- Document your setup configuration

---

## Monitoring & Analytics

### Recommended Tools

**Error Tracking:**
- Sentry (free tier available)
- LogRocket

**Analytics:**
- Plausible Analytics (privacy-focused)
- Vercel Analytics (built-in)

**Uptime Monitoring:**
- UptimeRobot (free)
- Pingdom

---

## Scaling Considerations

When your app grows:

### Database
- Upgrade Supabase plan for more storage/row limits
- Consider partitioning tables if >100k notes per user
- Add database read replicas for high traffic

### Performance
- Implement Redis caching for frequently accessed data
- Use Supabase Edge Functions for complex operations
- Add CDN for static assets

### Infrastructure
- Upgrade Vercel plan for more serverless function executions
- Consider dedicated hosting if needed
- Implement rate limiting

---

## Support & Resources

### Documentation
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)

### Community
- [Supabase Discord](https://discord.supabase.com)
- [Vercel Discord](https://vercel.com/discord)
- GitHub Issues for bug reports

---

## Maintenance Tasks

### Weekly
- Check error logs
- Review user feedback
- Monitor database usage

### Monthly
- Update dependencies: `npm update`
- Review and optimize database queries
- Check for security updates
- Backup database

### Quarterly
- Review and update dependencies
- Audit RLS policies
- Test disaster recovery
- Review analytics and optimize

---

## License & Credits

This project is open-source and available under the MIT License.

Built with:
- React 19
- Supabase
- Vercel
- Tailwind CSS
- Vite

---

**Congratulations!** Your NoteSaver Pro application is now deployed and ready to use! 🎉

For any issues or questions, refer to the troubleshooting section or reach out to the community.
