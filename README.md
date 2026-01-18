# YouTube Companion Dashboard

A minimal full-stack MVP for managing YouTube videos with notes, comments, and AI-powered title suggestions.

## Features

- ✅ Display YouTube video details (title, description, views, likes, comments)
- ✅ Update video title and description
- ✅ Fetch, add, and delete comments
- ✅ Create, read, update, delete notes with text search and tagging
- ✅ AI-powered title suggestions using OpenAI
- ✅ Event logging for all user actions
- ✅ Fully responsive UI with Tailwind CSS

## Tech Stack

- **Frontend:** Next.js 14+ (App Router) with React + TypeScript
- **Backend:** Next.js API Routes (serverless)
- **Database:** MongoDB with Mongoose
- **Styling:** Tailwind CSS
- **AI:** OpenAI API (GPT-3.5)
- **Deployment:** Vercel

## Setup Instructions

### Prerequisites

- Node.js 16+
- npm or yarn
- MongoDB Atlas account (free tier)
- YouTube API key (from Google Cloud Console)
- OpenAI API key

### Installation

1. **Clone/Extract the project:**
   ```bash
   cd "YouTube Companion Dashboard"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local` file with:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/youtube-dashboard
   YOUTUBE_API_KEY=your_youtube_api_key
   YOUTUBE_VIDEO_ID=your_video_id
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Upload an unlisted video to YouTube** and copy its video ID to `.env.local`

5. **Run development server:**
   ```bash
   npm run dev
   ```

6. **Open http://localhost:3000** in your browser

## API Endpoints

### Video Management
- `GET /api/video` - Fetch video details
- `PATCH /api/video` - Update title and description

### Comments
- `GET /api/comments` - Fetch all comments on video
- `POST /api/comments` - Add a new comment
- `DELETE /api/comments/[id]` - Delete a comment

### Notes
- `GET /api/notes` - Get all notes (supports search via `?q=query`)
- `POST /api/notes` - Create a new note
- `PATCH /api/notes/[id]` - Update a note
- `DELETE /api/notes/[id]` - Delete a note

### AI
- `POST /api/ai/titles` - Generate 3 alternative title suggestions

### Logs
- `GET /api/logs` - Get event logs
- `POST /api/logs` - Create event log

## Database Schema

### Notes Collection
```
{
  _id: ObjectId
  videoId: String
  content: String (note text)
  tags: String (comma-separated tags)
  createdAt: Date
  updatedAt: Date
}
```

### EventLogs Collection
```
{
  _id: ObjectId
  action: String (e.g., "comment_added", "video_updated", "note_created")
  metadata: Mixed (JSON object with action details)
  timestamp: Date
  status: String ("success" or "error")
  createdAt: Date
  updatedAt: Date
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `YOUTUBE_API_KEY` | YouTube Data API v3 key |
| `YOUTUBE_VIDEO_ID` | Your uploaded video ID |
| `OPENAI_API_KEY` | OpenAI API key |

## Deployment to Vercel

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel:**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy!

3. **Live URL:** https://you-tube-companion-dashboard-henna.vercel.app/

## Key Features Summary

| Feature | Status |
|---------|--------|
| Display video details | ✅ |
| Update video metadata | ✅ |
| Comments (CRUD) | ✅ |
| Notes (CRUD + Search) | ✅ |
| AI Title Suggestions | ✅ |
| Event Logging | ✅ |
| Responsive UI | ✅ |

## Event Logs Example

The app logs the following actions:
- `video_updated` - When title/description changed
- `comment_added` - When a new comment posted
- `comment_deleted` - When a comment deleted
- `note_created` - When a new note created
- `note_deleted` - When a note deleted
- `ai_suggestions_generated` - When AI suggestions requested
- `ai_suggestion_selected` - When a suggestion applied

## Troubleshooting

**MongoDB Connection Error:**
- Verify connection string is correct
- Add your IP to MongoDB Atlas whitelist

**YouTube API Error:**
- Ensure video ID is correct and unlisted (not private)
- Check API quota in Google Cloud Console

**OpenAI Error:**
- Verify API key is valid
- Check account has credits

## Author

Built as a full-stack hiring test MVP - January 18, 2026

---

**Time spent:** ~3 hours | **Lines of code:** ~1000+ | **Features:** 8/8 MVP complete
