#!/bin/bash

# AvanAnomalyLab.net - Verification Script
# This script verifies all installations and dependencies are correct

set -e

echo "🔍 AvanAnomalyLab - Setup Verification"
echo "======================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ERRORS=0

# Function to check command
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $2: ${BLUE}$($1 $3)${NC}"
    else
        echo -e "${RED}✗${NC} $2: Not found"
        ((ERRORS++))
    fi
}

# Function to check npm package
check_npm_package() {
    if npm list $1 &> /dev/null; then
        VERSION=$(npm list $1 --depth=0 2>/dev/null | grep $1 | awk '{print $2}' | sed 's/@//')
        echo -e "${GREEN}✓${NC} $2: ${BLUE}$VERSION${NC}"
    else
        echo -e "${RED}✗${NC} $2: Not installed"
        ((ERRORS++))
    fi
}

echo "📋 System Tools:"
echo "----------------"
check_command "brew" "Homebrew" "--version | head -n1"
check_command "node" "Node.js" "--version"
check_command "npm" "npm" "--version"
check_command "git" "Git" "--version"
check_command "code" "VS Code" "--version | head -n1"

echo ""
echo "📦 Project Dependencies:"
echo "------------------------"

# Check if we're in a Next.js project
if [ ! -f "package.json" ]; then
    echo -e "${RED}✗${NC} Not in a Next.js project directory"
    echo -e "${YELLOW}ℹ${NC}  Please run this from your project directory"
    exit 1
fi

# Core dependencies
check_npm_package "next" "Next.js"
check_npm_package "react" "React"
check_npm_package "typescript" "TypeScript"
check_npm_package "tailwindcss" "Tailwind CSS"
check_npm_package "framer-motion" "Framer Motion"
check_npm_package "three" "Three.js"
check_npm_package "@react-three/fiber" "React Three Fiber"
check_npm_package "@react-three/drei" "Drei"
check_npm_package "lenis" "Lenis"
check_npm_package "next-themes" "Next Themes"

echo ""
echo "📁 Project Structure:"
echo "---------------------"

# Check directories
DIRS=("components/ui" "components/layout" "components/sections" "components/effects" "lib/utils" "lib/hooks" "public/images" "public/fonts" "styles")

for dir in "${DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓${NC} $dir/"
    else
        echo -e "${YELLOW}⚠${NC}  $dir/ (missing, will be created as needed)"
    fi
done

echo ""
echo "⚙️  Configuration Files:"
echo "------------------------"

# Check config files
FILES=(".vscode/settings.json" ".vscode/extensions.json" ".prettierrc" "tailwind.config.ts" "tsconfig.json" "next.config.mjs")

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file (missing)"
        ((ERRORS++))
    fi
done

echo ""
echo "🧪 Running Tests:"
echo "-----------------"

# Check if build works
echo -n "Building project... "
if npm run build &> /tmp/build-output.log; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    echo -e "${YELLOW}Check /tmp/build-output.log for details${NC}"
    ((ERRORS++))
fi

echo ""
echo "======================================"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    echo ""
    echo "🚀 You're ready to start developing!"
    echo ""
    echo "Quick start commands:"
    echo "  ${BLUE}npm run dev${NC}       - Start development server"
    echo "  ${BLUE}npm run build${NC}     - Build for production"
    echo "  ${BLUE}npm run lint${NC}      - Check code quality"
    echo ""
    echo "🎨 Development server will run at:"
    echo "  ${BLUE}http://localhost:3000${NC}"
    echo ""
    exit 0
else
    echo -e "${RED}❌ Found $ERRORS error(s)${NC}"
    echo ""
    echo "Please fix the errors above and run verification again."
    exit 1
fi