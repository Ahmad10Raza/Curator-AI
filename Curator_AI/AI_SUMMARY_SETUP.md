# AI Daily Summary - Environment Setup

## Required Environment Variables

Add these to your `.env` file:

```env
# OpenAI API Key (for AI summary generation)
OPENAI_API_KEY=your_openai_api_key_here

# Resend API Key (for email delivery)
RESEND_API_KEY=re_L2kKe4o3_GvCgEimx6C2tAMN8P872yjfd

# Email sender address
FROM_EMAIL=noreply@yourdomain.com

# Cron secret (for securing the cron endpoint)
# Generate a random string for this
CRON_SECRET=Fohz98Tgduzypt+kUs8h5yXoHLeMqm5GAnT0b0xuQ28=

# NextAuth URL (should already be set)
NEXTAUTH_URL=https://your-domain.com
```

## Setup Instructions

1. **Get OpenAI API Key**:
   - Go to <https://platform.openai.com/api-keys>
   - Create a new API key
   - Add it to your `.env` file

2. **Resend Email** (Already configured):
   - API key is already provided
   - Update `FROM_EMAIL` to match your verified domain in Resend

3. **Generate Cron Secret**:

   ```bash
   openssl rand -base64 32
   ```

   Add the output to your `.env` file

4. **Deploy to Vercel**:
   - Push your code to GitHub
   - Vercel will automatically detect `vercel.json` and set up the cron job
   - Add all environment variables in Vercel dashboard (Settings → Environment Variables)

## Testing

### Manual Summary Generation

```bash
curl -X POST http://localhost:3000/api/summaries \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{"date": "2024-12-02"}'
```

### Test Cron Endpoint

```bash
curl -X GET http://localhost:3000/api/cron/daily-summary \
  -H "Authorization: Bearer your_cron_secret"
```

## Vercel Cron Configuration

The cron job is configured in `vercel.json`:

- **Schedule**: Daily at midnight (00:00 UTC)
- **Endpoint**: `/api/cron/daily-summary`
- **Security**: Protected by `CRON_SECRET` header

## Features

✅ AI-powered daily summaries using GPT-4o-mini
✅ Email delivery via Resend
✅ Timeline page to view all summaries
✅ Automatic cron execution on Vercel
✅ Weak area detection
✅ Personalized suggestions
