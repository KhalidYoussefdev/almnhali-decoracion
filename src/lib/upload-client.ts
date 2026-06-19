export async function uploadImageFile(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  let data: { url?: string; error?: string } = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Session expired. Please log in to the admin again.');
    }
    throw new Error(data.error ?? 'Upload failed. Please try again.');
  }

  if (!data.url) {
    throw new Error('Upload failed. No image URL returned.');
  }

  return { url: data.url };
}