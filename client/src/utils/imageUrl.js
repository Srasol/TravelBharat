const SERVER_URL = "http://localhost:5000";

export const getImageUrl = (image) => {
  if (!image) {
    return "";
  }

  const value = String(image).trim();

  // Cloudinary / full online image URL
  if (
    value.startsWith("https://") ||
    value.startsWith("http://")
  ) {
    return value;
  }

  // Old local image
  const cleanPath = value.startsWith("/")
    ? value
    : `/${value}`;

  return `${SERVER_URL}${cleanPath}`;
};