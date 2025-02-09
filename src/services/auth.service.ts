export const getGoogleAuthUrl = () => {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.append("client_id", import.meta.env.VITE_GOOGLE_CLIENT_ID);
  url.searchParams.append("response_type", "token");
  url.searchParams.append(
    "redirect_uri",
    `http://localhost:5173`,
  );
  url.searchParams.append(
    "scope",
    "https://www.googleapis.com/auth/youtube.readonly",
  );

  return url.toString();
};

export const getAccessTokenFromHash = () => {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  return params.get("access_token");
};
