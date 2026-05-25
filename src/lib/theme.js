// Utility for managing Light & Dark Mode theme switching

export const getSystemTheme = () => {
  return localStorage.getItem('theme') || 'light';
};

export const setSystemTheme = (theme) => {
  localStorage.setItem('theme', theme);
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  window.dispatchEvent(new CustomEvent('themeUpdated', { detail: { theme } }));
};

export const initSystemTheme = () => {
  const theme = localStorage.getItem('theme') || 'light';
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};
