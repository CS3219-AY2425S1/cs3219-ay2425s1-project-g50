export const isPasswordComplex = (password: string) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(
    password
  );

  return password.length >= minLength && hasUpperCase && hasSpecialChar;
};
