# Simple E-Commerce



Project ini adalah sebuah RESTful API sederhana untuk aplikasi e-commerce yang dibangun menggunakan Node.js, Express, dan Prisma.



## Fitur Utama



* **Autentikasi Pengguna:** Registrasi dan login pengguna dengan JWT (JSON Web Token).

* **Manajemen Produk:** Operasi CRUD (Create, Read, Update, Delete) untuk produk.

* **Manajemen Kategori:** Operasi CRUD untuk kategori produk.

* **Keranjang Belanja:** Menambah, melihat, dan menghapus item dari keranjang belanja.

* **Manajemen Pesanan:** Membuat dan melihat riwayat pesanan.



## Teknologi yang Digunakan



* **Backend:** Node.js, Express.js

* **Database ORM:** Prisma

* **Database:** (Sesuai dengan konfigurasi Prisma Anda, contoh: PostgreSQL, MySQL, SQLite)

* **Autentikasi:** bcryptjs untuk hashing password, jsonwebtoken untuk otentikasi berbasis token.

* **Lainnya:** Cors untuk Cross-Origin Resource Sharing, Nodemon untuk development.



## Prasyarat Instalasi



Sebelum memulai, pastikan Anda telah menginstal:



* [Node.js](https://nodejs.org/en/) (versi 14 atau lebih tinggi)

* [npm](https://www.npmjs.com/) (biasanya terinstal bersama Node.js)

* Database (contoh: [PostgreSQL](https://www.postgresql.org/))



## Susunan Proyek

.

├── prisma/

│   ├── migrations/

│   └── schema.prisma

├── src/

│   ├── controllers/

│   │   ├── auth.controller.js

│   │   ├── product.controller.js

│   │   ├── category.controller.js

│   │   ├── cart.controller.js

│   │   └── order.controller.js

│   ├── middleware/

│   │   └── auth.middleware.js

│   ├── routes/

│   │   ├── auth.routes.js

│   │   ├── product.routes.js

│   │   ├── category.routes.js

│   │   ├── cart.routes.js

│   │   └── order.routes.js

│   └── index.js

├── .gitignore

├── package.json

└── README.md

## Contoh Penggunaan



1.  **Clone repository ini:**



    ```bash

    git clone [https://github.com/akfiss/simple-e-commerce-akfiss.git](https://github.com/akfiss/simple-e-commerce-akfiss.git)

    cd simple-e-commerce-akfiss

    ```



2.  **Install dependencies:**



    ```bash

    npm install

    ```



3.  **Konfigurasi database Anda di `prisma/schema.prisma` dan file `.env`.**



4.  **Jalankan migrasi database:**



    ```bash

    npx prisma migrate dev

    ```



5.  **Jalankan aplikasi:**



    * **Development:**

        ```bash

        npm run dev

        ```

    * **Production:**

        ```bash

        npm start

        ```



## Kontribusi



Kontribusi sangat diterima! Jika Anda ingin berkontribusi, silakan fork repositori ini dan buat pull request.



## Lisensi



Proyek ini dilisensikan di bawah [Lisensi MIT](LICENSE).
