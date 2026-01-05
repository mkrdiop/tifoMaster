
export const addWatermark = async (base64Image: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Set canvas size to image size
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Watermark dimensions and positioning
      const padding = canvas.width * 0.03;
      const logoHeight = canvas.height * 0.08;
      const logoWidth = logoHeight * 4; // Aspect ratio of the logo roughly 4:1
      const x = canvas.width - logoWidth - padding;
      const y = canvas.height - logoHeight - padding;

      // Draw background pill for the logo (semi-transparent)
      ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
      ctx.beginPath();
      ctx.roundRect(x - 10, y - 5, logoWidth + 20, logoHeight + 10, 15);
      ctx.fill();

      // Draw Logo Icon (Circle + Flag)
      const iconSize = logoHeight * 0.8;
      ctx.fillStyle = '#10b981'; // Emerald 500
      ctx.beginPath();
      ctx.arc(x + iconSize / 2, y + logoHeight / 2, iconSize / 2, 0, Math.PI * 2);
      ctx.fill();

      // Draw Flag Path inside circle
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = iconSize * 0.08;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const fX = x + iconSize / 2 - iconSize * 0.25;
      const fY = y + logoHeight / 2 - iconSize * 0.25;
      const fS = iconSize * 0.5;

      // Simple flag icon path
      ctx.beginPath();
      ctx.moveTo(fX, fY + fS);
      ctx.lineTo(fX, fY);
      ctx.lineTo(fX + fS * 0.6, fY);
      ctx.lineTo(fX + fS * 0.7, fY + fS * 0.2);
      ctx.lineTo(fX + fS, fY + fS * 0.2);
      ctx.lineTo(fX + fS * 0.8, fY + fS * 0.6);
      ctx.lineTo(fX + fS, fY + fS);
      ctx.lineTo(fX + fS * 0.5, fY + fS * 0.8);
      ctx.lineTo(fX, fY + fS * 0.8);
      ctx.stroke();

      // Draw Text "TIFOMASTER"
      const fontSize = logoHeight * 0.7;
      ctx.font = `italic bold ${fontSize}px "Oswald", sans-serif`;
      ctx.textBaseline = 'middle';
      
      const textX = x + iconSize + 15;
      const textY = y + logoHeight / 2;
      
      ctx.fillStyle = '#ffffff';
      ctx.fillText('TIFO', textX, textY);
      
      const tifoWidth = ctx.measureText('TIFO').width;
      ctx.fillStyle = '#10b981';
      ctx.fillText('MASTER', textX + tifoWidth, textY);

      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = base64Image;
  });
};
