import type { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Package, Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { ConfirmDialog } from '@/components/confirm-dialog'
import { DataTable, SortableHeader } from '@/components/data-table'
import { PageHeader } from '@/components/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCollection } from '@/hooks/use-collection'
import { formatRelative } from '@/lib/dates'
import { getErrorMessage } from '@/lib/errors'
import { formatCurrency } from '@/lib/utils'
import { allProductsQuery, deleteProduct } from '@/services/products'
import type { Product } from '@/types'

import { ProductFormDialog } from './product-form-dialog'
import { useDocumentTitle } from '@/hooks/use-document-title'

type VisibilityFilter = 'all' | 'public' | 'private'

export function ProductsPage() {
  useDocumentTitle('Products')
  const [visibility, setVisibility] = useState<VisibilityFilter>('all')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState<Product | null>(null)
  const [deletePending, setDeletePending] = useState(false)

  const productsRef = useMemo(() => allProductsQuery(200), [])
  const { data, loading, error } = useCollection(productsRef)

  const filtered = useMemo(
    () => (visibility === 'all' ? data : data.filter((item) => item.visibility === visibility)),
    [data, visibility],
  )

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  async function confirmDelete() {
    if (!deleting) return
    setDeletePending(true)
    try {
      await deleteProduct(deleting.id)
      toast.success('Product deleted')
      setDeleting(null)
    } catch (caught) {
      toast.error(getErrorMessage(caught))
    } finally {
      setDeletePending(false)
    }
  }

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => <SortableHeader column={column}>Product</SortableHeader>,
      cell: ({ row }) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{row.original.name}</p>
          <p className="font-mono text-xs text-muted-foreground">{row.original.sku}</p>
        </div>
      ),
    },
    {
      accessorKey: 'price',
      header: ({ column }) => <SortableHeader column={column}>Price</SortableHeader>,
      cell: ({ row }) => <span className="font-medium">{formatCurrency(row.original.price)}</span>,
    },
    {
      accessorKey: 'visibility',
      header: ({ column }) => <SortableHeader column={column}>Visibility</SortableHeader>,
      cell: ({ row }) => (
        <Badge variant={row.original.visibility === 'public' ? 'success' : 'secondary'}>
          {row.original.visibility === 'public' ? 'Public' : 'Private'}
        </Badge>
      ),
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => <SortableHeader column={column}>Updated</SortableHeader>,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatRelative(row.original.updatedAt)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Actions for ${row.original.name}`}
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={() => {
                  setEditing(row.original)
                  setFormOpen(true)
                }}
              >
                <Pencil className="size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={() => setDeleting(row.original)}>
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workspace"
        title="Products"
        description="A second CRUD surface: same table, dialog and validation patterns as posts."
        actions={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            New product
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        error={error}
        searchColumn="name"
        searchPlaceholder="Search products…"
        getRowId={(row) => row.id}
        emptyTitle={visibility === 'all' ? 'No products yet' : `No ${visibility} products`}
        emptyDescription="Products demonstrate a second typed collection with numeric fields and visibility rules."
        emptyAction={
          <Button size="sm" onClick={openCreate}>
            <Package className="size-4" />
            New product
          </Button>
        }
        filters={
          <Select
            value={visibility}
            onValueChange={(value) => setVisibility(value as VisibilityFilter)}
          >
            <SelectTrigger size="sm" className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All visibility</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <ProductFormDialog open={formOpen} onOpenChange={setFormOpen} product={editing} />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null)
        }}
        title="Delete product?"
        description={
          <>
            <span className="font-medium text-foreground">{deleting?.name}</span> will be removed
            permanently. This cannot be undone.
          </>
        }
        confirmLabel="Delete product"
        destructive
        pending={deletePending}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  )
}
