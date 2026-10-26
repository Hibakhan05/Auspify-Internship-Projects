/**
  A greeting name from an email address.
  "hibamateen@gmail.com" -> "Hibamateen", "sara.khan@x.com" -> "Sara".
  Trailing digits are dropped, separators split the name, the first word is
  capitalised. Falls back to the raw local part if nothing is left.
*/
export function friendlyName(email = "") {
  const local = email.split("@")[0] || "";
  const first = local.replace(/\d+$/, "").split(/[._+-]+/).filter(Boolean)[0] || local;
  return first ? first.charAt(0).toUpperCase() + first.slice(1) : "there";
}
