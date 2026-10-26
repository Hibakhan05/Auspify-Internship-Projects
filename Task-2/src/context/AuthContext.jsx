import { createContext, useCallback, useMemo, useState } from "react";
import { readJSON, removeKey, writeJSON } from "../lib/storage";
import { makeId } from "../lib/id";

export const AuthContext = createContext(null);

const USERS_KEY = "clareo.users.v1";
const SESSION_KEY = "clareo.session.v1";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  if (window.crypto?.subtle) {
    const buf = await window.crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  // Fallback for insecure contexts where SubtleCrypto is unavailable.
  let h = 5381;
  data.forEach((b) => {
    h = ((h << 5) + h + b) >>> 0;
  });
  return String(h);
}

const publicUser = (u) => ({ id: u.id, email: u.email, createdAt: u.createdAt });

function restoreSession() {
  const session = readJSON(SESSION_KEY, null);
  if (!session) return null;
  const user = readJSON(USERS_KEY, []).find((u) => u.id === session.userId);
  return user ? publicUser(user) : null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(restoreSession);

  const signUp = useCallback(async ({ email, password }) => {
    const clean = email.trim().toLowerCase();
    if (!EMAIL_RE.test(clean)) {
      return { ok: false, field: "email", message: "Enter a valid email address." };
    }
    if (password.length < 8) {
      return { ok: false, field: "password", message: "Use at least 8 characters." };
    }
    const users = readJSON(USERS_KEY, []);
    if (users.some((u) => u.email === clean)) {
      return { ok: false, field: "email", message: "An account with this email already exists." };
    }
    const salt = makeId();
    const record = {
      id: makeId(),
      email: clean,
      salt,
      passwordHash: await hashPassword(password, salt),
      createdAt: new Date().toISOString(),
    };
    writeJSON(USERS_KEY, [...users, record]);
    writeJSON(SESSION_KEY, { userId: record.id });
    setUser(publicUser(record));
    return { ok: true };
  }, []);

  const logIn = useCallback(async ({ email, password }) => {
    const clean = email.trim().toLowerCase();
    const record = readJSON(USERS_KEY, []).find((u) => u.email === clean);
    const failure = { ok: false, field: "form", message: "Email or password is incorrect." };
    if (!record) return failure;
    if ((await hashPassword(password, record.salt)) !== record.passwordHash) return failure;
    writeJSON(SESSION_KEY, { userId: record.id });
    setUser(publicUser(record));
    return { ok: true };
  }, []);

  // Clears the session only. Tasks stay on the device for the next login.
  const logOut = useCallback(() => {
    removeKey(SESSION_KEY);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, signUp, logIn, logOut }), [user, signUp, logIn, logOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
