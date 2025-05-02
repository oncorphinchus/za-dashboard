#!/bin/bash

# Install dependencies
npm install
npm install --save-dev @types/node @types/react @types/react-dom

# Install shadcn/ui components
npx shadcn-ui@latest init --yes
npx shadcn-ui@latest add button card dialog table toast alert-dialog

# Build the project
npm run build

echo "Installation complete! You can start the development server with: npm run dev" 