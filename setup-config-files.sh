#!/bin/bash

# AvanAnomalyLab - Config Files Setup Script
# This script creates all necessary configuration files

set -e

echo "🔬 Setting up AvanAnomalyLab Configuration Files"
echo "================================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if we're in the right directory
if [ ! -d "components" ] || [ ! -d "app" ]; then
    echo -e "${RED}❌ Error: This script must be run from the avan-anomaly-lab root directory${NC}"
    echo "Please run: cd /Users/apple/Desktop/avan-anomaly-lab"
    exit 1
fi

echo -e "${BLUE}📋 Creating configuration files...${NC}"
echo ""

# 1. package.json
echo -e "${YELLOW}Creating package.json...${NC}"
cat > package.json << 'PACKAGEEOF'
{
  "name": "avan-anomaly-lab",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "react": "^18",
    "react-dom": "^18",
    "next": "14.2.18",
    "framer-motion": "11.11.17",
    "three": "0.169.0",
    "@react-three/fiber": "8.17.10",
    "@react-three/drei": "9.114.3",
    "lenis": "1.1.13",
    "next-themes": "0.3.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.5"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@types/three": "0.169.0",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "eslint": "^8",
    "eslint-config-next": "14.2.18",
    "prettier": "3.3.3",
    "prettier-plugin-tailwindcss": "0.6.8"
  }
}
PACKAGEEOF
echo -e "${GREEN}✓${NC} package.json created"

# 2. tsconfig.json
echo -e "${YELLOW}Creating tsconfig.json...${NC}"
cat > tsconfig.json << 'TSCONFIGEOF'
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
TSCONFIGEOF
echo -e "${GREEN}✓${NC} tsconfig.json created"

# 3. next.config.mjs
echo -e "${YELLOW}Creating next.config.mjs...${NC}"
cat > next.config.mjs << 'NEXTCONFIGEOF'
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
NEXTCONFIGEOF
echo -e "${GREEN}✓${NC} next.config.mjs created"

# 4. postcss.config.mjs
echo -e "${YELLOW}Creating postcss.config.mjs...${NC}"
cat > postcss.config.mjs << 'POSTCSSEOF'
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
POSTCSSEOF
echo -e "${GREEN}✓${NC} postcss.config.mjs created"

# 5. .eslintrc.json
echo -e "${YELLOW}Creating .eslintrc.json...${NC}"
cat > .eslintrc.json << 'ESLINTEOF'
{
  "extends": "next/core-web-vitals"
}
ESLINTEOF
echo -e "${GREEN}✓${NC} .eslintrc.json created"

# 6. .gitignore
echo -e "${YELLOW}Creating .gitignore...${NC}"
cat > .gitignore << 'GITIGNOREEOF'
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# IDEs
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
.idea
GITIGNOREEOF
echo -e "${GREEN}✓${NC} .gitignore created"

# 7. .prettierrc (if not exists)
if [ ! -f ".prettierrc" ]; then
    echo -e "${YELLOW}Creating .prettierrc...${NC}"
    cat > .prettierrc << 'PRETTIEREOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2,
  "plugins": ["prettier-plugin-tailwindcss"]
}
PRETTIEREOF
    echo -e "${GREEN}✓${NC} .prettierrc created"
fi

# 8. README.md
echo -e "${YELLOW}Creating README.md...${NC}"
cat > README.md << 'READMEEOF'
# 🔬 AvanAnomalyLab.net

A rebel scientist's personal portfolio - Where philosophy meets maximalist retro-tech aesthetics.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **3D Graphics:** Three.js + React Three Fiber + Drei
- **Smooth Scrolling:** Lenis
- **Theme:** Next Themes (dark mode support)

## 💻 Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

Visit [http://localhost:3000](http://localhost:3000) to see your site.

## 🔬 Built by Avan

Exploring the anomalies in code, science, and philosophy.

---

*"Breaking the fourth wall of conventional web design"*
READMEEOF
echo -e "${GREEN}✓${NC} README.md created"

echo ""
echo -e "${GREEN}✅ All configuration files created successfully!${NC}"
echo ""
echo -e "${BLUE}📦 Next steps:${NC}"
echo "1. Run: npm install"
echo "2. Run: npm run dev"
echo "3. Visit: http://localhost:3000"
echo ""
echo -e "${YELLOW}💡 Tip: Run './verify-setup.sh' to verify everything is correct${NC}"