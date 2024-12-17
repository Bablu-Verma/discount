
export function setClientCookie(cookie_name:string, cookie_value:string, duration_in_minutes:number) {
    const now = new Date();
    if (duration_in_minutes === 0) {
        now.setTime(now.getTime() - 1);
    } else {
        now.setTime(now.getTime() + (duration_in_minutes * 60 * 1000)); 
    }
  
    const expires = `expires=${now.toUTCString()}`;
    // document.cookie = `${cookie_name}=${encodeURIComponent(JSON.stringify(cookie_value))}; ${expires}; path=/; secure; SameSite=Strict;`;
    document.cookie = `${cookie_name}=${cookie_value}; ${expires}; path=/; secure; SameSite=Strict;`;
  }
  
  
  export function getClientCookie(cookie_name: string):any{
    const cookies = document.cookie || "";
  
    const value = `; ${cookies}`;
    const parts = value.split(`; ${cookie_name}=`);
  
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift(); 
      if (cookieValue) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  }
  
  
  export function parse_json_string(cookie_name:string) {
    const cookie_value = getClientCookie(cookie_name);
  
    if (cookie_value) {
        try {
            return JSON.parse(decodeURIComponent(cookie_value)); 
        } catch (error) {
            console.error("Failed to parse userInfo from cookie:", error);
            return null;
        }
    }
    return null; 
  }
  
  export const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };