export function imageUrl(value: string): string {
  const url = new URL(value.trim());
  if (url.protocol !== 'https:' || url.username || url.password) {
    throw new Error('Escribe una URL de imagen que use HTTPS.');
  }
  return url.href;
}

export async function resizeBlogImage(file: File): Promise<string> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) {
    throw new Error('Elige una imagen JPG, PNG o WebP de hasta 10 MB.');
  }
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('No se pudo preparar la imagen.');
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL('image/jpeg', .76);
    if (image.length > 450000) throw new Error('La imagen es demasiado pesada. Elige una imagen más pequeña.');
    return image;
  } finally {
    bitmap.close();
  }
}
