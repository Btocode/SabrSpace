# SabrSpace

*A Space for Sincere Connection* - Create secure, anonymous question sets for your community, students, or team. Foster honesty and reflection through meaningful conversations.

![SabrSpace Banner](https://img.shields.io/badge/Built%20for-Ihsan-green?style=for-the-badge&logo=heart)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)

## 🌟 What is SabrSpace?

SabrSpace is a modern web application designed for creating and sharing thoughtful question sets. Built with Islamic principles of Amanah (trust) and Ihsan (excellence), it enables communities, educators, and teams to collect honest, sincere responses through:

- **Anonymous Submissions**: Optional anonymity encourages truthful answers
- **Secure & Private**: Encrypted data with complete privacy protection
- **Bilingual Support**: Full English and Bengali language support
- **Beautiful UI**: Islamic-inspired design with clean, meaningful aesthetics
- **Real-time Responses**: Live response collection and management

## ✨ Features

### 🔐 Authentication & Security
- Custom JWT-based authentication system
- Anonymous user support with email verification
- Secure password hashing with bcrypt
- Protected routes and middleware

### 📝 Question Set Management
- Create rich question sets with multiple types
- Drag-and-drop question reordering
- Settings for anonymity and attestation requirements
- Real-time response collection

### 🌍 Multilingual Support
- Full English and Bengali localization
- Persistent language preferences
- Culturally appropriate translations
- Islamic terminology properly contextualized

### 📊 Dashboard & Analytics
- Comprehensive response analytics
- Question set management dashboard
- Response viewing and export capabilities
- Real-time statistics

### 🎨 Beautiful Design
- Islamic geometric patterns
- Clean, minimal interface
- Responsive design for all devices
- Custom toast notifications
- Smooth animations and transitions

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Full type safety and developer experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Hook Form** - Performant forms with validation
- **TanStack Query** - Powerful data synchronization
- **Wouter** - Lightweight routing

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **Drizzle ORM** - Type-safe database operations
- **PostgreSQL** - Robust relational database
- **JWT** - JSON Web Token authentication
- **bcrypt** - Password hashing

### Development & Deployment
- **ESLint** - Code linting and formatting
- **TypeScript** - Type checking
- **Vite** - Development server and building
- **Supabase** - Database hosting (recommended)

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and pnpm
- PostgreSQL database (local or Supabase)

### 1. Clone the Repository
```bash
git clone https://github.com/Btocode/SabrSpace.git
cd SabrSpace
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/sabrspace
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
```

### 4. Database Setup
```bash
# Push database schema
pnpm run db:push

# (Optional) Generate types from database
pnpm run db:generate
```

### 5. Start Development Server
```bash
pnpm run dev
```

Visit `http://localhost:5000` to see the application.

### 6. Build for Production
```bash
pnpm run build
pnpm run start
```

## 📖 Usage

### For Question Set Creators
1. **Sign Up/Login**: Create an account or continue anonymously
2. **Create Question Set**: Use the intuitive form to build your questions
3. **Configure Settings**: Set anonymity, attestation, and other preferences
4. **Share Link**: Get a unique shareable URL for your question set
5. **View Responses**: Monitor responses in real-time on your dashboard

### For Respondents
1. **Access Link**: Click the shared question set link
2. **Language Selection**: Choose English or Bengali
3. **Answer Questions**: Provide thoughtful responses
4. **Optional Attestation**: Accept sacred commitment if required
5. **Submit**: Your responses are securely stored

## 🏗️ Architecture

```
SabrSpace/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and configurations
│   │   └── ...
├── server/                 # Backend Node.js application
│   ├── auth/              # Authentication system
│   ├── routes.ts          # API routes
│   ├── storage.ts         # File/data storage utilities
│   └── ...
├── shared/                 # Shared types and schemas
│   ├── schema.ts          # Database schema definitions
│   ├── routes.ts          # API route definitions
│   └── models/            # Data models
└── ...
```

### Key Components

- **Authentication System**: JWT-based with anonymous user support
- **Question Set Builder**: Drag-and-drop interface for creating questions
- **Response Collection**: Secure, anonymous response submission
- **Dashboard**: Comprehensive analytics and management
- **Internationalization**: Full i18n with localStorage persistence

## 🤝 Contributing

We welcome contributions to SabrSpace! Here's how to get started:

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes with proper TypeScript types
4. Test thoroughly and ensure no linting errors
5. Commit with descriptive messages
6. Push and create a Pull Request

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Follow the configured linting rules
- **Commits**: Use conventional commit format
- **Tests**: Add tests for new features
- **Documentation**: Update docs for API changes

### Areas for Contribution
- 🌍 Additional language support
- 📱 Mobile app development
- 📊 Advanced analytics features
- 🎨 UI/UX improvements
- 🔒 Security enhancements
- 📈 Performance optimizations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Islamic Inspiration**: Built with principles of Amanah (trust) and Ihsan (excellence)
- **Open Source Community**: Thanks to all the amazing open-source libraries and tools
- **Contributors**: Every contribution makes SabrSpace better

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/Btocode/SabrSpace/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Btocode/SabrSpace/discussions)
- **Email**: For private inquiries

---

**"And whoever relies upon Allah - then He is sufficient for him."** - Quran 65:3

*Built with love for fostering meaningful, sincere connections in our communities.*

