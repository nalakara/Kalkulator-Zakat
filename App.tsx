import React, { useState, useMemo, FC, ReactNode, useEffect, useCallback } from 'react';
import { IncomeIcon, WealthIcon, GoldIcon, BusinessIcon, FitrahIcon, ChevronDownIcon } from './components/Icons';
import { CurrencyInput, NumberInput } from './components/Inputs';
import { ZakatChart } from './components/ZakatChart';
import { ZakatDistributionGuide } from './components/ZakatDistributionGuide';

// --- Constants ---
const ZAKAT_RATE = 0.025;
const GOLD_NISAB_GRAMS = 85;
const SILVER_NISAB_GRAMS = 595;
const ZAKAT_FITRAH_IDR_DEFAULT = 45000;
const API_URL = 'https://api.npoint.io/fdc91b9c833d9804c86e'; // Mock API for gold/silver prices

// --- Type Definitions ---
type PriceSource = 'online' | 'manual' | null;

// --- Helper Functions ---
const formatRupiah = (value: number) => {
  if (isNaN(value)) value = 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value));
};

// --- Main App Component ---
export default function App() {
  const [prices, setPrices] = useState<{ gold: number; silver: number } | null>(null);
  const [priceSourceInfo, setPriceSourceInfo] = useState<string>('');
  const [citations, setCitations] = useState<string[]>([]);
  const [manualGoldPrice, setManualGoldPrice] = useState(0);
  const [manualSilverPrice, setManualSilverPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceSource, setPriceSource] = useState<PriceSource>(null);

  // --- Calculator States ---
  // 1. Zakat Penghasilan
  const [income, setIncome] = useState(0);

  // 2. Zakat Mal
  const [savings, setSavings] = useState(0);
  const [investments, setInvestments] = useState(0);
  const [malHaulMet, setMalHaulMet] = useState(true);

  // 3. Zakat Emas & Perak
  const [goldWeight, setGoldWeight] = useState(0);
  const [silverWeight, setSilverWeight] = useState(0);

  // 4. Zakat Perniagaan
  const [capital, setCapital] = useState(0);
  const [profit, setProfit] = useState(0);
  const [receivables, setReceivables] = useState(0);
  const [liabilities, setLiabilities] = useState(0);
  const [perniagaanHaulMet, setPerniagaanHaulMet] = useState(true);

  // 5. Zakat Fitrah
  const [people, setPeople] = useState(1);
  const [fitrahPricePerPerson, setFitrahPricePerPerson] = useState(ZAKAT_FITRAH_IDR_DEFAULT);

  // --- Fetch Gold & Silver Prices ---
  const fetchPrices = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPriceSource(null);
    try {
      const response = await fetch('/api/gold-price');
      if (!response.ok) {
        throw new Error('Gagal memuat data harga dari server backend.');
      }
      const data = await response.json();
      if (!data.gold_price_per_gram_idr || !data.silver_price_per_gram_idr) {
        throw new Error('Format data harga tidak valid.');
      }
      setPrices({
        gold: data.gold_price_per_gram_idr,
        silver: data.silver_price_per_gram_idr,
      });
      setPriceSourceInfo(data.source || 'Gemini Search Grounding');
      setCitations(data.citations || []);
      setPriceSource('online');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan tidak diketahui.');
      setPrices(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  const handleUseManualPrices = () => {
    if (manualGoldPrice > 0 && manualSilverPrice > 0) {
      setPrices({ gold: manualGoldPrice, silver: manualSilverPrice });
      setPriceSource('manual');
      setError(null);
    }
  };

  const handleResetAll = () => {
    setIncome(0);
    setSavings(0);
    setInvestments(0);
    setMalHaulMet(true);
    setGoldWeight(0);
    setSilverWeight(0);
    setCapital(0);
    setProfit(0);
    setReceivables(0);
    setLiabilities(0);
    setPerniagaanHaulMet(true);
    setPeople(1);
    setFitrahPricePerPerson(ZAKAT_FITRAH_IDR_DEFAULT);
  };

  // --- Zakat Calculations ---
  // 1. Penghasilan
  const nisabPenghasilanBulan = useMemo(() => (prices ? (prices.gold * GOLD_NISAB_GRAMS) / 12 : 0), [prices]);
  const zakatPenghasilan = useMemo(() => (income >= nisabPenghasilanBulan ? income * ZAKAT_RATE : 0), [income, nisabPenghasilanBulan]);

  // 2. Mal
  const totalWealthMal = useMemo(() => savings + investments, [savings, investments]);
  const nisabMal = useMemo(() => (prices ? prices.gold * GOLD_NISAB_GRAMS : 0), [prices]);
  const zakatMal = useMemo(() => (malHaulMet && totalWealthMal >= nisabMal ? totalWealthMal * ZAKAT_RATE : 0), [totalWealthMal, nisabMal, malHaulMet]);

  // 3. Emas & Perak
  const { totalZakatEmasPerak, descriptionEmasPerak } = useMemo(() => {
    if (!prices) return { totalZakatEmasPerak: 0, descriptionEmasPerak: '' };
    const goldValue = goldWeight * prices.gold;
    const silverValue = silverWeight * prices.silver;
    const silverNisabValue = SILVER_NISAB_GRAMS * prices.silver;

    let zakatEmas = 0;
    let zakatPerak = 0;
    let zakatGabungan = 0;
    let desc = '';

    if (goldWeight >= GOLD_NISAB_GRAMS) {
      zakatEmas = goldValue * ZAKAT_RATE;
      desc += 'Nisab Emas terpenuhi. ';
    }
    if (silverWeight >= SILVER_NISAB_GRAMS) {
      zakatPerak = silverValue * ZAKAT_RATE;
      desc += 'Nisab Perak terpenuhi. ';
    }
    if (zakatEmas === 0 && zakatPerak === 0 && (goldValue + silverValue) >= silverNisabValue && (goldWeight > 0 || silverWeight > 0)) {
      zakatGabungan = (goldValue + silverValue) * ZAKAT_RATE;
      desc = 'Nisab gabungan (nilai emas & perak) terpenuhi via nisab perak.';
    }

    return { totalZakatEmasPerak: zakatEmas + zakatPerak + zakatGabungan, descriptionEmasPerak: desc.trim() };
  }, [goldWeight, silverWeight, prices]);

  // 4. Perniagaan
  const netAssetsPerniagaan = useMemo(() => capital + profit + receivables - liabilities, [capital, profit, receivables, liabilities]);
  const nisabPerniagaan = useMemo(() => (prices ? prices.gold * GOLD_NISAB_GRAMS : 0), [prices]);
  const zakatPerniagaan = useMemo(() => (perniagaanHaulMet && netAssetsPerniagaan >= nisabPerniagaan ? netAssetsPerniagaan * ZAKAT_RATE : 0), [netAssetsPerniagaan, nisabPerniagaan, perniagaanHaulMet]);

  // 5. Fitrah
  const zakatFitrah = useMemo(() => Math.max(0, people) * fitrahPricePerPerson, [people, fitrahPricePerPerson]);

  // Grand Total Zakat
  const grandTotalZakat = useMemo(() => {
    return zakatPenghasilan + zakatMal + totalZakatEmasPerak + zakatPerniagaan + zakatFitrah;
  }, [zakatPenghasilan, zakatMal, totalZakatEmasPerak, zakatPerniagaan, zakatFitrah]);

  const navItems = [
    { id: 'penghasilan', name: 'Penghasilan', icon: <IncomeIcon /> },
    { id: 'mal', name: 'Mal', icon: <WealthIcon /> },
    { id: 'emas-perak', name: 'Emas & Perak', icon: <GoldIcon /> },
    { id: 'perniagaan', name: 'Perniagaan', icon: <BusinessIcon /> },
    { id: 'fitrah', name: 'Fitrah', icon: <FitrahIcon /> },
    { id: 'ringkasan', name: 'Ringkasan Total', icon: <span className="font-bold">∑</span> },
    { id: 'penyaluran', name: 'Penyaluran Zakat', icon: <span>🤝</span> },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90; // Offset for sticky navbar
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <main className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-teal-600">Kalkulator Zakat</h1>
          <p className="mt-2 text-base sm:text-lg text-slate-600">
            Hitung seluruh jenis kewajiban zakat Anda dalam satu halaman sederhana.
          </p>
        </header>

        {/* Harga Acuan Section */}
        <section className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Harga Acuan Nisab {priceSource && `(${priceSource === 'online' ? 'Online' : 'Manual'})`}
          </h2>
          {loading && (
            <div className="text-center text-slate-600 py-4">
              <p>Memuat harga emas & perak terkini...</p>
            </div>
          )}
          {error && !loading && (
            <div className="text-center py-4">
              <p className="mb-2 font-medium text-red-600">{error}</p>
              <p className="text-sm text-slate-600 mb-4">Silakan masukkan harga secara manual atau coba lagi.</p>
              <div className="space-y-4 my-4 text-left max-w-sm mx-auto">
                <CurrencyInput label="Harga Emas per Gram" value={manualGoldPrice} onValueChange={setManualGoldPrice} id="manual-gold" />
                <CurrencyInput label="Harga Perak per Gram" value={manualSilverPrice} onValueChange={setManualSilverPrice} id="manual-silver" />
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-5">
                <button
                  onClick={fetchPrices}
                  className="bg-slate-500 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold"
                >
                  Coba Lagi
                </button>
                <button
                  onClick={handleUseManualPrices}
                  disabled={manualGoldPrice <= 0 || manualSilverPrice <= 0}
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-semibold disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                  Gunakan Harga Ini
                </button>
              </div>
            </div>
          )}
          {prices && !error && !loading && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                <div className="bg-slate-100 p-3 rounded-lg">
                  <p className="text-sm text-slate-600">Harga Emas per Gram</p>
                  <p className="text-lg font-bold text-slate-800">{formatRupiah(prices.gold)}</p>
                </div>
                <div className="bg-slate-100 p-3 rounded-lg">
                  <p className="text-sm text-slate-600">Harga Perak per Gram</p>
                  <p className="text-lg font-bold text-slate-800">{formatRupiah(prices.silver)}</p>
                </div>
              </div>
              <div className="text-xs text-slate-500 text-center mt-3 space-y-1">
                <p>
                  {priceSource === 'online'
                    ? `Sumber: ${priceSourceInfo || 'Pencarian Otomatis Real-time'}`
                    : 'Harga dimasukkan secara manual.'}
                </p>
                {citations.length > 0 && (
                  <p className="text-[11px] text-slate-400">
                    Referensi Web: {citations.join(' • ')}
                  </p>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Sticky Jump Nav */}
        {prices && !loading && (
          <nav className="sticky top-2 z-20 bg-white/95 backdrop-blur-md shadow-md rounded-xl p-2 border border-slate-200 mb-8 overflow-x-auto flex items-center justify-start sm:justify-center gap-1 sm:gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-teal-600 hover:text-white transition-all whitespace-nowrap shrink-0"
              >
                {item.icon}
                {item.name}
              </button>
            ))}
          </nav>
        )}

        {/* All Calculators in Single Page */}
        {prices && !loading && (
          <div className="space-y-8">
            {/* 1. Zakat Penghasilan */}
            <CalculatorCard id="penghasilan" title="1. Zakat Penghasilan (Profesi)" icon={<IncomeIcon />}>
              <CurrencyInput
                label="Penghasilan Bruto per Bulan"
                value={income}
                onValueChange={setIncome}
                id="monthly-income"
              />
              <NisabInfo nisabValue={nisabPenghasilanBulan} period="per Bulan" />
              <ZakatInfoAccordion title="Apa itu Zakat Penghasilan?">
                <p>
                  Zakat profesi atau penghasilan adalah zakat yang dikeluarkan dari penghasilan yang diperoleh dari pekerjaan atau jasa. Nisabnya diqiyaskan dengan nisab zakat pertanian, yaitu senilai 85 gram emas per tahun (dibagi 12 untuk bulan). Besaran zakat adalah 2.5% jika total penghasilan bulanan telah mencapai atau melebihi nisab bulanan.
                </p>
              </ZakatInfoAccordion>
              <ResultDisplay label="Estimasi Zakat Penghasilan per Bulan" value={zakatPenghasilan} />
            </CalculatorCard>

            {/* 2. Zakat Mal */}
            <CalculatorCard id="mal" title="2. Zakat Mal (Kekayaan)" icon={<WealthIcon />}>
              <div className="space-y-4">
                <CurrencyInput label="Total Tabungan (tunai, bank, deposito)" value={savings} onValueChange={setSavings} id="savings" />
                <CurrencyInput label="Nilai Investasi & Aset Lancar Lainnya" value={investments} onValueChange={setInvestments} id="investments" />
              </div>
              <HaulCheckbox checked={malHaulMet} onChange={setMalHaulMet} />
              <NisabInfo nisabValue={nisabMal} period="per Tahun" />
              <ZakatInfoAccordion title="Apa itu Zakat Mal?">
                <p>
                  Zakat Mal adalah zakat atas harta kekayaan (seperti tabungan, investasi) yang telah dimiliki secara penuh, mencapai nisab (setara 85 gram emas), dan telah tersimpan selama satu tahun hijriah (haul). Besaran zakat yang dikeluarkan adalah 2.5% dari total harta.
                </p>
              </ZakatInfoAccordion>
              <ResultDisplay label="Estimasi Zakat Mal per Tahun" value={zakatMal} />
            </CalculatorCard>

            {/* 3. Zakat Emas & Perak */}
            <CalculatorCard id="emas-perak" title="3. Zakat Emas & Perak" icon={<GoldIcon />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <NumberInput label="Berat Emas (gram)" value={goldWeight} onValueChange={setGoldWeight} id="gold-weight" unit="gram" />
                <NumberInput label="Berat Perak (gram)" value={silverWeight} onValueChange={setSilverWeight} id="silver-weight" unit="gram" />
              </div>
              <p className="text-xs text-center text-slate-500 my-2">Diasumsikan sudah mencapai haul (1 tahun kepemilikan).</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="bg-slate-100 p-3 rounded-lg text-center">
                  <p className="text-sm text-slate-600">Nisab Emas</p>
                  <p className="text-lg font-semibold text-slate-800">{GOLD_NISAB_GRAMS} gram</p>
                </div>
                <div className="bg-slate-100 p-3 rounded-lg text-center">
                  <p className="text-sm text-slate-600">Nisab Perak</p>
                  <p className="text-lg font-semibold text-slate-800">{SILVER_NISAB_GRAMS} gram</p>
                </div>
              </div>
              <p className="text-xs text-center text-slate-500 mt-2">
                Jika emas/perak tidak mencapai nisab masing-masing, nilainya dapat digabungkan dan diukur dengan nisab perak.
              </p>
              <ZakatInfoAccordion title="Apa itu Zakat Emas & Perak?">
                <p>
                  Zakat dikenakan atas emas dan perak yang disimpan. Nisab emas adalah 85 gram, dan nisab perak adalah 595 gram. Jika kepemilikan telah mencapai nisab dan haul (1 tahun), wajib dikeluarkan zakat sebesar 2.5%.
                </p>
              </ZakatInfoAccordion>
              <ResultDisplay label="Estimasi Zakat Emas & Perak per Tahun" value={totalZakatEmasPerak} description={descriptionEmasPerak} />
            </CalculatorCard>

            {/* 4. Zakat Perniagaan */}
            <CalculatorCard id="perniagaan" title="4. Zakat Perniagaan" icon={<BusinessIcon />}>
              <div className="space-y-4">
                <CurrencyInput label="Modal Usaha yang Berputar (1 tahun)" value={capital} onValueChange={setCapital} id="capital" />
                <CurrencyInput label="Laba Bersih (1 tahun)" value={profit} onValueChange={setProfit} id="profit" />
                <CurrencyInput label="Piutang Dagang (diharapkan kembali)" value={receivables} onValueChange={setReceivables} id="receivables" />
                <CurrencyInput label="Utang Jatuh Tempo" value={liabilities} onValueChange={setLiabilities} id="liabilities" />
              </div>
              <HaulCheckbox checked={perniagaanHaulMet} onChange={setPerniagaanHaulMet} />
              <NisabInfo nisabValue={nisabPerniagaan} period="per Tahun" />
              <ZakatInfoAccordion title="Apa itu Zakat Perniagaan?">
                <p>
                  Zakat ini dikenakan atas aset perdagangan yang dimiliki. Aset yang dihitung mencakup modal yang berputar, keuntungan, dan piutang yang diharapkan kembali, dikurangi utang jatuh tempo. Jika total aset bersih telah mencapai nisab (setara 85 gram emas) dan haul (1 tahun), zakatnya adalah 2.5%.
                </p>
              </ZakatInfoAccordion>
              <ResultDisplay label="Estimasi Zakat Perniagaan per Tahun" value={zakatPerniagaan} />
            </CalculatorCard>

            {/* 5. Zakat Fitrah */}
            <CalculatorCard id="fitrah" title="5. Zakat Fitrah" icon={<FitrahIcon />}>
              <div className="space-y-4">
                <NumberInput label="Jumlah Jiwa" value={people} onValueChange={(v) => setPeople(Math.max(1, v))} id="people-count" unit="jiwa" />
                <CurrencyInput label="Harga Beras / Makanan Pokok per Jiwa" value={fitrahPricePerPerson} onValueChange={setFitrahPricePerPerson} id="fitrah-price" />
              </div>
              <div className="bg-slate-100 p-3 rounded-lg text-center mt-4">
                <p className="text-sm text-slate-600">Besaran Zakat Fitrah per Jiwa</p>
                <p className="text-lg font-semibold text-slate-800">{formatRupiah(fitrahPricePerPerson)}</p>
                <p className="text-xs text-slate-500 mt-1">(Setara dengan 2.5 kg / 3.5 liter beras per jiwa)</p>
              </div>
              <ZakatInfoAccordion title="Apa itu Zakat Fitrah?">
                <p>
                  Zakat Fitrah adalah zakat jiwa yang wajib dikeluarkan oleh setiap Muslim yang mampu pada bulan Ramadan hingga sebelum salat Idul Fitri. Besarannya adalah 2.5 kg (atau 3.5 liter) makanan pokok (seperti beras) atau nilai uang yang setara per jiwa.
                </p>
              </ZakatInfoAccordion>
              <ResultDisplay label="Total Estimasi Zakat Fitrah" value={zakatFitrah} />
            </CalculatorCard>

            {/* 6. Ringkasan Total Zakat */}
            <div id="ringkasan" className="bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-teal-700 mt-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-teal-600/50">
                <div>
                  <span className="inline-block px-3 py-1 bg-teal-500/30 text-teal-200 border border-teal-400/30 rounded-full text-xs font-semibold tracking-wide mb-2 uppercase">
                    Ringkasan Akhir
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold">Total Estimasi Zakat Anda</h2>
                  <p className="text-teal-200 text-xs sm:text-sm mt-1">
                    Akumulasi seluruh jenis zakat yang telah Anda hitung di atas.
                  </p>
                </div>
                <div className="text-left sm:text-right bg-teal-900/60 p-4 rounded-xl border border-teal-500/30">
                  <p className="text-xs text-teal-200 font-medium">Total Kewajiban Zakat</p>
                  <p className="text-3xl sm:text-4xl font-extrabold text-amber-300 mt-1">
                    {formatRupiah(grandTotalZakat)}
                  </p>
                </div>
              </div>

              {/* Rincian Breakdown */}
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between items-center py-2.5 border-b border-teal-700/60">
                  <span className="flex items-center gap-2 text-teal-100">
                    <IncomeIcon /> Zakat Penghasilan
                  </span>
                  <span className={`font-semibold ${zakatPenghasilan > 0 ? 'text-amber-300' : 'text-teal-300'}`}>
                    {formatRupiah(zakatPenghasilan)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-teal-700/60">
                  <span className="flex items-center gap-2 text-teal-100">
                    <WealthIcon /> Zakat Mal (Kekayaan)
                  </span>
                  <span className={`font-semibold ${zakatMal > 0 ? 'text-amber-300' : 'text-teal-300'}`}>
                    {formatRupiah(zakatMal)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-teal-700/60">
                  <span className="flex items-center gap-2 text-teal-100">
                    <GoldIcon /> Zakat Emas & Perak
                  </span>
                  <span className={`font-semibold ${totalZakatEmasPerak > 0 ? 'text-amber-300' : 'text-teal-300'}`}>
                    {formatRupiah(totalZakatEmasPerak)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-teal-700/60">
                  <span className="flex items-center gap-2 text-teal-100">
                    <BusinessIcon /> Zakat Perniagaan
                  </span>
                  <span className={`font-semibold ${zakatPerniagaan > 0 ? 'text-amber-300' : 'text-teal-300'}`}>
                    {formatRupiah(zakatPerniagaan)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-teal-700/60">
                  <span className="flex items-center gap-2 text-teal-100">
                    <FitrahIcon /> Zakat Fitrah
                  </span>
                  <span className={`font-semibold ${zakatFitrah > 0 ? 'text-amber-300' : 'text-teal-300'}`}>
                    {formatRupiah(zakatFitrah)}
                  </span>
                </div>
              </div>

              {/* Chart Visualization */}
              <ZakatChart
                zakatPenghasilan={zakatPenghasilan}
                zakatMal={zakatMal}
                totalZakatEmasPerak={totalZakatEmasPerak}
                zakatPerniagaan={zakatPerniagaan}
                zakatFitrah={zakatFitrah}
                grandTotal={grandTotalZakat}
              />

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleResetAll}
                  className="bg-teal-700 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors border border-teal-500/50 shadow-sm"
                >
                  Reset Semua Perhitungan
                </button>
              </div>
            </div>

            {/* 7. Panduan & Lembaga Penyaluran Zakat */}
            <ZakatDistributionGuide />
          </div>
        )}

        <footer className="mt-12 text-center text-xs text-slate-500">
          <p className="font-semibold mb-1">DISCLAIMER</p>
          <p>
            Kalkulator ini adalah alat bantu untuk estimasi. Perhitungan akhir yang akurat sebaiknya dikonsultasikan dengan lembaga amil zakat atau ulama terpercaya di daerah Anda.
          </p>
          <p className="mt-4 font-semibold text-slate-600">by NALAKARA</p>
        </footer>
      </main>
    </div>
  );
}

// --- Reusable Sub-components ---

const CalculatorCard: FC<{ id: string; title: string; icon?: ReactNode; children: ReactNode }> = ({ id, title, icon, children }) => (
  <div id={id} className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200 transition-all hover:shadow-xl">
    <div className="flex items-center justify-center gap-2.5 mb-6">
      {icon && <span className="text-teal-600">{icon}</span>}
      <h2 className="text-2xl font-bold text-slate-800 text-center">{title}</h2>
    </div>
    {children}
  </div>
);

const ResultDisplay: FC<{ label: string; value: number; description?: string }> = ({ label, value, description }) => (
  <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded-r-lg mt-6">
    <p className="text-sm text-teal-700">{label}</p>
    <p className="text-2xl sm:text-3xl font-bold text-teal-600">{formatRupiah(value)}</p>
    {description && <p className="text-xs text-teal-600 mt-1">{description}</p>}
  </div>
);

const NisabInfo: FC<{ nisabValue: number; period?: string }> = ({ nisabValue, period }) => (
  <div className="bg-slate-100 p-3 rounded-lg text-center mt-4">
    <p className="text-sm text-slate-600">Nisab {period ? `(${period})` : ''}</p>
    <p className="text-lg font-semibold text-slate-800">{formatRupiah(nisabValue)}</p>
  </div>
);

const HaulCheckbox: FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({ checked, onChange }) => (
  <div className="flex items-center justify-center mt-5">
    <input
      type="checkbox"
      id={`haul-${Math.random().toString(36).substring(2, 7)}`}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
    />
    <label htmlFor="haul" className="ml-2 block text-sm text-slate-700 cursor-pointer">
      Sudah mencapai 1 tahun (haul)?
    </label>
  </div>
);

const ZakatInfoAccordion: FC<{ title: string; children: ReactNode }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t border-slate-200 mt-6 pt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left text-slate-700 hover:text-teal-600 focus:outline-none"
        aria-expanded={isOpen}
      >
        <span className="font-semibold">{title}</span>
        <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="mt-3 text-sm text-slate-600 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
};
