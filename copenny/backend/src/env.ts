// This MUST be the very first file imported in index.ts
// It loads .env before any other module reads process.env
import dotenv from 'dotenv';
dotenv.config();
