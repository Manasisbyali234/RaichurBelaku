#!/bin/bash
# Deploy to GitHub Pages
npm run build
cd dist
git init
git add -A
git commit -m 'deploy'
git push -f https://github.com/YOUR_USERNAME/YOUR_REPO.git main:gh-pages
cd ..