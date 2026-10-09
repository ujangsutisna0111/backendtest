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

APP_SECRET_KEY=
```

Isi `APP_SECRET_KEY` dengan key 16 byte 
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

`GET /jabatan/:jabatanId/menu` — protected. Ganti `:jabatanId` dengan ciphertext Base64 URL-safe dari JSON `{"jabatanId":"<id>"}` yang dienkripsi menggunakan AES-128-CBC dengan `APP_SECRET_KEY`. Kirim IV dalam format hex pada header `X-AES-IV`.

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
