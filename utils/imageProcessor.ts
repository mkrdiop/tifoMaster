
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

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const padding = canvas.width * 0.03;
      const logoHeight = canvas.height * 0.08;
      const logoWidth = logoHeight * 4;
      const x = canvas.width - logoWidth - padding;
      const y = canvas.height - logoHeight - padding;

      // Dessin manuel d'un rectangle arrondi pour compatibilité totale
      const r = 15; // rayon
      const rx = x - 10, ry = y - 5, rw = logoWidth + 20, rh = logoHeight + 10;
      
      ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
      ctx.beginPath();
      ctx.moveTo(rx + r, ry);
      ctx.lineTo(rx + rw - r, ry);
      ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + r);
      ctx.lineTo(rx + rw, ry + rh - r);
      ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - r, ry + rh);
      ctx.lineTo(rx + r, ry + rh);
      ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - r);
      ctx.lineTo(rx, ry + r);
      ctx.quadraticCurveTo(rx, ry, rx + r, ry);
      ctx.closePath();
      ctx.fill();

      // Icône
      const iconSize = logoHeight * 0.8;
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(x + iconSize / 2, y + logoHeight / 2, iconSize / 2, 0, Math.PI * 2);
      ctx.fill();

      // Texte
      const fontSize = logoHeight * 0.7;
      ctx.font = `italic bold ${fontSize}px sans-serif`;
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
    img.onerror = () => reject(new Error("Image loading failed"));
    img.src = base64Image;
  });
};
