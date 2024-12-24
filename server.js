// Eko Muchamad Haryono - Mahasiswa Semester 3
const Hapi = require('@hapi/hapi'); // Import Hapi framework untuk membuat server
const routes = require('./routes'); // Import konfigurasi routes dari file routes.js

const init = async () => {
    const server = Hapi.server({
        // Membuat server dengan konfigurasi berikut:
        port: 9000, // Port tempat server berjalan
        host: 'localhost', // Host server
        routes: {
            cors: {
                origin: ['*'], // Mengizinkan semua origin untuk akses API (CORS)
            },
        },
    });

    server.route(routes); // Mendaftarkan routes ke server

    await server.start(); // Menjalankan server
    console.log(`Server running on ${server.info.uri}`); // Menampilkan info server yang sedang berjalan
};

init(); // Memanggil fungsi init untuk memulai server
// Eko Muchamad Haryono - Mahasiswa Semester 3
