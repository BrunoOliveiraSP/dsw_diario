// Valores vindos do env.js (gerado a partir do .env)
const env = (window as any).env || {};

export const API_URL: string = env.API_URL || 'http://localhost:8080';
