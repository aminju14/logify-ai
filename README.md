# Logify AI - Log Book Automation

A modern, AI-powered daily log automation tool that transforms messy notes into structured reports, tracks work hours, and provides productivity insights.

![Dashboard Screenshot](./public/logify-ai-dashboard-screenshot.png)

## Features

### 📝 AI-Powered Report Generation
- **Intelligent Content Extraction**: Automatically identifies tasks, achievements, and issues from your daily notes
- **Professional Formatting**: Converts unstructured text into clean, professional report format
- **Smart Summarization**: Creates concise summaries for quick review
- **Auto-Classification**: Classifies logs into appropriate categories

### 📅 Calendar Integration
- **Visual Timeline**: View your work logs on an interactive calendar
- **Quick Entry**: Add new logs directly from calendar view
- **Daily Breakdown**: See detailed logs for each day at a glance

### 📊 Productivity Analytics
- **Time Tracking**: Monitor your work hours across different projects
- **Trend Analysis**: Track progress and productivity over time
- **Visual Reports**: Charts and graphs to visualize your work patterns

### 🔧 Customization
- **Personalized Templates**: Customize report format to match your style
- **AI Configuration**: Adjust AI behavior for different types of notes
- **Theme Support**: Light and dark mode support

## Getting Started

### Prerequisites
- **Node.js** 20.x or higher
- **npm** 10.x or higher
- **OpenAI API Key** (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/logify-ai.git
   cd logify-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   # AI Configuration
   OPENAI_API_KEY=your-openai-api-key-here

   # Optional: Set custom AI prompt
   # AI_PROMPT="You are a professional assistant. Convert these notes into a structured work report..."
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   Navigate to `http://localhost:3000` in your browser

### Usage

#### Adding a New Log
1. Click the **"Add Log"** button on the dashboard
2. Enter your daily notes in the text area
3. Click **"Generate Report"** to let AI process your notes
4. Review the structured report and make any edits
5. Click **"Save"** to store your log

#### Viewing Calendar
1. Navigate to the **"Calendar"** tab
2. Click on any date to view detailed logs for that day
3. Use the calendar to plan and review your work schedule

#### Analyzing Insights
1. Go to the **"Insights"** tab
2. View your productivity trends and statistics
3. Use the insights to improve your work efficiency

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the development server |
| `npm run build` | Builds the application for production |
| `npm run start` | Runs the production build |
| `npm run lint` | Runs ESLint to check code quality |
| `npm run format` | Formats code with Prettier |

## Technology Stack

### Framework
- **Next.js 14** (React framework with App Router)

### AI Integration
- **OpenAI API** (GPT-4o-mini for content processing)
- Custom prompts for structured data extraction

### Styling
- **Tailwind CSS** (utility-first CSS framework)
- **Shadcn/UI** (reusable UI components)
- **Lucide React** (icon library)

### State Management
- **React Context API** with `use-immer` for immutable state updates

### Data Storage
- **Local Storage** (browser-based storage)
- Future: **Supabase** integration planned

## Project Structure

```
logify-ai/
├── app/                      # Next.js App Router pages
│   ├── (auth)/              # Authentication pages (future)
│   ├── (dashboard)/         # Dashboard, calendar, insights
│   ├── layout.tsx           # Root layout
│   └── global.css           # Global styles

├── components/              # Reusable UI components
│   ├── ui/                  # Shadcn/UI components
│   ├── ai/                  # AI-related components
│   ├── calendar/            # Calendar components
│   ├── dashboard/           # Dashboard components
│   ├── layout/              # Layout components
│   └── insights/            # Analytics components

├── lib/                     # Utility functions
│   ├── ai.ts                # AI integration functions
│   ├── storage.ts           # Local storage utilities
│   ├── prompts.ts           # AI prompt templates
│   ├── utils.ts             # General utilities
│   └── validation.ts        # Data validation

├── public/                  # Static assets
├── types/                   # TypeScript type definitions
├── .env.local               # Environment variables
├── next.config.js           # Next.js configuration
└── tailwind.config.ts       # Tailwind configuration
```

## Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Use **TypeScript** for new features
- Follow **Shadcn/UI** component usage patterns
- Keep code clean and well-documented
- Add unit tests for new components

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Future Plans

- **Cloud Sync**: Sync logs across devices with Supabase
- **Team Collaboration**: Share reports with your team
- **Advanced Analytics**: Deeper insights and productivity benchmarks
- **Email Integration**: Send reports automatically
- **Mobile App**: Dedicated mobile PWA experience

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/UI](https://ui.shadcn.com/)
- [Lucide React](https://lucide.dev/)
- [OpenAI](https://openai.com/)

## Contact

**Project Maintainer**: Aminju

**Support**: If you encounter any issues, please open an issue in the repository.

---

Made with ❤️ using Next.js and Tailwind CSS

© 2026 **MinLabs**. All rights reserved.
