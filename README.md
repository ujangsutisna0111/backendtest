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

Isi `APP_SECRET_KEY` dengan key 16 byte.

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

**JWT Payload Data (Decoded):**

Di dalam `accessToken` yang dihasilkan, terdapat informasi identitas user (_payload_) berupa objek terenkripsi yang dapat didecode dengan struktur sebagai berikut:

```json
{
  "id": 12,
  "username": "ayu.putri",
  "roles": [
    {
      "jabatan_id": "4fb285ab-b730-4be8-b12b-89eb46a87a83",
      "jabatan": "Admin"
    },
    {
      "jabatan_id": "f147f8d9-30bc-4a27-a959-a82518991c50",
      "jabatan": "Manager"
    }
  ],
  "iat": 1712660000,
  "exp": 1712746400
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
  "message": "Akses menu berdasarkan jabatan berhasil diambil",
  "data": {
    "menus": [
      {
        "id": "befc022e-4c46-4250-b2dd-70f13cea9fd3",
        "name": "Master Data",
        "path": "/master-data",
        "icon": "database",
        "menus": [
          {
            "id": "e704beba-56ec-4ff9-ba46-e0b4aadbb55f",
            "name": "Pasien",
            "path": "/master-data/pasien",
            "icon": "users",
            "menus": [
              {
                "id": "28254a88-e731-4070-a6e7-bd66995f6f4b",
                "name": "Data Pasien",
                "path": "/master-data/pasien/data",
                "icon": "user",
                "menus": []
              },
              {
                "id": "723cc033-7ac5-4ace-9f9c-b90ee8d59289",
                "name": "Data penjamin",
                "path": "/master-data/pasien/penjamin",
                "icon": "user",
                "menus": []
              }
            ]
          }
        ]
      }
    ]
  }
}
```

Set `ACCESS_TOKEN` dengan `data.accessToken` dari response login. `menus` berisi menu turunan jika ada.
