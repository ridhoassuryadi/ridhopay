# Ridho Pay

Aplikasi tracking hutang dengan Astro.js yang di-deploy ke Cloudflare Workers dengan KV Storage.

## Fitur

- **Admin Dashboard**: Overview total hutang, list debitur, statistik
- **Manajemen Debitur**: Tambah, edit, hapus data orang yang punya hutang
- **Riwayat Transaksi**: Catat hutang baru & pembayaran dengan detail lengkap
- **Notes**: Catatan tambahan untuk admin
- **Guest Access**: Akses tamu dengan fitur terbatas

## Default Credentials

| Role  | Username | Password  |
|-------|----------|-----------|
| Admin | admin    | admin123  |
| Guest | guest    | guest123  |

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create KV Namespace:
```bash
wrangler kv:namespace create KV
```

3. Update `wrangler.toml` dengan KV namespace ID Anda:
```toml
[[kv_namespaces]]
binding = "KV"
id = "your-kv-namespace-id"
```

4. Jalankan dev server:
```bash
npm run dev
```

5. Inisialisasi user default dengan mengakses:
```
http://localhost:4321/api/init
```

## Deployment

```bash
npm run deploy
```

## Struktur Data

### Debtor
- `id`: Unique identifier
- `name`: Nama lengkap
- `phone`: Nomor HP (opsional)
- `address`: Alamat (opsional)
- `notes`: Catatan tambahan (opsional)
- `createdAt`: Timestamp dibuat
- `updatedAt`: Timestamp diupdate

### Transaction
- `id`: Unique identifier
- `debtorId`: ID debitur terkait
- `type`: `debt` (hutang) atau `payment` (pembayaran)
- `amount`: Jumlah dalam Rupiah
- `description`: Keterangan transaksi
- `createdAt`: Timestamp dibuat

## Tech Stack

- Astro.js 6.x
- Tailwind CSS v4
- Cloudflare Workers
- Cloudflare KV Storage
- SSR dengan Cloudflare Pages Adapter
