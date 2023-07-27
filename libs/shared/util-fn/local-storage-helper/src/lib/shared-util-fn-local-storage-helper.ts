export function getBenutzerId(): string | null {
  return localStorage.getItem('benutzerId');
}
export function setBenutzerId(benutzerId: string) {
  localStorage.setItem('benutzerId', benutzerId);
}
export function unsetBenutzerId() {
  localStorage.removeItem('benutzerId');
}
