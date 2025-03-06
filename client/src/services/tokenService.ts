export function setToken(token: string): void {
  localStorage.setItem("sport-arena-token", token);
}

export function getToken(): string | null {
  const token = localStorage.getItem("sport-arena-token");
  if (token) {
    return token;
  }
  return "";
}

export function removeToken(): void {
  localStorage.removeItem("sport-arena-token");
}
