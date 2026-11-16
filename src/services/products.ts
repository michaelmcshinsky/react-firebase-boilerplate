import {
  addDoc,
  deleteDoc,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'

import { productDocument, productsCollection } from '@/lib/firebase/firestore'
import type { Product, ProductVisibility } from '@/types'

export interface ProductInput {
  name: string
  sku: string
  description: string
  price: number
  visibility: ProductVisibility
}

export function allProductsQuery(limitTo = 100) {
  return query(productsCollection(), orderBy('updatedAt', 'desc'), limit(limitTo))
}

export function publicProductsQuery(limitTo = 3) {
  return query(
    productsCollection(),
    where('visibility', '==', 'public'),
    orderBy('updatedAt', 'desc'),
    limit(limitTo),
  )
}

export async function createProduct(input: ProductInput) {
  await addDoc(productsCollection(), {
    ...input,
    name: input.name.trim(),
    sku: input.sku.trim().toUpperCase(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  } as unknown as Product)
}

export async function updateProduct(id: string, input: ProductInput) {
  await updateDoc(productDocument(id), {
    ...input,
    name: input.name.trim(),
    sku: input.sku.trim().toUpperCase(),
    updatedAt: serverTimestamp(),
  } as unknown as Partial<Product>)
}

export async function deleteProduct(id: string) {
  await deleteDoc(productDocument(id))
}
