import React from 'react';

interface LazInfo {
  name: string;
  category: string;
  description: string;
  url: string;
  badge: string;
}

const LAZ_LIST: LazInfo[] = [
  {
    name: 'BAZNAS RI',
    category: 'Lembaga Pemerintah',
    description: 'Badan Amil Zakat Nasional resmi pemerintah Republik Indonesia untuk penghimpunan dan penyaluran zakat nasional.',
    url: 'https://baznas.go.id/bayarzakat',
    badge: 'Resmi Negara',
  },
  {
    name: 'Dompet Dhuafa',
    category: 'LAZ Nasional',
    description: 'Lembaga amil zakat pemberdayaan masyarakat dan kemanusiaan tepercaya di Indonesia.',
    url: 'https://donasi.dompetdhuafa.org',
    badge: 'Terakreditasi',
  },
  {
    name: 'Rumah Zakat',
    category: 'LAZ Nasional',
    description: 'Fokus pada program pemberdayaan masyarakat, pendidikan, kesehatan, dan penanggulangan bencana.',
    url: 'https://www.rumahzakat.org/donasi',
    badge: 'Terakreditasi',
  },
  {
    name: 'LAZISMU',
    category: 'LAZ Ormas',
    description: 'Lembaga Amil Zakat, Infaq, dan Sedekah Muhammadiyah berorientasi pada pemberdayaan sosial umat.',
    url: 'https://lazismu.org',
    badge: 'Ormas Islam',
  },
  {
    name: 'LAZISNU / NU Care',
    category: 'LAZ Ormas',
    description: 'Lembaga Amil Zakat, Infaq, dan Shadaqah Nahdlatul Ulama yang mengelola zakat secara profesional.',
    url: 'https://nucare.id',
    badge: 'Ormas Islam',
  },
];

export const ZakatDistributionGuide: React.FC = () => {
  return (
    <section id="penyaluran" className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xl shadow-sm">
          🤝
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Panduan & Opsi Penyaluran Zakat</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Penyaluran zakat yang tepat sasaran melalui lembaga amil zakat resmi di Indonesia.
          </p>
        </div>
      </div>

      {/* Tips Penyaluran Zakat */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="text-teal-600 font-bold text-sm mb-1 flex items-center gap-1.5">
            <span>1️⃣</span> Pastikan Terdaftar Resmi
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Pilihlah BAZNAS atau LAZ (Lembaga Amil Zakat) yang memiliki izin resmi dari Kementerian Agama RI agar transparansi laporan keuangan terjamin.
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="text-teal-600 font-bold text-sm mb-1 flex items-center gap-1.5">
            <span>2️⃣</span> Niat & Konfirmasi Zakat
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Saat menyalurkan secara online atau offline, bacalah niat zakat sesuai jenisnya dan pastikan mendapat bukti/akad penerimaan zakat dari amil.
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="text-teal-600 font-bold text-sm mb-1 flex items-center gap-1.5">
            <span>3️⃣</span> Pengurangan Penghasilan Kena Pajak
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Bukti setoran zakat dari BAZNAS/LAZ resmi dapat dilampirkan dalam SPT Tahunan untuk mengurangi Penghasilan Kena Pajak (PKP) sesuai UU Pajak.
          </p>
        </div>
      </div>

      {/* Daftar Lembaga Amil Zakat */}
      <div>
        <h3 className="text-base font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <span>🏛️</span> Rekomendasi Lembaga Amil Zakat Resmi
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {LAZ_LIST.map((laz) => (
            <a
              key={laz.name}
              href={laz.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 bg-slate-50 hover:bg-teal-50/60 rounded-xl border border-slate-200 hover:border-teal-300 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-sm text-slate-800 group-hover:text-teal-700 transition-colors">
                    {laz.name}
                  </h4>
                  <span className="text-[10px] font-medium bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
                    {laz.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                  {laz.description}
                </p>
              </div>

              <div className="flex items-center text-xs font-semibold text-teal-600 group-hover:text-teal-700 mt-auto pt-2 border-t border-slate-200/60">
                Salurkan Zakat
                <svg
                  className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
