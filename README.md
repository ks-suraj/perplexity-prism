# Perplexity Prism

A modern, AI-powered research tool with a beautiful, Perplexity AI-inspired interface. Explore research topics through interactive conversation and visual flow diagrams.

![Perplexity Prism](https://img.shields.io/badge/Design-Perplexity%20AI%20Inspired-blue)
![React](https://img.shields.io/badge/React-19.1.1-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.11-38B2AC)
![Vite](https://img.shields.io/badge/Vite-7.1.0-646CFF)

## ✨ Features

### 🎨 Modern Design
- **Perplexity AI-inspired UI**: Clean, minimal, and highly polished interface
- **Responsive Design**: Perfect scaling for desktop, tablet, and mobile
- **Smooth Animations**: Subtle micro-interactions and transitions
- **Accessibility**: WCAG-compliant with keyboard navigation and ARIA labels

### 🔬 Research Modes
- **Research Flow**: Visual node-based research exploration
- **Chat Interface**: Conversational research with threaded discussions
- **Interactive Nodes**: Drag, connect, and organize research insights

### 🤖 AI-Powered Features
- **Smart Q&A**: Ask questions and get AI-generated answers
- **Context Awareness**: Follow-up questions maintain conversation context
- **Auto-Summarization**: Generate TLDR summaries for any research node
- **Dynamic Generation**: Real-time answer regeneration and refinement

### 🛠️ Technical Features
- **React 19**: Latest React with modern hooks and patterns
- **Tailwind CSS 4**: Utility-first styling with custom design system
- **ReactFlow**: Interactive node-based flow diagrams
- **Zustand**: Lightweight state management
- **Lucide Icons**: Beautiful, consistent iconography

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd perplexity-prism

# Install dependencies
npm install

# Start the development server
npm run dev

# Start the backend server (in a separate terminal)
npm run server
```

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 🎨 Design System

This project features a comprehensive design system inspired by Perplexity AI:

### Colors
- **Primary**: Blue gradient (`#3b82f6` to `#1e3a8a`)
- **Secondary**: Purple gradient (`#a855f7` to `#581c87`)
- **Neutral**: Gray scale with proper contrast ratios
- **Semantic**: Success, warning, and error states

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300-800 range
- **Hierarchy**: Clear text sizing and spacing

### Components
- **Buttons**: Primary, secondary, and ghost variants
- **Cards**: Elevated with hover effects
- **Inputs**: Search and standard variants
- **Icons**: Lucide React icon set

See [STYLE_GUIDE.md](./STYLE_GUIDE.md) for complete design system documentation.

## 📱 Usage

### Research Flow Mode
1. **Ask a Question**: Use the search bar to ask your research question
2. **Explore Nodes**: Click on nodes to expand and see AI-generated answers
3. **Add Follow-ups**: Create connected research threads
4. **Generate TLDR**: Summarize any research node
5. **Visualize**: Drag and connect nodes to create research maps

### Chat Mode
1. **Start Conversation**: Ask questions in the chat interface
2. **Threaded Discussion**: Follow-up questions create conversation threads
3. **Context Preservation**: AI maintains conversation context
4. **Quick Actions**: Regenerate, summarize, or add follow-ups

## 🏗️ Architecture



### Backend Integration
- **Express Server**: RESTful API endpoints
- **AI Integration**: perplexity API integration
- **Context Management**: Conversation history and context paths

## 🎯 Key Components

### Research Flow
- Interactive node-based research visualization
- Drag-and-drop functionality
- Connection management between research nodes
- Real-time AI answer generation

### Chat Interface
- Modern chat UI with message bubbles
- Threaded conversation support
- Context-aware follow-up questions
- Quick action buttons for each message

### Design System
- Consistent component library
- Responsive design patterns
- Accessibility features
- Performance optimizations

## 🔧 Customization

### Styling
The design system is built with Tailwind CSS and can be customized in:
- `tailwind.config.js` - Design tokens and theme
- `src/index.css` - Global styles and component classes
- `STYLE_GUIDE.md` - Complete design system documentation

### Adding New Features
1. Create new components following the design system
2. Use the established color palette and typography
3. Follow accessibility guidelines
4. Add proper loading states and error handling

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the design system guidelines
4. Add tests for new functionality
5. Submit a pull request

## 🙏 Acknowledgments

- **Perplexity AI**: Design inspiration and UX patterns
- **React Team**: Amazing framework and ecosystem
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide**: Beautiful icon library
- **ReactFlow**: Interactive flow diagrams

---

Built with ❤️ and modern web technologies
