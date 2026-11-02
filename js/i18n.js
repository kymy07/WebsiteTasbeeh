// Dwibahasa: Bahasa Melayu (ms) & English (en)
const I18N = {
  ms: {
    appName: 'Tasbeeh Fish Farm',
    tagline: 'Sistem pengurusan kolam & jualan ikan',
    heroTitle: 'Urus kolam ikan anda dengan mudah & teratur',
    heroText: 'Rekod jumlah ikan setiap kolam, pantau kualiti air, urus pekerja dan terima tempahan pembeli terus ke WhatsApp anda.',
    login: 'Log Masuk', logout: 'Log Keluar', username: 'Nama pengguna', password: 'Kata laluan',
    loginAs: 'Log masuk sebagai', boss: 'Boss', worker: 'Pekerja', buyer: 'Pembeli',
    welcome: 'Selamat kembali', loginSub: 'Pilih peranan anda dan log masuk.',
    demo: 'Akaun demo', noAccount: 'Belum ada akaun pembeli?', register: 'Daftar', haveAccount: 'Sudah ada akaun?',
    fullName: 'Nama penuh', phone: 'No. telefon', invalidLogin: 'Nama pengguna / kata laluan / peranan salah',
    registered: 'Akaun berjaya didaftar', usernameTaken: 'Nama pengguna sudah digunakan',

    // nav
    dashboard: 'Papan Pemuka', pools: 'Kolam Ikan', stock: 'Rekod Stok', water: 'Kualiti Air', feeding: 'Pemberian Makanan',
    tasks: 'Tugasan', orders: 'Tempahan', reports: 'Laporan', users: 'Pengguna', settings: 'Tetapan',
    shop: 'Kedai Ikan', myOrders: 'Tempahan Saya', manage: 'Pengurusan', operations: 'Operasi', sales: 'Jualan',

    // dashboard
    totalPools: 'Jumlah Kolam', totalFish: 'Jumlah Ikan', pendingOrders: 'Tempahan Baru', revenue: 'Jualan (Bulan Ini)',
    fishPerPool: 'Ikan mengikut kolam', sales7: 'Jualan 7 hari', recentActivity: 'Aktiviti terkini', alerts: 'Amaran',
    noAlerts: 'Semua kolam dalam keadaan baik 👍', activePools: 'kolam aktif', ekor: 'ekor',
    lowWater: 'Kualiti air luar julat', nearCapacity: 'Hampir penuh', lowStock: 'Stok rendah', myTasksToday: 'Tugasan saya',
    viewAll: 'Lihat semua', today: 'Hari ini',

    // pools
    addPool: 'Tambah Kolam', editPool: 'Kemaskini Kolam', poolName: 'Nama kolam', species: 'Spesis ikan', fishCount: 'Bilangan ikan',
    capacity: 'Kapasiti', pricePerFish: 'Harga seunit (RM)', unit: 'Unit', perFish: 'seekor', perKg: 'sekilo', avgWeight: 'Purata berat (kg)',
    status: 'Status', active: 'Aktif', maintenance: 'Penyelenggaraan', empty: 'Kosong', forSale: 'Dijual kepada pembeli',
    yes: 'Ya', no: 'Tidak', save: 'Simpan', cancel: 'Batal', delete: 'Padam', edit: 'Edit', confirmDelete: 'Padam rekod ini?',
    search: 'Cari...', all: 'Semua', stockIn: 'Stok Masuk', stockOut: 'Stok Keluar', mortality: 'Kematian', transfer: 'Pindah',
    lastWater: 'Air terakhir', notRecorded: 'Belum direkod', saved: 'Berjaya disimpan', deleted: 'Rekod dipadam',
    harvestDate: 'Jangka tuai', stockedDate: 'Tarikh masuk benih', notes: 'Catatan', full: 'penuh',

    // stock
    recordStock: 'Rekod Pergerakan Stok', type: 'Jenis', quantity: 'Kuantiti', pool: 'Kolam', date: 'Tarikh', by: 'Oleh',
    sale: 'Jualan', toPool: 'Ke kolam', notEnough: 'Stok tidak mencukupi', overCapacity: 'Melebihi kapasiti kolam',
    reason: 'Sebab / catatan',

    // water
    recordWater: 'Rekod Kualiti Air', temp: 'Suhu (°C)', ph: 'pH', oxygen: 'Oksigen (mg/L)', ammonia: 'Ammonia (ppm)',
    safeRange: 'Julat selamat: pH 6.5–8.5 · Suhu 24–32°C · DO ≥ 5 mg/L · Ammonia ≤ 0.5',
    outOfRange: 'Luar julat',

    // feeding
    recordFeeding: 'Rekod Pemberian Makanan', feedType: 'Jenis makanan', amountKg: 'Jumlah (kg)', time: 'Masa',
    feedToday: 'Makanan hari ini', feedSchedule: 'Jadual makan: 8:00 pagi & 5:00 petang',

    // tasks
    addTask: 'Tambah Tugasan', taskTitle: 'Tugasan', assignTo: 'Tugaskan kepada', dueDate: 'Tarikh akhir', done: 'Selesai',
    pending: 'Belum selesai', priority: 'Keutamaan', high: 'Tinggi', normal: 'Biasa', low: 'Rendah',

    // orders
    orderNo: 'No. Tempahan', customer: 'Pelanggan', items: 'Item', total: 'Jumlah', action: 'Tindakan',
    st_pending: 'Baru', st_confirmed: 'Disahkan', st_ready: 'Sedia', st_completed: 'Selesai', st_cancelled: 'Dibatalkan',
    confirm: 'Sahkan', markReady: 'Tanda Sedia', complete: 'Selesai', cancelOrder: 'Batal', notifyBuyer: 'WhatsApp Pembeli',
    pickup: 'Ambil sendiri', delivery: 'Penghantaran', method: 'Kaedah', address: 'Alamat', pickupDate: 'Tarikh ambil/hantar',
    orderPlaced: 'Tempahan berjaya dihantar! Boss telah dimaklumkan.', noOrders: 'Tiada tempahan lagi',

    // shop
    shopTitle: 'Ikan segar terus dari kolam kami', shopText: 'Pilih ikan, masukkan kuantiti dan buat tempahan. Kami akan hubungi anda melalui WhatsApp.',
    available: 'Tersedia', addToCart: 'Tambah ke Troli', cart: 'Troli', checkout: 'Buat Tempahan', cartEmpty: 'Troli kosong',
    added: 'Ditambah ke troli', placeOrder: 'Hantar Tempahan', soldOut: 'Habis',

    // reports
    exportCsv: 'Eksport CSV', period: 'Tempoh', thisMonth: 'Bulan ini', last30: '30 hari', allTime: 'Semua masa',
    totalSold: 'Ikan dijual', totalMortality: 'Kematian', mortalityRate: 'Kadar kematian', feedUsed: 'Makanan digunakan',
    bySpecies: 'Jualan mengikut spesis', printReport: 'Cetak',

    // users
    addUser: 'Tambah Pengguna', role: 'Peranan', cantDeleteSelf: 'Tidak boleh padam akaun sendiri',

    // settings
    notifSettings: 'Notifikasi Automatik', notifText: 'Bila pembeli buat tempahan, sistem akan hantar notifikasi ke nombor anda secara automatik.',
    bossPhone: 'No. WhatsApp Boss (cth: 60123456789)', callmebotKey: 'CallMeBot API Key (WhatsApp automatik)',
    telegramToken: 'Telegram Bot Token', telegramChat: 'Telegram Chat ID', testNotif: 'Uji Notifikasi',
    howTo: 'Cara aktifkan', businessInfo: 'Maklumat Perniagaan', businessName: 'Nama perniagaan', location: 'Lokasi kolam',
    dataMgmt: 'Pengurusan Data', backup: 'Muat turun backup', restore: 'Pulih backup', resetDemo: 'Reset data demo',
    resetConfirm: 'Semua data akan dipadam dan diganti dengan data demo. Teruskan?', lowStockLevel: 'Paras stok rendah (ekor)',
    notifications: 'Notifikasi', markRead: 'Tanda dibaca', noNotif: 'Tiada notifikasi', newOrderNotif: 'Tempahan baru',
    sentAuto: 'Notifikasi dihantar automatik', openWa: 'Buka WhatsApp', notifSentTo: 'Dihantar ke',
    profile: 'Profil', language: 'Bahasa',
  },
  en: {
    appName: 'Tasbeeh Fish Farm',
    tagline: 'Fish pond & sales management system',
    heroTitle: 'Manage your fish ponds simply & neatly',
    heroText: 'Record fish count in every pond, monitor water quality, manage workers and receive buyer orders straight to your WhatsApp.',
    login: 'Log In', logout: 'Log Out', username: 'Username', password: 'Password',
    loginAs: 'Log in as', boss: 'Boss', worker: 'Worker', buyer: 'Buyer',
    welcome: 'Welcome back', loginSub: 'Choose your role and sign in.',
    demo: 'Demo accounts', noAccount: "Don't have a buyer account?", register: 'Register', haveAccount: 'Already have an account?',
    fullName: 'Full name', phone: 'Phone no.', invalidLogin: 'Wrong username / password / role',
    registered: 'Account registered', usernameTaken: 'Username already taken',

    dashboard: 'Dashboard', pools: 'Fish Ponds', stock: 'Stock Records', water: 'Water Quality', feeding: 'Feeding',
    tasks: 'Tasks', orders: 'Orders', reports: 'Reports', users: 'Users', settings: 'Settings',
    shop: 'Fish Shop', myOrders: 'My Orders', manage: 'Management', operations: 'Operations', sales: 'Sales',

    totalPools: 'Total Ponds', totalFish: 'Total Fish', pendingOrders: 'New Orders', revenue: 'Sales (This Month)',
    fishPerPool: 'Fish per pond', sales7: 'Sales last 7 days', recentActivity: 'Recent activity', alerts: 'Alerts',
    noAlerts: 'All ponds are in good condition 👍', activePools: 'active ponds', ekor: 'fish',
    lowWater: 'Water quality out of range', nearCapacity: 'Near capacity', lowStock: 'Low stock', myTasksToday: 'My tasks',
    viewAll: 'View all', today: 'Today',

    addPool: 'Add Pond', editPool: 'Edit Pond', poolName: 'Pond name', species: 'Fish species', fishCount: 'Fish count',
    capacity: 'Capacity', pricePerFish: 'Unit price (RM)', unit: 'Unit', perFish: 'per fish', perKg: 'per kg', avgWeight: 'Avg. weight (kg)',
    status: 'Status', active: 'Active', maintenance: 'Maintenance', empty: 'Empty', forSale: 'Available to buyers',
    yes: 'Yes', no: 'No', save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit', confirmDelete: 'Delete this record?',
    search: 'Search...', all: 'All', stockIn: 'Stock In', stockOut: 'Stock Out', mortality: 'Mortality', transfer: 'Transfer',
    lastWater: 'Last water check', notRecorded: 'Not recorded', saved: 'Saved successfully', deleted: 'Record deleted',
    harvestDate: 'Expected harvest', stockedDate: 'Stocking date', notes: 'Notes', full: 'full',

    recordStock: 'Record Stock Movement', type: 'Type', quantity: 'Quantity', pool: 'Pond', date: 'Date', by: 'By',
    sale: 'Sale', toPool: 'To pond', notEnough: 'Not enough stock', overCapacity: 'Exceeds pond capacity',
    reason: 'Reason / notes',

    recordWater: 'Record Water Quality', temp: 'Temp (°C)', ph: 'pH', oxygen: 'Oxygen (mg/L)', ammonia: 'Ammonia (ppm)',
    safeRange: 'Safe range: pH 6.5–8.5 · Temp 24–32°C · DO ≥ 5 mg/L · Ammonia ≤ 0.5',
    outOfRange: 'Out of range',

    recordFeeding: 'Record Feeding', feedType: 'Feed type', amountKg: 'Amount (kg)', time: 'Time',
    feedToday: 'Feed today', feedSchedule: 'Feeding schedule: 8:00 AM & 5:00 PM',

    addTask: 'Add Task', taskTitle: 'Task', assignTo: 'Assign to', dueDate: 'Due date', done: 'Done',
    pending: 'Pending', priority: 'Priority', high: 'High', normal: 'Normal', low: 'Low',

    orderNo: 'Order No.', customer: 'Customer', items: 'Items', total: 'Total', action: 'Action',
    st_pending: 'New', st_confirmed: 'Confirmed', st_ready: 'Ready', st_completed: 'Completed', st_cancelled: 'Cancelled',
    confirm: 'Confirm', markReady: 'Mark Ready', complete: 'Complete', cancelOrder: 'Cancel', notifyBuyer: 'WhatsApp Buyer',
    pickup: 'Self pickup', delivery: 'Delivery', method: 'Method', address: 'Address', pickupDate: 'Pickup/delivery date',
    orderPlaced: 'Order placed! The boss has been notified.', noOrders: 'No orders yet',

    shopTitle: 'Fresh fish straight from our ponds', shopText: 'Choose your fish, enter quantity and place an order. We will contact you via WhatsApp.',
    available: 'Available', addToCart: 'Add to Cart', cart: 'Cart', checkout: 'Checkout', cartEmpty: 'Cart is empty',
    added: 'Added to cart', placeOrder: 'Place Order', soldOut: 'Sold out',

    exportCsv: 'Export CSV', period: 'Period', thisMonth: 'This month', last30: '30 days', allTime: 'All time',
    totalSold: 'Fish sold', totalMortality: 'Mortality', mortalityRate: 'Mortality rate', feedUsed: 'Feed used',
    bySpecies: 'Sales by species', printReport: 'Print',

    addUser: 'Add User', role: 'Role', cantDeleteSelf: 'You cannot delete your own account',

    notifSettings: 'Automatic Notifications', notifText: 'When a buyer places an order, the system automatically sends a notification to your number.',
    bossPhone: 'Boss WhatsApp no. (e.g. 60123456789)', callmebotKey: 'CallMeBot API Key (automatic WhatsApp)',
    telegramToken: 'Telegram Bot Token', telegramChat: 'Telegram Chat ID', testNotif: 'Test Notification',
    howTo: 'How to enable', businessInfo: 'Business Info', businessName: 'Business name', location: 'Pond location',
    dataMgmt: 'Data Management', backup: 'Download backup', restore: 'Restore backup', resetDemo: 'Reset demo data',
    resetConfirm: 'All data will be erased and replaced with demo data. Continue?', lowStockLevel: 'Low stock level (fish)',
    notifications: 'Notifications', markRead: 'Mark as read', noNotif: 'No notifications', newOrderNotif: 'New order',
    sentAuto: 'Notification sent automatically', openWa: 'Open WhatsApp', notifSentTo: 'Sent to',
    profile: 'Profile', language: 'Language',
  }
};

let LANG = localStorage.getItem('tasbeeh_lang') || 'ms';
function t(key) { return (I18N[LANG] && I18N[LANG][key]) || I18N.en[key] || key; }
function setLang(l) { LANG = l; localStorage.setItem('tasbeeh_lang', l); document.documentElement.lang = l; }
