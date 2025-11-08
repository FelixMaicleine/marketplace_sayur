Challenge DevOps (Marketplace)
Sayurans.id
Aplikasi web e-commerce (marketplace) yang berfokus pada jual beli sayur-mayur segar yang dapat dikelola oleh admin secara realtime untuk digunakan oleh user dalam membeli sayuran. Proyek ini dibangun dengan arsitektur modern berbasis container menggunakan Docker/Docker Compose yang memisahkan frontend, backendse dan database, sehingga dapat berjalan di lokal dan untuk server menerapkan alur CI/CD penuh dengan memanfaatkan Github Actions dan Docker Hub untuk deployment otomatis ke server (VM GCP).

Anggota:
1. Felix Maicleine (221111389)
2. Paulus Silvester Simalango (221113232)
3. Marvin Octavius (221112156)
4. Miguell (221111242)
5. Franco Poltack Sinaga (221112673)
6. Verianto Wijaya (221111507)

Arsitektur & Teknologi 
Arsitektur aplikasi ini dibagi menjadi tiga layanan utama yaitu frontend, backend dan database yang berbasis container menggunakan Docker, ditambah alur DevOps CI/CD untuk otomasi integrasi dan deployment ke server publik (VM GCP).

Diagram Arsitektur Sederhana: [Browser Pengguna] -> [Frontend (React.js)] <--> [Backend (Node.js/Express)] <--> [Database (MySQL)]

Alur DevOps (CI/CD): [Developer (Push ke branch Main)] -> [GitHub Actions (Build & Deploy)] -> [Push Image ke Docker Hub] -> [GCP VM (SSH)] -> [Docker Compose Pull & Up Container]

Stack Teknologi yang Digunakan:
1. Frontend:
    - Bahasa: JavaScript
    - Framework: React.js
    - Dependencies: axios (utk api), toastify (notifikasi pop up), heroicons, framermotion dan aos (animasi)
    
2. Backend:
    - Bahasa: JavaScript
    - Framework: Node.js (Express.js)
    - Library: JWT (JSON Web Token) untuk autentikasi.
    - Dependencies: jwt, bcrypt (hash pass user baru ke db), cors, multer (menangani upload file misal gambar sayur)

3. Database:
    - Sistem: MySQL 8

4. DevOps:
    - Containerization: Docker, Docker Compose
    - CI/CD: GitHub Actions
    - Registry: Docker Hub
    - Hosting: Google Cloud Platform (GCP) Virtual Machine

Petunjuk Instalasi Lokal
1. Clone repository github
        git clone https://github.com/FelixMaicleine/marketplace_sayur
        cd marketplace_sayur

2. Siapkan file environment
        cp .env.example .env

3. Jalankan web di lokal
        docker-compose up --build

4. Buka frontend web di http://localhost:3000 dan backend di http://localhost:5000

Petunjuk Penggunaan Web (fitur-fitur utama)
1. Admin:
    - Login menggunakan akun admin default (username: admin, password: admin123)
    - Setelah berhasil login akan navigasi ke Home
    - Masuk ke Menu di Navbar
    - Admin dapat melakukan penambahan sayur baru di menu yang sudah terhubung ke database
    - Admin juga dapat melakukan edit pada informasi menu yang sudah ada seperti nama, harga dan stok yg akan terupdate dalam   database
    - Lalu pergi ke Orders di Navbar 
    - Admin dapat melihat pesanan-pesanan user yang sedang diproses dan yang sudah selesai
    - Admin juga dapat menandai pesanan yang sedang diproses sebagai selesai dan status pesanan pada database akan terupdate
    - Admin logout

2. User:
    - Register akun user pada page Register di Navbar Home (akan tersimpan data user baru)
    - Login menggunakan akun yang baru dibuat (login akan melakukan pencocokan dengan data dalam database)
    - Di Home pergi ke Menu pada Navbar jika ingin membeli sayur
    - Pada page Menu akan ditampilkan menu sayuran yang sudah ditambahkan admin beserta harga dan stok yang tersedia
    - User menambahkan beberapa sayur ke keranjang lalu tekan tombol keranjang yang muncul di kanan bawah 
    - Akan masuk ke page cart dan user melakukan pembayaran (pembayaran statis hanya bertujuan utk tampilan)
    - Ketika selesai menekan tombol bayar user akan diarahkan ke page Orders yang dapat menampilkan status pemesanannya dan history pesanan (jika ada)
    - User logout

URL Web Live
Frontend (Website): http://34.143.168.92:3000/
Backend (API): http://34.143.168.92:5000/