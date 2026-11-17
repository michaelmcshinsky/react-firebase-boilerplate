import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  serverTimestamp: vi.fn(() => 'SERVER_TS'),
  query: vi.fn((...args: unknown[]) => args),
  where: vi.fn((...args: unknown[]) => args),
  orderBy: vi.fn((...args: unknown[]) => args),
  limit: vi.fn((...args: unknown[]) => args),
}))

vi.mock('firebase/firestore', () => ({
  addDoc: mocks.addDoc,
  updateDoc: mocks.updateDoc,
  deleteDoc: mocks.deleteDoc,
  serverTimestamp: mocks.serverTimestamp,
  query: mocks.query,
  where: mocks.where,
  orderBy: mocks.orderBy,
  limit: mocks.limit,
}))

vi.mock('@/lib/firebase/firestore', () => ({
  productsCollection: () => 'products-collection',
  productDocument: (id: string) => `products/${id}`,
}))

const { createProduct, deleteProduct, updateProduct } = await import('./products')

const input = {
  name: '  Studio licence  ',
  sku: 'studio-01',
  description: 'A licence',
  price: 240,
  visibility: 'public' as const,
}

describe('products service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.addDoc.mockResolvedValue({ id: 'new-product' })
    mocks.updateDoc.mockResolvedValue(undefined)
    mocks.deleteDoc.mockResolvedValue(undefined)
  })

  it('trims the name and upper-cases the SKU on create', async () => {
    await createProduct(input)

    expect(mocks.addDoc).toHaveBeenCalledWith(
      'products-collection',
      expect.objectContaining({
        name: 'Studio licence',
        sku: 'STUDIO-01',
        price: 240,
        visibility: 'public',
        createdAt: 'SERVER_TS',
        updatedAt: 'SERVER_TS',
      }),
    )
  })

  it('applies the same normalisation on update', async () => {
    await updateProduct('product-1', { ...input, sku: 'team-05' })

    expect(mocks.updateDoc).toHaveBeenCalledWith(
      'products/product-1',
      expect.objectContaining({ sku: 'TEAM-05', updatedAt: 'SERVER_TS' }),
    )
  })

  it('deletes by document reference', async () => {
    await deleteProduct('product-7')

    expect(mocks.deleteDoc).toHaveBeenCalledWith('products/product-7')
  })
})
