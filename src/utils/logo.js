export const getLogoWideUrl = () => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const timestamp = localStorage.getItem('logo_timestamp') || '1';
  return `${baseUrl}/public/logo-wide.png?v=${timestamp}`;
};

export const getLogoRoundUrl = () => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const timestamp = localStorage.getItem('logo_timestamp') || '1';
  return `${baseUrl}/public/logo-round.png?v=${timestamp}`;
};

/**
 * Fetch image as Base64 for jsPDF
 */
export const fetchImageAsBase64 = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch image');
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error fetching image as base64:', error);
    return null; // Handle fallback gracefully in consumer
  }
};
