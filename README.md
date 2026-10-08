# Open Job Backend API

Dokumentasi ini berfokus pada dua endpoint: login karyawan dan pengambilan
menu berdasarkan ID jabatan.

## Menjalankan aplikasi

Persyaratan: Node.js versi 20 atau lebih baru dan PostgreSQL.

```bash
npm install
```

Buat file `.env` di root project:

```dotenv
HOST=localhost
PORT=3000
NODE_ENV=development

PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=change-me
PGDATABASE=open_job

ACCESS_TOKEN_KEY=replace-with-a-long-random-secret
```

Gunakan secret acak yang kuat untuk `ACCESS_TOKEN_KEY` dan jangan commit nilai
secret ke repository. Jalankan migration dan server:

```bash
npm run migrate -- up
npm run start:dev
```

Server secara default berjalan di `http://localhost:3000`.

## Alur penggunaan

1. Login dengan username dan password untuk mendapatkan access token.
2. Kirim token tersebut sebagai Bearer token saat meminta menu berdasarkan
   jabatan.

Request dan response menggunakan JSON. Token berlaku selama 3 jam.

## Login

### `POST /auth/login` — publik

Request:

```json
{
  "username": "ayu.putri",
  "password": "secret123"
}
```

Response `200 OK`:

```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "accessToken": "<jwt>"
  }
}
```

Username atau password yang salah menghasilkan HTTP `401`. Gunakan
`data.accessToken` pada header `Authorization` untuk endpoint berikutnya.

## Mengambil menu berdasarkan jabatan

### `GET /menu/access/:jabatanId` — Bearer

Mengambil menu yang diberikan langsung ke jabatan beserta seluruh turunannya
dalam bentuk hierarki. Contoh URL:
`GET /menu/access/jabatan-id`.

Header:

```http
Authorization: Bearer <accessToken>
```

Contoh menggunakan `curl`:

```bash
curl http://localhost:3000/menu/access/jabatan-id \
  -H "Authorization: Bearer <accessToken>"
```

Response `200 OK`:

```json
{
  "status": "success",
  "message": "Akses menu berdasarkan jabatan berhasil diambil",
  "data": {
    "menus": [
      {
        "id": "menu-id",
        "name": "Pengaturan",
        "path": "/settings",
        "icon": "settings",
        "menus": [
          {
            "id": "submenu-id",
            "name": "Pengguna",
            "path": "/settings/users",
            "icon": "users",
            "menus": []
          }
        ]
      }
    ]
  }
}
```

Menu turunan ikut ditampilkan walaupun hanya menu induknya yang dihubungkan
langsung ke jabatan. Respons menu berisi `id`, `name`, `path`, `icon`, dan
`menus`; respons ini tidak mencakup flag izin CRUD. Token tidak valid atau
tidak ada menghasilkan HTTP `401`.
