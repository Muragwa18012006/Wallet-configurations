export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatPiAmount(amount: number): string {
  return amount.toFixed(7);
}

export function truncateAddress(address: string, start = 6, end = 4): string {
  if (!address) return '';
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

export function isPiBrowser(): boolean {
  return typeof window !== 'undefined' && 
    (window as any).Pi !== undefined;
}

export function validatePiUsername(username: string): boolean {
  const regex = /^[a-zA-Z0-9_]{3,20}$/;
  return regex.test(username);
}
