#!/bin/bash

# Remove lock files if they exist
[ -f .git/config.lock ] && rm .git/config.lock
[ -f .git/index.lock ] && rm .git/index.lock

# Git operations
git add .
git commit -m "Initial commit - NutriFlow enterprise diet planner with professional UI"
git branch -M main
git remote add origin https://github.com/TTGit-77/1credit.git
git push -u origin main

echo "Successfully pushed to GitHub repository!"