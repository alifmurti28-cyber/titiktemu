import { Category, WorkerProfile } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'Semua Kategori', iconName: 'LayoutGrid' },
  { id: 'fotografi', name: 'Fotografi & Video', iconName: 'Camera' },
  { id: 'kuliner', name: 'Kuliner & Katering', iconName: 'Utensils' },
  { id: 'desain', name: 'Desain & Branding', iconName: 'Palette' },
  { id: 'renovasi', name: 'Tukang & Woodwork', iconName: 'Hammer' },
  { id: 'tech', name: 'Web & Software', iconName: 'Code' },
  { id: 'barista', name: 'Barista & Minuman', iconName: 'Coffee' },
  { id: 'mua', name: 'MUA & Fashion', iconName: 'Sparkles' },
  { id: 'elektronik', name: 'Service Elektronik', iconName: 'Wrench' },
  { id: 'musik', name: 'Musik & Audio', iconName: 'Music' },
];

export const INITIAL_PROFILES: WorkerProfile[] = [
  {
    id: 'wk-1',
    name: 'Rafi Kurniawan',
    businessName: 'Lensa Visual Studio',
    title: 'Commercial & Editorial Portrait Photographer',
    category: 'fotografi',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverImage: '/src/assets/images/portfolio_photo_shoot_1790780510350.jpg',
    bio: 'Fotografer komersial dan portrait berbasis di Jakarta Selatan dengan pengalaman lebih dari 6 tahun menangani campaign brand lokal, lookbook fashion, dan profile profesional. Menggunakan pencahayaan studio terkontrol dan visual mood yang clean & aesthetic.',
    city: 'Jakarta Selatan',
    fullAddress: 'Jl. Kemang Raya No. 42B, Bangka, Mampang Prapatan, Jakarta Selatan 12730',
    whatsapp: '6281298451120',
    instagram: '@rafikurnia.lens',
    portfolioUrl: 'https://instagram.com/alifmurti_28',
    startingPrice: 750000,
    priceUnit: 'sesi',
    pricePackages: [
      {
        id: 'pkg-1-1',
        name: 'Personal & Professional Headshot',
        price: 750000,
        unit: 'sesi (1.5 jam)',
        description: 'Cocok untuk kebutuhan foto profil LinkedIn, CV korporat, atau branding personal di media sosial.',
        features: [
          'Sesi studio indoor 90 menit',
          '2 pilihan lighting setup',
          '5 foto edited high-res + skin retouch',
          'Semua file mentah (preview color graded)',
          'Pengerjaan 2 hari kerja'
        ]
      },
      {
        id: 'pkg-1-2',
        name: 'Brand Lookbook & Katalog',
        price: 2200000,
        unit: 'setengah hari (4 jam)',
        description: 'Ideal untuk brand pakaian, aksesoris, atau katalog produk e-commerce.',
        features: [
          'Sesi studio / outdoor up to 4 jam',
          'Up to 12 outfit / produk look',
          '20 foto edited editorial quality',
          'Termasuk moodboard & styling consultation',
          'File master siap cetak & posting'
        ],
        popular: true
      },
      {
        id: 'pkg-1-3',
        name: 'Full Campaign + Short Reels Video',
        price: 4500000,
        unit: 'full day (8 jam)',
        description: 'Paket komplit foto campaign + video vertikal reels/TikTok untuk launching produk.',
        features: [
          'Sesi seharian (8 jam kerja)',
          'Fotografer + 1 asisten lighting',
          '35 foto edited commercial grade',
          '2 video teaser reels 4K color graded',
          'Revisi minor 2x'
        ]
      }
    ],
    workOutputs: [
      {
        id: 'wo-1-1',
        type: 'image',
        url: '/src/assets/images/portfolio_photo_shoot_1790780510350.jpg',
        title: 'Editorial Studio Fashion Shoot',
        description: 'Lighting kontras tinggi dengan palet earthy tone untuk brand streetwear.'
      },
      {
        id: 'wo-1-2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
        title: 'Minimalist Studio Portrait',
        description: 'Fotografi profil desainer produk dengan pencahayaan softbox natural.'
      },
      {
        id: 'wo-1-3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
        title: 'Urban Outdoor Commercial Shoot',
        description: 'Dokumentasi kampanye lifestyle di kawasan Senopati Jakarta.'
      }
    ],
    rating: 4.9,
    reviewCount: 38,
    reviews: [
      {
        id: 'rev-1',
        author: 'Kevin Dimas',
        rating: 5,
        date: '18 Sep 2026',
        comment: 'Mas Rafi komunikatif banget pas briefing ide foto. Hasil editan rapi dan warna tone-nya pas banget sesuai moodboard!',
        clientType: 'Owner Brand Apparel'
      },
      {
        id: 'rev-2',
        author: 'Dian Anindya',
        rating: 5,
        date: '02 Agu 2026',
        comment: 'Sangat profesional, on time datang ke lokasi, dan sangat membantu mengarahkan pose buat saya yang kaku di depan kamera.',
        clientType: 'Client Personal Headshot'
      }
    ],
    verified: true,
    featured: true,
    status: 'active',
    submittedAt: '2026-08-10',
    whatsappClicks: 142,
    viewsCount: 1280
  },
  {
    id: 'wk-2',
    name: 'Baskoro & Tim Kayu',
    businessName: 'Karya Ruang Woodcraft',
    title: 'Spesialis Custom Furniture & Renovasi Interior Minimalis',
    category: 'renovasi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    coverImage: '/src/assets/images/portfolio_interior_craft_1790780542484.jpg',
    bio: 'Pengrajin kayu modern dan kontraktor interior mikro. Berfokus pada pengerjaan kitchen set estetik, partisi kisi-kisi kayu solid, backdrop TV hidden storage, dan renovasi kamar estetik gaya Japandi atau Minimalis Modern.',
    city: 'Bandung',
    fullAddress: 'Jl. Terusan Buah Batu No. 118, Kujangsari, Bandung 40287',
    whatsapp: '6285721098877',
    instagram: '@karyaruang.wood',
    portfolioUrl: 'https://instagram.com/alifmurti_28',
    startingPrice: 1800000,
    priceUnit: 'meter lari',
    pricePackages: [
      {
        id: 'pkg-2-1',
        name: 'Paket Rak Gantung & Partisi Kisi Kayu',
        price: 1800000,
        unit: 'per meter lari',
        description: 'Partisi ruangan modern dari kayu solid meranti/jati belanda dengan finishing melamic matte.',
        features: [
          'Material blockboard 18mm / kayu solid pilihan',
          'Finishing HPL Taco atau Melamic Natural',
          'Free survey lokasi wilayah Bandung',
          'Desain 3D preview sebelum dikerjakan',
          'Garansi pengerjaan & engsel 6 bulan'
        ]
      },
      {
        id: 'pkg-2-2',
        name: 'Custom Kitchen Set Minimalis',
        price: 2600000,
        unit: 'per meter lari',
        description: 'Kabinet atas & bawah dapur tahan lembap dengan engsel soft-close dan rak piring stainless.',
        features: [
          'Bahan multiplex 18mm anti rayap & lapis HPL',
          'Engsel slow-motion & rel laci double track',
          'Sudah termasuk rak sendok & piring stainless',
          'Pemasangan rapi dan bersih',
          'Garansi struktur 1 tahun'
        ],
        popular: true
      },
      {
        id: 'pkg-2-3',
        name: 'Renovasi Kamar Tidur / Meja Kerja Custom',
        price: 4500000,
        unit: 'per unit set',
        description: 'Set meja kerja melayang, rak buku tersembunyi, dan backdrop LED aesthetic.',
        features: [
          'Meja kerja ergonomis kabel tersembunyi',
          'Backdrop motif kayu + lampu warm white LED strip',
          'Custom ukuran presisi sesuai luas kamar',
          'Instalasi kelistrikan aman'
        ]
      }
    ],
    workOutputs: [
      {
        id: 'wo-2-1',
        type: 'image',
        url: '/src/assets/images/portfolio_interior_craft_1790780542484.jpg',
        title: 'Backdrop TV & Kisi-Kisi Kayu Warm Minimalis',
        description: 'Pengerjaan interior apartemen di Bandung dengan finishing warm oak dan pencahayaan tersembunyi.'
      },
      {
        id: 'wo-2-2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
        title: 'Modern Minimalist Kitchen Island',
        description: 'Kitchen set Japandi HPL woodgrain dengan top table granit solid.'
      },
      {
        id: 'wo-2-3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
        title: 'Floating Work Desk Set',
        description: 'Meja kerja melayang ergonomis untuk home office content creator.'
      }
    ],
    rating: 4.95,
    reviewCount: 47,
    reviews: [
      {
        id: 'rev-3',
        author: 'Gilang Pratama',
        rating: 5,
        date: '24 Sep 2026',
        comment: 'Pengerjaan kitchen set tepat waktu, tukangnya sopan, hasil cat dan sambungan HPL sangat presisi tanpa cacat!',
        clientType: 'Pemilik Rumah Baru'
      },
      {
        id: 'rev-4',
        author: 'Bella Novita',
        rating: 5,
        date: '10 Agu 2026',
        comment: 'Harga transparan dari awal dan tidak ada biaya siluman. Sangat recommended buat yang cari tukang kayu modern.',
        clientType: 'Renovasi Kamar Kost'
      }
    ],
    verified: true,
    featured: true,
    status: 'active',
    submittedAt: '2026-07-15',
    whatsappClicks: 215,
    viewsCount: 2040
  },
  {
    id: 'wk-3',
    name: 'Nabila Zahra',
    businessName: 'Nabila Identity Lab',
    title: 'Brand Identity & Visual Designer',
    category: 'desain',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
    bio: 'Desainer grafis spesialis identitas visual dan kemasan produk untuk UMKM & brand kekinian. Berpengalaman mengubah bisnis biasa menjadi brand yang berkarakter, estetik, dan menonjol di feed media sosial maupun marketplace.',
    city: 'Yogyakarta',
    fullAddress: 'Jl. Kaliurang KM 6.5 No. 19, Sinduadi, Mlati, Sleman, D.I. Yogyakarta 55284',
    whatsapp: '6287839210044',
    instagram: '@nabilaz.design',
    portfolioUrl: 'https://instagram.com/alifmurti_28',
    startingPrice: 600000,
    priceUnit: 'proyek',
    pricePackages: [
      {
        id: 'pkg-3-1',
        name: 'Starter Logo & Color Palette',
        price: 600000,
        unit: 'proyek',
        description: 'Paket esensial bagi bisnis baru yang membutuhkan logo simpel, modern, dan profesional.',
        features: [
          '2 konsep logo alternatif',
          'Penentuan warna palet & font pairing',
          'File vector AI, SVG, PNG transparan & PDF',
          'Format avatar Instagram & Favicon',
          'Revisi desain hingga 3x'
        ]
      },
      {
        id: 'pkg-3-2',
        name: 'Full Brand Guidelines + Packaging',
        price: 1850000,
        unit: 'proyek',
        description: 'Solusi lengkap brand identity: logo, kemasan pouch/box/cup, dan buku panduan brand.',
        features: [
          '3 konsep logo matang + variasi submark',
          'Desain kemasan produk (label/cup/box) siap cetak',
          'Brand Book PDF (aturan logo, tipografi, dos & donts)',
          'Template feed & story Instagram (Canva/Figma)',
          'Konsultasi materi cetak ke percetakan'
        ],
        popular: true
      },
      {
        id: 'pkg-3-3',
        name: 'UI/UX Design Mobile & Web App',
        price: 3800000,
        unit: 'up to 8 screen',
        description: 'Desain antarmuka aplikasi atau website modern siap didevelop di Figma.',
        features: [
          'Wireframing & user flow',
          'Desain visual high-fidelity di Figma',
          'Design System (komponen, button, varian)',
          'Interactive clickable prototype',
          'Asset handoff untuk developer'
        ]
      }
    ],
    workOutputs: [
      {
        id: 'wo-3-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
        title: 'Brand Identity Coffee Roastery Jogja',
        description: 'Sistem visual logo, tipografi etnik modern, dan desain stiker kemasan biji kopi.'
      },
      {
        id: 'wo-3-2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80',
        title: 'Packaging Design Skincare Lokal',
        description: 'Desain botol serum dan kardus kemasan dengan finishing foil emas ramah lingkungan.'
      }
    ],
    rating: 4.88,
    reviewCount: 31,
    reviews: [
      {
        id: 'rev-5',
        author: 'Aris Wicaksono',
        rating: 5,
        date: '12 Sep 2026',
        comment: 'Mbak Nabila sangat mendengarkan kemauan klien. Filosofi desain logonya dalam dan pas untuk kopi kami.',
        clientType: 'Co-founder Coffee Shop'
      }
    ],
    verified: true,
    featured: false,
    status: 'active',
    submittedAt: '2026-08-22',
    whatsappClicks: 94,
    viewsCount: 840
  },
  {
    id: 'wk-4',
    name: 'Dimas Ardiansyah',
    businessName: 'Kopi Bar Kelana',
    title: 'Professional Barista & Event Coffee Bar Pop-Up',
    category: 'barista',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    coverImage: '/src/assets/images/portfolio_coffee_craft_1790780527152.jpg',
    bio: 'Barista bersertifikat SCA dengan pengalaman lebih dari 5 tahun di specialty coffee. Melayani penyewaan pop-up coffee bar lengkap dengan mesin espresso komersial, barista berpengalaman, dan biji kopi grade specialty untuk wedding, gathering kantor, hingga pameran seni.',
    city: 'Jakarta Selatan',
    fullAddress: 'Jl. Cipete Raya No. 15, Cilandak, Jakarta Selatan 12410',
    whatsapp: '6281318992233',
    instagram: '@kopibarkelana',
    portfolioUrl: 'https://instagram.com/alifmurti_28',
    startingPrice: 1500000,
    priceUnit: 'acara (50 cup)',
    pricePackages: [
      {
        id: 'pkg-4-1',
        name: 'Micro Gathering (50 Cups)',
        price: 1500000,
        unit: 'event (3 jam)',
        description: 'Cocok untuk arisan, perayaan ulang tahun, atau sesi workshop privat.',
        features: [
          '50 cups espresso-based drinks & mocktail',
          '1 barista profesional on duty',
          'Peralatan lengkap & cup branding custom',
          'Menu: Latte, Americano, Kopi Susu Aren, Matcha',
          'Durasi stand-by 3 jam'
        ]
      },
      {
        id: 'pkg-4-2',
        name: 'Wedding & Corporate Pop-Up (150 Cups)',
        price: 3800000,
        unit: 'event (5 jam)',
        description: 'Setup bar estetik kayu minimalis dengan pelayanan cepat untuk tamu acara besar.',
        features: [
          '150 cups kopi specialty & signature non-coffee',
          '2 barista berseragam rapi',
          'Mesin espresso La Marzocco / Nouva Simonelli',
          'Custom cup sleeve dengan nama pengantin / logo kantor',
          'Free sirup artisan & oat milk options'
        ],
        popular: true
      },
      {
        id: 'pkg-4-3',
        name: 'Pelatihan / Workshop Kalibrasi Kopi',
        price: 900000,
        unit: 'sesi privat (4 jam)',
        description: 'Mentoring privat untuk calon barista atau pemilik kafe baru yang ingin menguasai ekstraksi & steaming milk.',
        features: [
          'Materi sensory & kalibrasi espresso',
          'Teknik latte art dasar hingga advance',
          'Pemahaman grinder & rasio seduh',
          'Modul cetak & sertifikat kehadiran'
        ]
      }
    ],
    workOutputs: [
      {
        id: 'wo-4-1',
        type: 'image',
        url: '/src/assets/images/portfolio_coffee_craft_1790780527152.jpg',
        title: 'Manual Brew & Specialty Bar Setup',
        description: 'Bar seduh estetik dengan concrete finish pada event pameran seni di Jakarta.'
      },
      {
        id: 'wo-4-2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
        title: 'Wedding Outdoor Coffee Corner',
        description: 'Penyajian 200 cup kopi susu gula aren dengan live barista di kebun terbuka.'
      }
    ],
    rating: 4.98,
    reviewCount: 52,
    reviews: [
      {
        id: 'rev-6',
        author: 'Larasati Putri',
        rating: 5,
        date: '28 Sep 2026',
        comment: 'Kopinya beneran enak standar cafe specialty! Tamu pernikahan kami banyak yang antre dan puji pelayanannya cepat.',
        clientType: 'Klien Pernikahan'
      }
    ],
    verified: true,
    featured: true,
    status: 'active',
    submittedAt: '2026-06-18',
    whatsappClicks: 320,
    viewsCount: 2890
  },
  {
    id: 'wk-5',
    name: 'Clara Meisya',
    businessName: 'Clara MUA & Beauty Styling',
    title: 'Professional Makeup Artist & Hijab Stylist',
    category: 'mua',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
    bio: 'MUA berpengalaman menangani riasan flawless, natural glowing, hingga glamor untuk wisuda, prewedding, engagement, dan photoshoot fashion. Menggunakan produk makeup premium higienis yang tahan hingga 12 jam tanpa cakey.',
    city: 'Surabaya',
    fullAddress: 'Jl. Manyar Kertoarjo No. 88, Mulyorejo, Surabaya 60115',
    whatsapp: '6281903445511',
    instagram: '@clarameisya.makeup',
    portfolioUrl: 'https://instagram.com/alifmurti_28',
    startingPrice: 400000,
    priceUnit: 'orang',
    pricePackages: [
      {
        id: 'pkg-5-1',
        name: 'Makeup Wisuda & Event Spesial',
        price: 450000,
        unit: 'per orang',
        description: 'Makeup natural flawless tahan keringat seharian + styling hijab atau hair-do modern.',
        features: [
          'Ketahanan makeup up to 12 jam',
          'Termasuk bulu mata palsu premium & softlens assistance',
          'Hairdo / Hijab do rapi & elegan',
          'Touch-up kit (lip sample & blotting paper)',
          'Bisa datang ke lokasi (area Surabaya)'
        ],
        popular: true
      },
      {
        id: 'pkg-5-2',
        name: 'Prewedding & Engagement Makeup',
        price: 1300000,
        unit: 'sesi',
        description: 'Riasan detail bernuansa warm/romantis dengan standby touch up selama photoshoot.',
        features: [
          'Makeup bride + grooming groom',
          '2x ganti look hairdo/hijab',
          'Standby touch up di lokasi hingga 4 jam',
          'Produk high-end (Dior, MAC, Make Over)'
        ]
      }
    ],
    workOutputs: [
      {
        id: 'wo-5-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
        title: 'Natural Glowing Graduation Look',
        description: 'Makeup flawless dengan complexion dewy dan soft pink nude lips.'
      },
      {
        id: 'wo-5-2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
        title: 'Engagement Hijab Styling & Glam Soft Look',
        description: 'Riasan mata shimmer lembut dipadukan hijab do pashmina silk anggun.'
      }
    ],
    rating: 4.92,
    reviewCount: 29,
    reviews: [
      {
        id: 'rev-7',
        author: 'Siti Rahmawati',
        rating: 5,
        date: '05 Sep 2026',
        comment: 'Makeup wisuda dari jam 5 pagi tetap nempel glowing sampai sore! Nggak retak sama sekali walau kena panas.',
        clientType: 'Wisudawati UNAIR'
      }
    ],
    verified: true,
    featured: false,
    status: 'active',
    submittedAt: '2026-08-01',
    whatsappClicks: 118,
    viewsCount: 1100
  },
  {
    id: 'wk-6',
    name: 'Andra Developer',
    businessName: 'BitCraft Digital',
    title: 'Full-Stack Web Developer & Landing Page Specialist',
    category: 'tech',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    bio: 'Software engineer spesialis pembuatan landing page konversi tinggi, website company profile, dan web app toko online cepat & responsif. Tech stack: React, Next.js, Tailwind CSS, TypeScript, dan integrasi WhatsApp checkout.',
    city: 'Jakarta Barat',
    fullAddress: 'Jl. Tanjung Duren Raya No. 5, Grogol Petamburan, Jakarta Barat 11470',
    whatsapp: '628118820019',
    instagram: '@andrabitcraft',
    portfolioUrl: 'https://instagram.com/alifmurti_28',
    startingPrice: 1200000,
    priceUnit: 'website',
    pricePackages: [
      {
        id: 'pkg-6-1',
        name: 'High-Converting Landing Page',
        price: 1200000,
        unit: 'halaman tunggal',
        description: 'Website satu halaman interaktif dengan integrasi langsung tombol WhatsApp dan analitik.',
        features: [
          'Desain kustom responsif mobile & desktop',
          'Kecepatan loading < 1.5 detik',
          'Tombol order langsung terhubung WhatsApp',
          'Gratis domain .com & hosting 1 tahun',
          'Setup SEO Google & Google Analytics'
        ],
        popular: true
      },
      {
        id: 'pkg-6-2',
        name: 'Company Profile & Web Bisnis Lengkap',
        price: 2900000,
        unit: 'up to 6 halaman',
        description: 'Solusi website profesional untuk kredibilitas perusahaan dan showcase portofolio bisnis.',
        features: [
          'Halaman Home, Tentang Kami, Layanan, Portofolio, Kontak',
          'CMS mudah digunakan untuk update artikel & produk',
          'Formulir inquiry terkirim ke WhatsApp & Email',
          'Keamanan SSL & proteksi spam',
          'Tutorial pengelolaan web secara tatap muka / zoom'
        ]
      }
    ],
    workOutputs: [
      {
        id: 'wo-6-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
        title: 'E-Commerce Skincare Modern',
        description: 'Toko online berkecepatan tinggi dengan sistem katalog filter dan direct WA checkout.'
      },
      {
        id: 'wo-6-2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        title: 'Company Profile Arsitektur & Sipil',
        description: 'Website portofolio arsitek interaktif dengan galeri visual 3D render.'
      }
    ],
    rating: 4.96,
    reviewCount: 36,
    reviews: [
      {
        id: 'rev-8',
        author: 'Rahmat Hidayat',
        rating: 5,
        date: '19 Sep 2026',
        comment: 'Proses pengerjaan cepat cuma 3 hari selesai! Loading web kencang dan customer yang chat WhatsApp naik drastis.',
        clientType: 'Owner Toko Sepatu'
      }
    ],
    verified: true,
    featured: false,
    status: 'active',
    submittedAt: '2026-07-20',
    whatsappClicks: 189,
    viewsCount: 1650
  },
  {
    id: 'wk-7',
    name: 'Mas Bayu Tekno',
    businessName: 'Dokter Gadget & Laptop Express',
    title: 'Teknisi Handal Reparasi Laptop, MacBook & iPhone',
    category: 'elektronik',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80',
    bio: 'Teknisi elektronik berpengalaman 8 tahun spesialis ganti baterai, perbaikan logicboard motherboard, upgrade SSD/RAM, pembersihan thermal paste, dan masalah mati total. Transparan dalam estimasi harga sparepart & ada garansi service hingga 90 hari.',
    city: 'Tangerang Selatan',
    fullAddress: 'Ruko Bintaro Sektor 9 Blok E-11, Pondok Aren, Tangerang Selatan 15229',
    whatsapp: '6285811776655',
    instagram: '@doktergadget.bintaro',
    portfolioUrl: 'https://instagram.com/alifmurti_28',
    startingPrice: 150000,
    priceUnit: 'jasa perbaikan',
    pricePackages: [
      {
        id: 'pkg-7-1',
        name: 'Deep Cleaning & Repaste Laptop Panas',
        price: 150000,
        unit: 'unit laptop',
        description: 'Pembersihan kipas debu tebal dan penggantian thermal paste premium Arctic MX-4 agar laptop dingin & lancar.',
        features: [
          'Pembersihan menyeluruh debu sirkulasi pendingin',
          'Penggantian thermal paste Arctic MX-4 / Thermal Grizzly',
          'Pengecekan kesehatan harddisk & suhu prosesor',
          'Bisa ditunggu (durasi pengerjaan ~45 menit)',
          'Garansi pengerjaan 1 bulan'
        ],
        popular: true
      },
      {
        id: 'pkg-7-2',
        name: 'Ganti Baterai & Layar LCD iPhone / MacBook',
        price: 350000,
        unit: 'ongkos pasang + part',
        description: 'Pemasangan part grade original dengan segel anti-air rapi dan kalibrasi sistem.',
        features: [
          'Part original equipment manufacturer (OEM)',
          'Pengecekan cycle count baterai di depan customer',
          'Pemasangan rapi tidak merusak casing',
          'Garansi penggantian part 3 bulan'
        ]
      }
    ],
    workOutputs: [
      {
        id: 'wo-7-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80',
        title: 'Micro-Soldering Logicboard Repair',
        description: 'Perbaikan jalur korsleting MacBook yang terkena tumpahan air menggunakan mikroskop stereo.'
      }
    ],
    rating: 4.9,
    reviewCount: 41,
    reviews: [
      {
        id: 'rev-9',
        author: 'Farhan Maulana',
        rating: 5,
        date: '21 Sep 2026',
        comment: 'Jujur banget! Di tempat lain disuruh ganti mesin jutaan rupiah, sama Mas Bayu cuma dibersihin IC powernya laptop nyala lagi normal.',
        clientType: 'Mahasiswa'
      }
    ],
    verified: true,
    featured: false,
    status: 'active',
    submittedAt: '2026-08-14',
    whatsappClicks: 167,
    viewsCount: 1430
  },
  {
    id: 'wk-8',
    name: 'Genta Studio Audio',
    businessName: 'Genta Sound & Scoring',
    title: 'Music Producer, Voice Over & Mixing-Mastering',
    category: 'musik',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
    bio: 'Produser musik dan audio engineer berbasis di Bandung. Menangani pembuatan jingle iklan brand, aransemen lagu pop/indie, voice over profesional dwi-bahasa (Indonesia & Inggris), serta audio post-production untuk film pendek dan podcast.',
    city: 'Bandung',
    fullAddress: 'Jl. Riau No. 102, Cihapit, Bandung Wetan, Bandung 40114',
    whatsapp: '6281223400998',
    instagram: '@gentasound.id',
    portfolioUrl: 'https://instagram.com/alifmurti_28',
    startingPrice: 500000,
    priceUnit: 'track',
    pricePackages: [
      {
        id: 'pkg-8-1',
        name: 'Mixing & Mastering 1 Track',
        price: 500000,
        unit: 'per lagu (up to 32 stems)',
        description: 'Proses balance vokal, instrumen, equalizer, dan kompresi standar radio & Spotify streaming level.',
        features: [
          'Stereo mixing & analog emulation mastering',
          'Format WAV 24-bit 48kHz + MP3 320kbps',
          'Vocal tuning & timing alignment rapi',
          'Loudness standar Spotify/Apple Music (-14 LUFS)',
          'Revisi hingga 3x'
        ],
        popular: true
      },
      {
        id: 'pkg-8-2',
        name: 'Custom Jingle Iklan / Podcast Soundscape',
        price: 1800000,
        unit: 'audio 30-60 detik',
        description: 'Pembuatan musik orisinal catchy untuk promosi brand di radio, TikTok, YouTube, atau event.',
        features: [
          'Komposisi nada original bebas copyright strike',
          'Termasuk 1 voice over talent profesional',
          'Versi cutdown: 60s, 30s, dan 15s bumper',
          'Hak guna komersial penuh seumur hidup'
        ]
      }
    ],
    workOutputs: [
      {
        id: 'wo-8-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
        title: 'Studio Rekaman Akustik & Monitoring',
        description: 'Setup mixing dengan monitor Yamaha HS8 dan preamp analog warm tone.'
      }
    ],
    rating: 4.93,
    reviewCount: 22,
    reviews: [
      {
        id: 'rev-10',
        author: 'Dito Pratama',
        rating: 5,
        date: '14 Agu 2026',
        comment: 'Lagu band kami jadi jauh lebih bertenaga dan jernih setelah dimixing di Genta Studio!',
        clientType: 'Musisi Indie'
      }
    ],
    verified: true,
    featured: false,
    status: 'active',
    submittedAt: '2026-08-05',
    whatsappClicks: 82,
    viewsCount: 710
  },
  {
    id: 'wk-9',
    name: 'Chef Danang Pratama',
    businessName: 'Dapur Rasa Nusantara Catering',
    title: 'Catering Prasmanan, Nasi Box Event & Private Chef',
    category: 'kuliner',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80',
    coverImage: '/src/assets/images/portfolio_kuliner_catering_1790782679657.jpg',
    bio: 'Penyedia jasa boga dan katering berstandar higienis tinggi dengan cita rasa Nusantara modern. Melayani acara lamaran, pernikahan, gathering kantor, seminar kampus, hingga private dining. Menggunakan bahan segar lokal tanpa pengawet dengan plating berkelas.',
    city: 'Bandung',
    fullAddress: 'Jl. Riau No. 108, Cihapit, Kec. Bandung Wetan, Kota Bandung, Jawa Barat 40114',
    whatsapp: '6281321456789',
    instagram: '@dapurrasa.catering',
    portfolioUrl: 'https://instagram.com/alifmurti_28',
    startingPrice: 38000,
    priceUnit: 'porsi',
    pricePackages: [
      {
        id: 'pkg-9-1',
        name: 'Nasi Box Premium Nusantara',
        price: 38000,
        unit: 'porsi (min. 25 pax)',
        description: 'Paket box higienis eksklusif untuk rapat kantor, syukuran, seminar, atau arisan keluarga.',
        features: [
          'Nasi daun jeruk / nasi liwet wangi',
          'Ayam bakar madu / empal balado serundeng',
          'Tumis buncis jagung manis / capcay',
          'Sambal terasi segar & kerupuk udang',
          'Buah potong, air mineral, kemasan ramah lingkungan'
        ]
      },
      {
        id: 'pkg-9-2',
        name: 'Prasmanan / Buffet Event & Wedding',
        price: 95000,
        unit: 'porsi (min. 50 pax)',
        description: 'Layanan buffet komplit dengan peralatan saji mewah, dekorasi meja saji, dan pelayan profesional.',
        features: [
          'Pilihan 6 menu utama + 2 sup pilihan',
          'Dessert corner: puding buah & es podeng kelapa',
          'Peralatan roll top chafing dish & meja dekorasi',
          '2 orang staf pelayan siap sedia selama acara',
          'Gratis tester food tasting untuk 4 orang'
        ],
        popular: true
      },
      {
        id: 'pkg-9-3',
        name: 'Tumpeng Mini & Tampah Hantaran',
        price: 450000,
        unit: 'tampah (porsi 8-10 orang)',
        description: 'Tumpeng kuning estetis untuk peresmian kantor, ulang tahun, atau hantaran spesial.',
        features: [
          'Tumpeng kuning pulen gurih rempah alami',
          '7 macam lauk pelengkap tradisional lengkap',
          'Hiasan ukiran sayur & garnish artistik',
          'Kemasan tampah anyaman bambu dengan pita branding'
        ]
      }
    ],
    workOutputs: [
      {
        id: 'wo-9-1',
        type: 'image',
        url: '/src/assets/images/portfolio_kuliner_catering_1790782679657.jpg',
        title: 'Meja Saji Prasmanan Event Eksklusif',
        description: 'Buffet prasmanan dengan penataan food styling modern dan bunga segar.'
      },
      {
        id: 'wo-9-2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
        title: 'Nasi Box Premium Corporate Gathering',
        description: 'Kemasan box ecopack ramah lingkungan dengan sekat higienis.'
      }
    ],
    rating: 4.96,
    reviewCount: 47,
    reviews: [
      {
        id: 'rev-9-1',
        author: 'Jessica Hartono',
        rating: 5,
        date: '18 Sep 2026',
        comment: 'Pesan 120 porsi prasmanan untuk gathering kantor di Bandung. Rasanya sangat gurih, ayam bakarnya meresap, dan timnya rapi sekali!',
        clientType: 'HR Manager'
      },
      {
        id: 'rev-9-2',
        author: 'Bagas Aditya',
        rating: 5,
        date: '02 Sep 2026',
        comment: 'Tumpeng tampahnya sangat estetik dan fotoable! Tamu-tamu pada puji rasa rendang dan sambal goreng hatinya.',
        clientType: 'Keluarga'
      }
    ],
    verified: true,
    featured: true,
    status: 'active',
    submittedAt: '2026-08-10',
    whatsappClicks: 164,
    viewsCount: 1420
  },
  {
    id: 'wk-10',
    name: 'Nadya Salsabila',
    businessName: 'Atelier Sweet & Pastry',
    title: 'Custom Cake Designer, Pastry & Dessert Table',
    category: 'kuliner',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    coverImage: '/src/assets/images/portfolio_kuliner_pastry_1790782693055.jpg',
    bio: 'Pastry chef bersertifikat dengan fokus pembuatan kue ulang tahun custom artisan, dessert table pesta, dan canape pastry manis/gurih. Menggunakan butter New Zealand kualitas premium, rasa seimbang tidak bikin enek, dan dekorasi visual yang chic.',
    city: 'Jakarta Selatan',
    fullAddress: 'Jl. Senopati Dalam II No. 15, Kebayoran Baru, Jakarta Selatan 12190',
    whatsapp: '6281287654321',
    instagram: '@ateliersweet.id',
    portfolioUrl: 'https://instagram.com/alifmurti_28',
    startingPrice: 350000,
    priceUnit: 'kue',
    pricePackages: [
      {
        id: 'pkg-10-1',
        name: 'Signature Bento & Mini Custom Cake',
        price: 350000,
        unit: 'cake diameter 12-16cm',
        description: 'Kue custom Korea / vintage aesthetic mini dengan desain bebas sesuai referensi.',
        features: [
          'Pilihan sponge: Earl Grey, Belgian Chocolate, atau Red Velvet',
          'Fresh cream filling (less sweet)',
          'Desain lettering dan dekorasi warna custom',
          'Sudah termasuk lilin aesthetic dan pisau kue'
        ]
      },
      {
        id: 'pkg-10-2',
        name: 'Dessert Table & Sweet Corner Package',
        price: 2500000,
        unit: 'paket untuk 50 pax',
        description: 'Dekorasi sudut manis untuk lamaran, bridal shower, atau pesta ulang tahun anak/dewasa.',
        features: [
          '50 pcs mini fruit tartlets & cream choux',
          '35 pcs chocolate truffle cake pop',
          '1 tier main celebration cake diameter 20cm',
          'Tier stand akrilik, piring saji gold & props dekorasi'
        ],
        popular: true
      }
    ],
    workOutputs: [
      {
        id: 'wo-10-1',
        type: 'image',
        url: '/src/assets/images/portfolio_kuliner_pastry_1790782693055.jpg',
        title: 'Setup Display Pastry & Sweet Corner',
        description: 'Meja dessert bergaya Perancis modern dengan tartlet buah dan choux au craquelin.'
      },
      {
        id: 'wo-10-2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
        title: 'Artisan Birthday Cake Floral Styling',
        description: 'Kue 2 tingkat dengan sentuhan edible flowers dan tekstur buttercream abstrak.'
      }
    ],
    rating: 4.98,
    reviewCount: 39,
    reviews: [
      {
        id: 'rev-10-1',
        author: 'Clarissa Amanda',
        rating: 5,
        date: '22 Sep 2026',
        comment: 'Kue ulang tahunnya cantik banget persis referensi Pinterest, dan rasanya enak banget gak kemanisan!',
        clientType: 'Private Client'
      }
    ],
    verified: true,
    featured: false,
    status: 'active',
    submittedAt: '2026-08-18',
    whatsappClicks: 118,
    viewsCount: 1045
  }
];
