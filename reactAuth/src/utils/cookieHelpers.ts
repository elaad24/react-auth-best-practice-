export function getCookie(name: string): string | null {
  const value: string = `; ${document.cookie}`;
  const parts: string[] = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export function setCookie(
  name: string,
  value: string,
  minutes: number,
  path: string = "/"
) {
  let expires = "";

  if (minutes) {
    const date = new Date();
    date.setTime(date.getTime() + minutes * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }

  document.cookie = `${name}=${encodeURIComponent(
    value
  )}${expires}; path=${path}`;
}
