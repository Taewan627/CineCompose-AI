export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const downloadProcessedImage = (base64Url: string, filename: string, targetWidth: number = 960) => {
  const img = new Image();
  img.src = base64Url;
  img.onload = () => {
    const canvas = document.createElement('canvas');
    
    // Calculate height based on aspect ratio
    const scale = targetWidth / img.width;
    const targetHeight = img.height * scale;

    canvas.width = targetWidth;
    canvas.height = targetHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use high quality image smoothing for resizing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    
    // Export as JPEG with 90% quality (0.9)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
};