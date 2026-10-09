# Open Job Backend API

Dokumentasi endpoint login dan akses menu berdasarkan jabatan.

## Menjalankan aplikasi

Persyaratan: Node.js versi 20 atau lebih baru dan PostgreSQL.

```bash
npm install
```

Buat file `.env` di root project:

```dotenv
HOST=
PORT=
NODE_ENV=

PGHOST=
PGPORT=
PGUSER=
PGPASSWORD=
PGDATABASE=

ACCESS_TOKEN_KEY=
```

Isi `ACCESS_TOKEN_KEY` dengan key 16 byte untuk AES-128 dan jangan commit nilainya. Jalankan migration dan server:

```bash
npm run migrate -- up
npm run start:dev
```

Server secara default berjalan di `http://localhost:3000`.

## Login

`POST /auth/login` — publik.

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"ayu.putri","password":"secret123"}'
```

Response `200`:

```json
{
  "status": "success",
  "data": { "accessToken": "<token>" }
}
```

## Akses menu berdasarkan jabatan

`GET /menu/jabatan/:jabatanId/menu` — protected. Ganti `:jabatanId` dengan ciphertext Base64 URL-safe dari JSON `{"jabatanId":"<id>"}` yang dienkripsi menggunakan AES-128-CBC dengan `ACCESS_TOKEN_KEY`. Kirim IV dalam format hex pada header `X-AES-IV`.

```bash
curl "http://localhost:3000/jabatan/${JABATAN_ID_CIPHERTEXT}/menu" \
  --oauth2-bearer "${ACCESS_TOKEN}" \
  -H "X-AES-IV: ${AES_IV}"
```

Response `200`:

```json
{
  "status": "success",
  "data": {
    "menus": [
      {
        "id": "<menu-id>",
        "name": "<menu-name>",
        "path": "<menu-path>",
        "icon": "<menu-icon>",
        "menus": []
      }
    ]
  }
}
```

Set `ACCESS_TOKEN` dengan `data.accessToken` dari response login. `menus` berisi menu turunan jika ada.

## Jabatan karyawan

`GET /api/karyawan/jabatan` — protected. Mengambil seluruh karyawan beserta
array `jabatan` (kosong jika karyawan belum memiliki jabatan).

`POST /api/karyawan/jabatan` menerima daftar pasangan karyawan dan jabatan.
Relasi yang sudah ada diperbarui, sedangkan relasi baru ditambahkan; jabatan
lain yang tidak dikirim tidak dihapus.

```bash
curl -X POST http://localhost:3000/api/karyawan/jabatan \
  -H "Content-Type: application/json" \
  -d '{
    "assignments": [
      { "karyawanId": "<karyawan-id>", "jabatanId": "<jabatan-id>" },
      { "karyawanId": "<karyawan-id>", "jabatanId": "<jabatan-lain-id>" }
    ]
  }'
```

Bulk update diproses dalam satu transaksi database. Jika salah satu karyawan
atau jabatan tidak ditemukan, seluruh perubahan dibatalkan.
