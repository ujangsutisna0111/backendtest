# Open Job Backend API

Backend REST API untuk autentikasi karyawan, pengelolaan jabatan, relasi
karyawan-jabatan, dan konfigurasi menu serta akses menu per jabatan.

## Persiapan dan menjalankan aplikasi

Persyaratan: Node.js versi 20 atau lebih baru dan PostgreSQL.

```bash
npm install
```

Buat file `.env` di root project, isi variabel yang dijelaskan di bagian
[Konfigurasi environment](#konfigurasi-environment), lalu jalankan migrasi dan
server:

```bash
npm run migrate -- up
npm run start:dev
```

Server secara default berjalan di `http://localhost:3000`. Tidak ada prefix
API global; path endpoint dimulai langsung dari `/auth`, `/jabatan`,
`/jabatankaryawan`, atau `/menu`.

## Konfigurasi environment

| Variabel | Wajib | Default | Keterangan |
| --- | --- | --- | --- |
| `HOST` | Tidak | `localhost` | Host interface yang digunakan server. |
| `PORT` | Tidak | `3000` | Port HTTP server. |
| `NODE_ENV` | Tidak | - | Jika bernilai `test`, server tidak menjalankan `listen`. |
| `PGHOST` | Ya | - | Host PostgreSQL. |
| `PGPORT` | Tidak | `5432` | Port PostgreSQL. |
| `PGUSER` | Ya | - | User PostgreSQL. |
| `PGPASSWORD` | Ya | - | Password PostgreSQL. |
| `PGDATABASE` | Ya | - | Nama database PostgreSQL. |
| `ACCESS_TOKEN_KEY` | Ya | - | Secret untuk menandatangani dan memverifikasi JWT. Gunakan nilai acak yang kuat dan jangan commit secret ke repository. |

Contoh `.env` (ganti placeholder dengan nilai lokal):

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

## Konvensi API

- Request dan response menggunakan JSON. Untuk request yang memiliki body,
  kirim header `Content-Type: application/json`.
- Endpoint yang ditandai **Bearer** memerlukan header:

  ```http
  Authorization: Bearer <accessToken>
  ```

- Token dari login berlaku selama 3 jam.
- Bentuk response sukses:

  ```json
  {
    "status": "success",
    "message": "Pesan sesuai operasi",
    "data": {}
  }
  ```

- Bentuk response gagal:

  ```json
  {
    "status": "failed",
    "message": "Deskripsi error",
    "data": null
  }
  ```

  Validasi body/parameter yang gagal umumnya menghasilkan HTTP `400`, token
  yang tidak valid atau tidak ada menghasilkan HTTP `401`, data yang tidak
  ditemukan menghasilkan HTTP `404`, dan error tak terduga menghasilkan
  HTTP `500`.

## Fitur dan endpoint

### Autentikasi karyawan

Registrasi menyimpan karyawan baru dan login mengeluarkan JWT. Password
disimpan dalam bentuk hash dan tidak dikembalikan oleh API. Saat login, role
karyawan yang sudah terhubung ke jabatan dimasukkan ke payload token.

#### `POST /auth/register` — publik

Request:

```json
{
  "name": "Ayu Putri",
  "username": "ayu.putri",
  "password": "secret123"
}
```

`name` wajib (1-150 karakter), `username` wajib (3-30 karakter), dan
`password` wajib (minimal 6 karakter).

Response `201 Created`:

```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "generated-id",
      "name": "Ayu Putri",
      "username": "ayu.putri"
    }
  }
}
```

Username yang sudah digunakan ditolak.

#### `POST /auth/login` — publik

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

Gunakan `data.accessToken` sebagai Bearer token untuk endpoint yang
memerlukannya. Username/password salah menghasilkan `401`.

### Pengelolaan jabatan

Endpoint untuk membuat, membaca, memperbarui, dan menghapus data jabatan.
Semua endpoint di bagian ini memerlukan **Bearer**.

#### `GET /jabatan`

Tidak memiliki request body.

Response `200 OK`:

```json
{
  "status": "success",
  "message": "Daftar jabatan berhasil diambil",
  "data": {
    "jabatan": [
      {
        "id": "jabatan-id",
        "name": "Admin",
        "description": "Administrator aplikasi",
        "created_at": "2026-01-01T00:00:00.000Z",
        "updated_at": "2026-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

#### `POST /jabatan`

Request:

```json
{
  "name": "Admin",
  "description": "Administrator aplikasi"
}
```

`name` wajib (1-100 karakter); `description` opsional dan boleh `null`.

Response `201 Created`: `data.jabatan` berisi satu objek jabatan dengan field
`id`, `name`, `description`, `created_at`, dan `updated_at`.

#### `GET /jabatan/:jabatanId`

Contoh: `GET /jabatan/jabatan-id`.

Response `200 OK`: objek `data.jabatan` dengan field yang sama seperti hasil
`POST /jabatan`. ID yang tidak ditemukan menghasilkan `404`.

#### `PATCH /jabatan/:jabatanId`

Kirim setidaknya satu field yang ingin diubah. Contoh:

```json
{
  "description": "Mengelola konfigurasi aplikasi"
}
```

`name` (1-100 karakter) dan `description` (string atau `null`) dapat diubah.
Response `200 OK`: objek terbaru di `data.jabatan`. ID yang tidak ditemukan
menghasilkan `404`.

#### `DELETE /jabatan/:jabatanId`

Tidak memiliki request body.

Response `200 OK`:

```json
{
  "status": "success",
  "message": "Jabatan berhasil dihapus",
  "data": {
    "jabatan": {
      "id": "jabatan-id",
      "name": "Admin",
      "description": "Administrator aplikasi"
    }
  }
}
```

ID yang tidak ditemukan menghasilkan `404`. Relasi karyawan dan akses menu
yang merujuk ke jabatan tersebut ikut terhapus oleh cascade database.

### Relasi karyawan dan jabatan

Menghubungkan karyawan dengan satu atau lebih jabatan. Database mencegah
pasangan karyawan-jabatan yang sama didaftarkan lebih dari sekali.

#### `GET /jabatankaryawan` — Bearer

Mengambil jabatan milik karyawan yang sedang login. Tidak menerima parameter
atau body.

Response `200 OK`:

```json
{
  "status": "success",
  "message": "Jabatan karyawan berhasil diambil",
  "data": {
    "jabatanKaryawan": [
      {
        "id": "relasi-id",
        "karyawan_id": "karyawan-id",
        "jabatan_id": "jabatan-id",
        "jabatan": "Admin",
        "description": "Administrator aplikasi",
        "created_at": "2026-01-01T00:00:00.000Z",
        "updated_at": "2026-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

#### `POST /jabatankaryawan`

Request:

```json
{
  "karyawanId": "karyawan-id",
  "jabatanId": "jabatan-id"
}
```

Kedua ID wajib berupa string. Response `201 Created`:

```json
{
  "status": "success",
  "message": "Jabatan karyawan berhasil dibuat",
  "data": {
    "jabatanKaryawan": {
      "id": "relasi-id",
      "karyawan_id": "karyawan-id",
      "jabatan_id": "jabatan-id",
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z"
    }
  }
}
```

ID karyawan/jabatan yang tidak ditemukan atau relasi duplikat akan ditolak.
Saat ini route pembuatan relasi ini **tidak memasang middleware autentikasi**.

### Menu dan akses menu

Menu dapat memiliki parent sehingga frontend bisa menampilkan navigasi
bertingkat. Akses menu diberikan per jabatan dengan flag CRUD. Endpoint menu
memerlukan **Bearer**.

#### `GET /menu`

Mengambil daftar semua menu, diurutkan menurut `sort_order` lalu `name`.
Tidak memiliki request body.

Response `200 OK` (item menggunakan nama field database):

```json
{
  "status": "success",
  "message": "Daftar menu berhasil diambil",
  "data": {
    "menus": [
      {
        "id": "menu-id",
        "name": "Dashboard",
        "parent_id": null,
        "path": "/dashboard",
        "icon": "home",
        "sort_order": 0,
        "created_at": "2026-01-01T00:00:00.000Z",
        "updated_at": "2026-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

#### `POST /menu`

Request:

```json
{
  "name": "Laporan",
  "parentId": null,
  "path": "/reports",
  "icon": "chart",
  "sortOrder": 1
}
```

`name` wajib (1-100 karakter); `parentId`, `path`, dan `icon` opsional atau
boleh `null`; `sortOrder` opsional, integer minimal `0`. Response yang
diharapkan `201 Created`, dengan objek `data.menu` menggunakan field
`parent_id` dan `sort_order`:

```json
{
  "status": "success",
  "message": "Menu berhasil dibuat",
  "data": {
    "menu": {
      "id": "menu-id",
      "name": "Laporan",
      "parent_id": null,
      "path": "/reports",
      "icon": "chart",
      "sort_order": 1,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z"
    }
  }
}
```

`parentId` yang tidak ada menghasilkan error. **Catatan implementasi:** saat
ini repository pemanggil ID menu menggunakan `crypto.randoamUUID()` (typo),
sehingga endpoint pembuatan menu akan menghasilkan `500` sampai diperbaiki.

#### `GET /menu/access/:jabatanId`

Mengambil menu yang terhubung ke jabatan beserta turunannya dalam bentuk
hierarki. Contoh: `GET /menu/access/jabatan-id`.

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

Objek menu pada response ini memiliki field `id`, `name`, `path`, `icon`, dan
`menus`. Daftar ini **tidak mengembalikan flag** `canCreate`, `canRead`,
`canUpdate`, atau `canDelete`; frontend yang memerlukan kontrol tombol
berdasarkan permission belum dapat mengambil flag tersebut dari endpoint ini.

#### `POST /menu/access`

Mendaftarkan flag akses CRUD untuk pasangan jabatan dan menu.

Request:

```json
{
  "jabatanId": "jabatan-id",
  "menuId": "menu-id",
  "canCreate": false,
  "canRead": true,
  "canUpdate": false,
  "canDelete": false
}
```

`jabatanId` dan `menuId` wajib; semua flag opsional dan default-nya `false`.
Response `201 Created`:

```json
{
  "status": "success",
  "message": "Akses menu berhasil dibuat",
  "data": {
    "menuAccess": {
      "id": "akses-id",
      "jabatan_id": "jabatan-id",
      "menu_id": "menu-id",
      "can_create": false,
      "can_read": true,
      "can_update": false,
      "can_delete": false,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z"
    }
  }
}
```

Pasangan jabatan-menu yang sudah ada tidak dapat didaftarkan ulang; jabatan
atau menu yang tidak ditemukan juga ditolak.
