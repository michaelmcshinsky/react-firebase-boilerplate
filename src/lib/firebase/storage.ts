import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'

import { requireFirebase } from './client'

const MAX_AVATAR_BYTES = 2 * 1024 * 1024
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']

export function validateAvatar(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Choose a PNG, JPG, WebP or GIF image.'
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return 'Images must be smaller than 2 MB.'
  }
  return null
}

export async function uploadAvatar(
  uid: string,
  file: File,
): Promise<{ url: string; path: string }> {
  const problem = validateAvatar(file)
  if (problem) throw new Error(problem)

  const { storage } = requireFirebase()
  const extension = file.name.split('.').pop()?.toLowerCase() ?? 'png'
  const path = `avatars/${uid}/${Date.now()}.${extension}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file, { contentType: file.type })
  const url = await getDownloadURL(storageRef)
  return { url, path }
}

export async function deleteAvatar(path: string): Promise<void> {
  const { storage } = requireFirebase()
  await deleteObject(ref(storage, path))
}
