export type LocalAccount = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type LocalUser = Pick<LocalAccount, "name" | "email" | "phone">;

// Prototype only: accounts live in memory and are cleared when the app restarts.
const accounts = new Map<string, LocalAccount>();
let currentUser: LocalUser | null = null;
let registrationNotice = false;

export function registerLocalAccount(account: LocalAccount): string | null {
  const email = account.email.trim().toLowerCase();
  if (accounts.has(email)) return "Email ini sudah terdaftar.";
  accounts.set(email, { ...account, email });
  registrationNotice = true;
  return null;
}

export function consumeRegistrationNotice(): boolean {
  const didRegister = registrationNotice;
  registrationNotice = false;
  return didRegister;
}

export function signInLocalAccount(email: string, password: string): LocalAccount | null {
  const account = accounts.get(email.trim().toLowerCase());
  if (!account || account.password !== password) return null;

  currentUser = { name: account.name, email: account.email, phone: account.phone };
  return account;
}

export function getCurrentUser(): LocalUser | null {
  return currentUser;
}

export function signOutLocalAccount() {
  currentUser = null;
}
