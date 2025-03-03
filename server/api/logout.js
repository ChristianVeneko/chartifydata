import { defineEventHandler } from 'h3';

export default defineEventHandler((event) => {
  return {
    success: true,
    message: 'To logout, please clear your browser cookies and localStorage, then try logging in again.'
  };
}); 