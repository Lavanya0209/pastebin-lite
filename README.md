# Pastebin-Lite

## Description
A simple Pastebin-like application that allows users to create text pastes
with optional time-based expiry (TTL) and view-count limits.

## Local Setup
npm install
npm run dev

## Persistence Layer
This application uses Vercel KV (Redis) to ensure data persists across
serverless requests and deployments.