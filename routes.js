// Eko Muchamad Haryono - Mahasiswa Semester 3
const { nanoid } = require('nanoid'); // Import nanoid untuk membuat ID unik
const books = []; // Array untuk menyimpan data buku

const routes = [
    {
        method: 'POST', // Menangani penambahan buku
        path: '/books',
        handler: (request, h) => {
            const {
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                reading,
            } = request.payload;

            // Validasi: Properti 'name' harus ada
            if (!name) {
                return h
                    .response({
                        status: 'fail',
                        message: 'Gagal menambahkan buku. Mohon isi nama buku',
                    })
                    .code(400);
            }

            // Validasi: 'readPage' tidak boleh lebih besar dari 'pageCount'
            if (readPage > pageCount) {
                return h
                    .response({
                        status: 'fail',
                        message:
                            'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
                    })
                    .code(400);
            }

            // Membuat properti tambahan untuk buku
            const id = nanoid(16); // Membuat ID unik
            const finished = pageCount === readPage; // Buku selesai jika pageCount === readPage
            const insertedAt = new Date().toISOString(); // Tanggal buku ditambahkan
            const updatedAt = insertedAt; // Tanggal terakhir diperbarui sama dengan insertedAt

            // Membuat objek buku baru
            const newBook = {
                id,
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                reading,
                finished,
                insertedAt,
                updatedAt,
            };

            books.push(newBook); // Menambahkan buku ke array

            return h
                .response({
                    // Mengembalikan respons sukses
                    status: 'success',
                    message: 'Buku berhasil ditambahkan',
                    data: {
                        bookId: id,
                    },
                })
                .code(201);
        },
    },
    {
        method: 'GET', // Menangani permintaan untuk mendapatkan semua buku
        path: '/books',
        handler: (request, h) => {
            const { name, reading, finished } = request.query; // Query parameters untuk filter

            let filteredBooks = books; // Awalnya semua buku ditampilkan

            // Filter berdasarkan nama buku
            if (name) {
                filteredBooks = filteredBooks.filter((book) =>
                    book.name.toLowerCase().includes(name.toLowerCase())
                );
            }

            // Filter berdasarkan status membaca
            if (reading !== undefined) {
                filteredBooks = filteredBooks.filter(
                    (book) => book.reading === (reading === '1')
                );
            }

            // Filter berdasarkan status selesai dibaca
            if (finished !== undefined) {
                filteredBooks = filteredBooks.filter(
                    (book) => book.finished === (finished === '1')
                );
            }

            return h
                .response({
                    // Mengembalikan daftar buku yang difilter
                    status: 'success',
                    data: {
                        books: filteredBooks.map(({ id, name, publisher }) => ({
                            id,
                            name,
                            publisher,
                        })),
                    },
                })
                .code(200);
        },
    },
    {
        method: 'GET', // Menangani permintaan detail buku
        path: '/books/{bookId}',
        handler: (request, h) => {
            const { bookId } = request.params; // Mendapatkan ID buku dari path parameter
            const book = books.find((b) => b.id === bookId); // Mencari buku berdasarkan ID

            if (!book) {
                // Jika buku tidak ditemukan
                return h
                    .response({
                        status: 'fail',
                        message: 'Buku tidak ditemukan',
                    })
                    .code(404);
            }

            return {
                // Jika buku ditemukan, kembalikan detailnya
                status: 'success',
                data: { book },
            };
        },
    },
    {
        method: 'PUT', // Menangani pembaruan data buku
        path: '/books/{bookId}',
        handler: (request, h) => {
            const { bookId } = request.params; // Mendapatkan ID buku dari path parameter
            const {
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                reading,
            } = request.payload;

            const index = books.findIndex((b) => b.id === bookId); // Mencari index buku berdasarkan ID

            // Validasi: Properti 'name' harus ada
            if (!name) {
                return h
                    .response({
                        status: 'fail',
                        message: 'Gagal memperbarui buku. Mohon isi nama buku',
                    })
                    .code(400);
            }

            // Validasi: 'readPage' tidak boleh lebih besar dari 'pageCount'
            if (readPage > pageCount) {
                return h
                    .response({
                        status: 'fail',
                        message:
                            'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
                    })
                    .code(400);
            }

            if (index === -1) {
                // Jika ID buku tidak ditemukan
                return h
                    .response({
                        status: 'fail',
                        message: 'Gagal memperbarui buku. Id tidak ditemukan',
                    })
                    .code(404);
            }

            const updatedAt = new Date().toISOString(); // Perbarui waktu terakhir diperbarui
            books[index] = {
                // Perbarui data buku
                ...books[index],
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                reading,
                finished: pageCount === readPage,
                updatedAt,
            };

            return h
                .response({
                    // Respons sukses pembaruan
                    status: 'success',
                    message: 'Buku berhasil diperbarui',
                })
                .code(200);
        },
    },
    {
        method: 'DELETE', // Menangani penghapusan buku
        path: '/books/{bookId}',
        handler: (request, h) => {
            const { bookId } = request.params; // Mendapatkan ID buku dari path parameter
            const index = books.findIndex((b) => b.id === bookId); // Mencari index buku berdasarkan ID

            if (index === -1) {
                // Jika buku tidak ditemukan
                return h
                    .response({
                        status: 'fail',
                        message: 'Buku gagal dihapus. Id tidak ditemukan',
                    })
                    .code(404);
            }

            books.splice(index, 1); // Menghapus buku dari array

            return h
                .response({
                    // Respons sukses penghapusan
                    status: 'success',
                    message: 'Buku berhasil dihapus',
                })
                .code(200);
        },
    },
];

module.exports = routes;
// Eko Muchamad Haryono - Mahasiswa Semester 3
