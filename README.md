# IslandGo AI Growth Strategy Demo Platform

A modern, AI-powered growth strategy demonstration platform for food discovery platforms. This Next.js application showcases three core features: Automated Creator Recruitment, Content Gap Intelligence, and Viral Marketing Loops.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwind-css)

## 🚀 Features

- **Automated Creator Recruitment**: AI-powered system that identifies, recruits, and onboards content creators at scale
- **Content Gap Intelligence**: Advanced analytics that pinpoint geographic and content gaps
- **Viral Marketing Loops**: Engineered content strategies that create self-perpetuating viral loops
- **Modern UI**: Beautiful cream-colored theme with glassmorphism effects
- **Responsive Design**: Mobile-first design that works on all devices
- **Type-Safe**: Built with TypeScript for better developer experience

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher (or yarn/pnpm)

## 🛠️ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd islandgo-ai-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_actual_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🌍 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key for AI features | Yes |

See `.env.example` for a template.

## 📁 Project Structure

```
islandgo-ai-demo/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Home page
│   │   ├── layout.tsx             # Root layout
│   │   ├── creator-recruitment/  # Creator recruitment feature
│   │   ├── content-gaps/         # Content gap intelligence
│   │   └── viral-content/        # Viral marketing loops
│   ├── components/
│   │   └── Navigation.tsx       # Navigation component
│   └── globals.css               # Global styles
├── public/                        # Static assets
├── .env.example                   # Environment variables template
├── next.config.ts                 # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Dependencies
```

## 🚀 Deploy to Vercel

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/islandgo-ai-demo)

### Manual Deployment Steps

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add your environment variables in Vercel dashboard:
   - `ANTHROPIC_API_KEY`: Your Anthropic API key
4. Click "Deploy"

Vercel will automatically:
- Detect Next.js
- Run `npm install` and `npm run build`
- Deploy your application

## 🎨 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI SDK**: [Anthropic SDK](https://github.com/anthropics/anthropic-sdk-typescript)

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

This is a demo project. For questions or issues, please contact the development team.

## 📞 Support

For support, please open an issue in the repository or contact the development team.

---

Built with ❤️ using Next.js and TypeScript
