# Open Job Backend API

Dokumentasi ini berfokus pada dua endpoint utama: login karyawan dan pengambilan menu berdasarkan ID jabatan.

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

ACCESS_TOKEN_KEY=replace-with-a-long-random-secret
```

Gunakan secret acak yang kuat untuk `ACCESS_TOKEN_KEY` dan jangan commit nilai secret ke repository. Setelah itu, jalankan migration dan server:

```bash
npm run migrate -- up
npm run start:dev
```

Server secara default berjalan di `http://localhost:3000`.

## Alur penggunaan

1. Login dengan username dan password untuk mendapatkan access token.
2. Kirim token tersebut pada header `Authorization` saat meminta menu berdasarkan jabatan.
3. Request dan response menggunakan format JSON.

## Login

### `POST /auth/login` — publik

Request body:

```json
{
  "username": "ayu.putri",
  "password": "secret123"
}
```

Contoh request menggunakan `curl`:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "ayu.putri",
    "password": "secret123"
  }'
```

Response `200 OK`:

```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJheXUucHV0cmkiLCJyb2xlcyI6W3siamFiYXRhbl9pZCI6MX1dfQ.7QnPzZQ4e7J7hB4q5T9Y2wWc8O9u1Zk5F2vY0tV0gk0"
  }
}
```

Username atau password yang salah akan menghasilkan HTTP `401`.

Gunakan `data.accessToken` sebagai header berikut untuk endpoint menu:

```http
Authorization: Bearer <accessToken>
```

## Mengambil menu berdasarkan jabatan

### `GET /menu/access/:jabatanId` — protected

Endpoint ini mengembalikan menu yang diberikan langsung ke jabatan beserta seluruh turunannya dalam bentuk hierarki.

Contoh URL:

```text
GET /menu/access/1
```

Header:

```http
Authorization: Bearer <accessToken>
```

Contoh request menggunakan `curl`:

```bash
curl http://localhost:3000/menu/access/1 \
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
        "id": "menu-1",
        "name": "Pengaturan",
        "path": "/settings",
        "icon": "settings",
        "menus": [
          {
            "id": "menu-2",
            "name": "Pengguna",
            "path": "/settings/users",
            "icon": "users",
            "menus": []
          },
          {
            "id": "menu-3",
            "name": "Role",
            "path": "/settings/roles",
            "icon": "shield",
            "menus": []
          }
        ]
      },
      {
        "id": "menu-4",
        "name": "Dashboard",
        "path": "/dashboard",
        "icon": "dashboard",
        "menus": []
      }
    ]
  }
}
```

Menu turunan ikut ditampilkan walaupun hanya menu induknya yang terhubung langsung ke jabatan. Respons menu berisi `id`, `name`, `path`, `icon`, dan `menus`; respons ini tidak mencakup flag izin CRUD. Token yang tidak valid atau tidak ada akan menghasilkan HTTP `401`.

## Contoh error response

### `401 Unauthorized`

```json
{
  "status": "error",
  "message": "Unauthorized"
}
```

### `403 Forbidden`

```json
{
  "status": "error",
  "message": "Forbidden"
}
```
