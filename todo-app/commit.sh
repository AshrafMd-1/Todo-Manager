#!/bin/bash

# This script is used to commit the changes to the repository
#It combines all the steps of adding, committing, testing and pushing the changes to the repository
# It takes the commit message as an argument

# Check if the commit message is provided

if [ $# -eq 0 ]; then
  echo "No commit message provided"
  exit 1
fi

#Add all the files to the repository

git add --all

# Commit the changes

git commit -m "$1"

# Push the changes to the repository

git push origin master