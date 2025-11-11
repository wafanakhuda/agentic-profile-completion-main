# 🔑 Environment Variables Setup Guide

## Production Deployment Checklist

### ✅ REQUIRED (3 variables - dashboard won't work without these)

#### 1. **ANTHROPIC_API_KEY**
- **Purpose:** Powers the Claude AI agent for strategic decision-making
- **Get it:** https://console.anthropic.com/account/keys
- **Format:** `sk-ant-...`
- **Cost:** ~$0.01-0.02 per student processed

#### 2. **SENDGRID_API_KEY**
- **Purpose:** Sends professional HTML emails with tracking
- **Get it:** https://app.sendgrid.com/settings/api_keys
- **Format:** `SG....`
- **Cost:** Free tier available (100 emails/day)

#### 3. **GOOGLE_FORM_URL**
- **Purpose:** Link in nudge emails where students complete profiles
- **Get it:** Create a Google Form and copy the shareable URL
- **Format:** `https://forms.google.com/d/e/xxxxx/viewform`
- **Cost:** Free (Google Forms)

---

### 📋 OPTIONAL (Recommended for production)

- `EXCEL_FILE_PATH` - Path to student data file
- `PROFILE_COMPLETION_DEADLINE` - Deadline shown in emails
- `FROM_EMAIL` - Sender email address
- `FROM_NAME` - Sender display name
- `SUPPORT_EMAIL` - Support contact in emails
- `GMAIL_ADDRESS`, `GMAIL_APP_PASSWORD` - Gmail SMTP alternative

---

## 🚀 Setup Instructions for Vercel

### Step 1: Get API Keys
1. Anthropic: https://console.anthropic.com/account/keys
2. SendGrid: https://app.sendgrid.com/settings/api_keys
3. Google Form: Create and copy URL

### Step 2: Add to Vercel
1. Go to **Vercel Dashboard → Your Project → Settings → Environment Variables**
2. Click "Add New"
3. Add each variable:
   \`\`\`
   ANTHROPIC_API_KEY = sk-ant-xxx...
   SENDGRID_API_KEY = SG.xxx...
   GOOGLE_FORM_URL = https://forms.google.com/d/e/xxx/viewform
   \`\`\`
4. Select **Production** environment
5. Save and redeploy

### Step 3: Deploy
Push to main branch to activate variables

---

## 💰 Estimated Costs (Monthly)

| Component | Usage | Cost |
|-----------|-------|------|
| Claude API | 100 students | ~$1.50 |
| SendGrid | 1000 emails | Free* |
| Vercel Hosting | Included | $0 |
| **Total** | Per 100 students | **~$1.50** |

*SendGrid free tier: 100 emails/day

---

## ⚠️ Security Best Practices

1. ✅ Never commit .env file (already in .gitignore)
2. ✅ Use Vercel environment variables only
3. ✅ Rotate API keys regularly
4. ✅ Monitor SendGrid dashboard for usage
5. ✅ Check Anthropic credits weekly

---

## ✅ Verification Checklist

- [ ] ANTHROPIC_API_KEY set in Vercel
- [ ] SENDGRID_API_KEY set in Vercel
- [ ] GOOGLE_FORM_URL set in Vercel
- [ ] All 3 required variables in Production environment
- [ ] Deployed to Vercel (git push)
- [ ] Dashboard loads without errors

**Then you're ready for production!** 🚀
