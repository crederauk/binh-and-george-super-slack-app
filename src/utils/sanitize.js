export default function sanitize(str) {
  const trimmedText = str.slice(0, 256);
  return trimmedText.replace(/[^a-zA-Z0-9\s]/g, '');
}
