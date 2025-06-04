// services/authService.js
export const login = async (email, password) => {
  if (email === 'admin@agro.com' && password === '1234') return true;
  return false;
};

export const signup = async (email, password) => {
  // Here you would normally send a request to your backend
  return true;
};
