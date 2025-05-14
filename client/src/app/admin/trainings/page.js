// src/app/admin/pelatihan/page.js
import Link from 'next/link';
import { getTrainings } from '../../../lib/api'; // Sesuaikan path
import { format, parseISO } from 'date-fns';
import { id as localeID } from 'date-fns/locale';

// Komponen kecil untuk Aksi (bisa dipisah jika lebih kompleks)
// Jika tombol delete/edit memicu state atau API call client-side, mereka perlu 'use client'
// atau halaman ini jadi client component, atau tombolnya jadi client component terpisah.
// Untuk Link, tidak perlu 'use client'
const ActionButtons = ({ trainingId }) => {
    // Jika tombol delete butuh konfirmasi atau state, ini jadi Client Component
    const handleDelete = async (id) => {
        // 'use client'; // Jika fungsi ini ada di sini
        if (window.confirm('Yakin hapus? (Fungsi delete belum diimplementasikan di UI ini)')) {
            // panggil deleteTraining(id)
            console.log("Hapus", id);
            // refresh data: router.refresh() atau state management
        }
    }
    return (
        <>
            <Link href={`/admin/pelatihan/${trainingId}`} legacyBehavior><a className="btn-icon" title="Lihat">👁️</a></Link>
            <Link href={`/admin/pelatihan/${trainingId}/edit`} legacyBehavior><a className="btn-icon" title="Edit">✏️</a></Link>
            {/* <button onClick={() => handleDelete(trainingId)} className="btn-icon" title="Hapus">🗑️</button> */}
            {/* Tombol delete perlu penanganan client-side, jadi kita komen dulu atau buat komponen terpisah */}
             <span className="btn-icon" title="Hapus (perlu client component)">🗑️</span>
        </>
    )
}

// Helper format tanggal
const formatDateRange = (start, end) => {
    if (!start || !end) return '-';
    const startDate = parseISO(start);
    const endDate = parseISO(end);
    if (startDate.getFullYear() === endDate.getFullYear() && startDate.getMonth() === endDate.getMonth()) {
        return `${format(startDate, 'd')} - ${format(endDate, 'd MMMM yyyy', { locale: localeID })}`;
    }
    return `${format(startDate, 'd MMMM yyyy', { locale: localeID })} - ${format(endDate, 'd MMMM yyyy', { locale: localeID })}`;
};


// Page component adalah Server Component by default
export default async function PelatihanPage() {
    let trainings = [];
    let totalTrainings = 0;
    let error = null;

    try {
        // Fetch data di Server Component
        // TODO: Tambahkan query params untuk filter dan search di getTrainings
        const response = await getTrainings({ /* page: 1, limit: 10 */ });
        trainings = response.data.data || [];
        totalTrainings = response.data.total || 0;
    } catch (err) {
        console.error("Failed to fetch trainings:", err);
        error = "Gagal memuat data pelatihan.";
        // Di Server Component, Anda tidak bisa menggunakan useState untuk error.
        // Anda bisa melempar error agar ditangkap oleh error.js, atau render pesan error.
    }

    // TODO: Komponen Filter (akan jadi Client Component)
    // const FilterBar = () => { 'use client'; ... return (...); }

    return (
        <div>
            <div className="page-header">
                <h1>List Pelatihan <span className="total-badge">Total: {totalTrainings}</span></h1>
                <Link href="/admin/pelatihan/tambah" legacyBehavior>
                    <a className="btn btn-primary">Tambah Pelatihan</a>
                </Link>
            </div>

            {/* Tempat untuk FilterBar nantinya */}
            {/* <FilterBar /> */}
            <div className="filter-bar" style={{ marginBottom: '20px' }}>
                <input type="text" placeholder="Pilih Kategori (filter belum aktif)" style={{ marginRight: '10px' }} />
                <input type="text" placeholder="Pilih Bulan (filter belum aktif)" style={{ marginRight: '10px' }} />
                <input type="text" placeholder="Cari Pelatihan... (filter belum aktif)" className="search-input" />
            </div>


            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!error && (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nama Pelatihan</th>
                                <th>Kategori</th>
                                <th>Periode</th>
                                <th>Batch</th>
                                <th>Peserta</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trainings.length > 0 ? trainings.map((training, index) => (
                                <tr key={training.id}>
                                    <td>{index + 1}</td>
                                    <td>{training.name}</td>
                                    <td>{training.category}</td>
                                    <td>{formatDateRange(training.startDate, training.endDate)}</td>
                                    <td>{training.batch}</td>
                                    <td>{training.participantCount || 0}</td>
                                    <td>
                                        <span className={`status-badge status-${training.status?.toLowerCase()}`}>
                                            {training.status}
                                        </span>
                                    </td>
                                    <td>
                                        <ActionButtons trainingId={training.id} />
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center' }}>Tidak ada data pelatihan ditemukan.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            {/* Style untuk status-badge bisa ditaruh di globals.css */}
             <style jsx global>{`
                .status-badge { padding: 3px 8px; border-radius: 12px; font-size: 0.8rem; color: white; text-transform: capitalize; }
                .status-running { background-color: #3b82f6; }
                .status-checking { background-color: #f59e0b; }
                .status-reschedule { background-color: #84cc16; }
                .status-planned { background-color: #6b7280; }
                .status-completed { background-color: #10b981; }
                .status-canceled { background-color: #ef4444; }
            `}</style>
        </div>
    );
}