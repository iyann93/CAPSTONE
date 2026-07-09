export const showToast = (message, type = 'info') => {
  let finalType = type;
  const msgLower = (message || '').toLowerCase();
  
  if (msgLower.includes('berhasil') || msgLower.includes('sukses') || msgLower.includes('disimpan')) {
    finalType = 'success';
  }
  
  if (msgLower.includes('gagal') || msgLower.includes('error') || msgLower.includes('salah') || msgLower.includes('tolak') || msgLower.includes('maaf')) {
    finalType = 'error';
  }

  const event = new CustomEvent('app-toast', {
    detail: { message, type: finalType }
  });
  window.dispatchEvent(event);
};

// Make it globally available so we don't have to import it everywhere
window.showToast = showToast;

// Override native alert as a fallback for any missed alerts
const originalAlert = window.alert;
window.alert = (msg) => {
  showToast(msg, 'info'); // Using info or auto-detected type
};
