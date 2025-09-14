import QRCode from 'qrcode';

export const generateQRCode = async (url: string): Promise<string> => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(url, {
      width: 320,
      margin: 4,
      color: {
        dark: '#0a2540', // Navy blue for QR code
        light: '#fff' // White background
      },
      errorCorrectionLevel: 'H', // Highest error correction
      scale: 8 // Sharper image
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return '';
  }
};