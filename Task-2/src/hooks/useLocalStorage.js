import { useEffect, useState } from "react";
import { readJSON, writeJSON } from "../lib/storage";

/** useState that mirrors itself into localStorage. */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readJSON(key, initialValue));

  useEffect(() => {
    writeJSON(key, value);
  }, [key, value]);

  return [value, setValue];
}
