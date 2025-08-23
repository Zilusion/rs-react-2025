import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>Hello I am an performance app!</StrictMode>,
  );
} else {
  throw new Error("Root element with id 'root' not found");
}
