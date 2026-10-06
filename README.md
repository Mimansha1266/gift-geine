# 🎁 Gift Genie

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19+-61DAFB?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Status](https://img.shields.io/badge/Status-Active_Development-success?style=for-the-badge)

**Your Personal AI-Powered Gift Recommendation & Celebration Platform.**

[Report Bug](https://github.com/Mimansha1266/gift-geine/issues) · [Request Feature](https://github.com/Mimansha1266/gift-geine/issues)

</div>

---

## 📖 About The Project

Finding the perfect gift can be stressful, whether for birthdays, anniversaries, holidays, or corporate events. **Gift Genie** takes the guesswork out of gifting by offering personalized gift suggestions tailored to recipient preferences, occasions, relationships, and budgets.

Built with performance, modern UX, and scalability in mind using Next.js App Router, React Context for state management, and modern component design.

---

## ✨ Features

- 🎯 **Tailored Recommendations**: Intelligent suggestions filtered by budget, occasion, recipient interests, and relationship.
- 👥 **Multi-Role Experience**: Custom access, flows, and capabilities tailored for users, gift creators/vendors, and admins.
- ⚡ **Modern & Responsive UI**: Clean, mobile-first design crafted with Tailwind CSS and reusable modular components.
- 🔐 **Authentication & Context**: Global state management handling sessions, user preferences, and saved gift registries.
- 📦 **Scalable Data Architecture**: Cleanly decoupled models, client context, and mock/API services ready for cloud integrations.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Library**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Linting & Formatting**: ESLint (Flat Config)
- **State Management**: React Context API
- **Deployment**: Vercel / Cloudflare

---

## 📁 Project Structure

```bash
gift-geine/
├── app/                  # Next.js App Router (Pages, layouts, and API routes)
├── components/           # Reusable UI elements (Buttons, Cards, Modals)
├── context/              # Global state providers (Auth, Preferences, Cart/Wishlist)
├── data/                 # Static datasets, mock recommendations, and schemas
├── lib/                  # Helper utilities, constants, and API clients
├── models/               # Data structures, schemas, and TypeScript/data models
├── public/               # Static assets, icons, and branding images
├── .env.example          # Environment variable templates
└── eslint.config.mjs     # ESLint configuration
```

---

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

Make sure you have Node.js and a package manager installed:
- [Node.js](https://nodejs.org/) (v18.17 or higher recommended)
- `npm`, `yarn`, `pnpm`, or `bun`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Mimansha1266/gift-geine.git
   cd gift-geine
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file and fill in your keys:
   ```bash
   cp .env.example .env.local
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application live.

---

## ⚙️ Available Scripts

In the project directory, you can run:

- `npm run dev` — Starts the development server with Hot Module Replacement.
- `npm run build` — Compiles and builds the production bundle.
- `npm run start` — Runs the compiled production build locally.
- `npm run lint` — Runs ESLint to check for code consistency and errors.

---

## 🤝 Contributing

Contributions make the open-source community an incredible place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📬 Contact & Author

**Mimansha Chaudhary**  
- GitHub: [@Mimansha1266](https://github.com/Mimansha1266)
- Project Link: [https://github.com/Mimansha1266/gift-geine](https://github.com/Mimansha1266/gift-geine)
