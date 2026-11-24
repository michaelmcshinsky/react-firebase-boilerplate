# Firestore cost & scaling notes for buyers

Firestore bills per **document read**, **document write**, and **delete**, plus
per GB stored and per GB of egress — not per query or per returned row
beyond the reads themselves. For a boilerplate, the demo queries are cheap;
the cost risk comes from how you grow them. This guide covers the patterns
that keep bills predictable.

## How reads are billed

| Operation                            | Billed as                        |
| ------------------------------------ | -------------------------------- |
| `get()` on a doc                     | 1 read                           |
| Query returning N docs               | N reads (even with `limit(10)`)  |
| `onSnapshot` listener, initial load  | N reads                          |
| `onSnapshot` listener, per change    | reads for changed docs only      |
| `count()` aggregation                | 1 read per **up to 1,000** index entries scanned (see below) |
| Offline cache hits                   | Free (cache-served reads)        |

Two consequences that surprise people:

1. **A `limit(50)` query still costs 50 reads** — the limit caps the bill,
   it doesn't reduce the per-doc price. Pagination is your cost control.
2. **Live listeners are not free.** Each connected `onSnapshot` re-reads
   changed docs for every listener. A dashboard with 10 live queries costs
   10× the reads of a single fetch per update — fine at small scale,
   worth auditing before you ship a busy dashboard to many users.

## Prefer `count()` over fetching for numbers

To display "1,240 posts" or "3 pending approvals", use the aggregation:

```ts
import { collection, getCountFromServer, query, where } from 'firebase/firestore'

const snap = await getCountFromServer(
  query(collection(db, 'posts'), where('status', '==', 'published')),
)
snap.data().count // number
```

`getCountFromServer` is billed per 1,000 index entries scanned (minimum 1
read), so counting 10k docs costs ~10 reads instead of 10,000. It also
needs no client-side data model change.

## Pagination beats "load everything"

The demo services already accept a `limit` and use `orderBy` + `limit`
(`src/services/posts.ts`). For real apps:

- **Cursor pagination** (`startAfter(lastDoc)`) over offset pagination —
  offsets re-scan and re-bill skipped docs on every page.
- **Push filters into the query** (`where`, `orderBy`, composite indexes in
  `firestore.indexes.json`) rather than fetching a broad set and filtering
  client-side. Client-side filtering bills you for docs you discard.
- **Don't fetch a collection to compute a sum/average** — maintain a
  counter doc or aggregate on write (Cloud Function trigger), or use the
  Firebase Extensions / BigQuery export path for analytics.

## Writes are the other half of the bill

- Each `set`/`update`/`delete` is one write, regardless of doc size
  (up to 1 MiB).
- **Batch writes** (`writeBatch`) still bill per document — they save
  round-trips, not money. Use them for correctness/atomicity, not cost.
- `serverTimestamp()` and converter `undefined`-dropping in
  `lib/firebase/converters.ts` avoid accidental full-doc rewrites.

## Practical rules of thumb

- Free tier (Spark): ~50k reads/day — fine for demos and early MVPs.
- Paid tier (Blaze, required for Functions anyway): reads ~$0.036/100k in
  most regions; writes ~$0.108/100k. Check current pricing at
  https://firebase.google.com/pricing before budgeting — prices vary by
  region and change.
- Before a public launch: audit live listeners (`useCollection`,
  `useDocument`), cap `limit()` values, and put `count()` behind "load
  more" buttons instead of prefetching full tables.
- Set a **budget alert** in Google Cloud Console → Billing → Budgets —
  it's the cheapest insurance against a runaway listener or a missing
  `where` clause.
