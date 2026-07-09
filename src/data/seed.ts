// Seed data derived from ke-hoach-dam-cuoi-viet-dai.md.
// All display text is bilingual { vi, 'zh-TW' } so it switches with the UI language.
// Copy is kept concise and factual — no advisory / explanatory padding.

import type {
  BudgetGroup,
  BudgetItem,
  TaskItem,
  Vendor,
  Guest,
  DocumentItem,
} from '../types';

// ---------------------------------------------------------------------------
// PHẦN 1 — MASTER CHECKLIST (5 giai đoạn)
// ---------------------------------------------------------------------------

export const seedTasks: TaskItem[] = [
  // Giai đoạn 1
  {
    id: 'p1-1',
    phase: 'phase1',
    title: { vi: 'Khám sức khỏe tiền hôn nhân', 'zh-TW': '婚前健康檢查' },
    note: '',
    status: 'todo',
  },
  {
    id: 'p1-2',
    phase: 'phase1',
    title: { vi: 'Tìm hiểu thủ tục đăng ký kết hôn Việt–Đài', 'zh-TW': '了解台越結婚登記手續' },
    note: {
      vi: 'Xác nhận độc thân, hợp pháp hóa lãnh sự, dịch công chứng ở cả hai nước.',
      'zh-TW': '單身證明、領事認證、雙邊公證翻譯。',
    },
    status: 'todo',
  },
  {
    id: 'p1-3',
    phase: 'phase1',
    title: { vi: 'Mua nhẫn cầu hôn (Đài Loan)', 'zh-TW': '購買求婚戒指（台灣）' },
    note: '',
    status: 'todo',
  },
  {
    id: 'p1-4',
    phase: 'phase1',
    title: { vi: 'Xin báo giá đơn vị quay phóng sự cưới', 'zh-TW': '洽詢婚禮紀錄片報價' },
    note: '',
    status: 'todo',
  },
  {
    id: 'p1-5',
    phase: 'phase1',
    title: {
      vi: 'Chốt concept tiệc ngoài trời, khảo sát địa điểm sân vườn',
      'zh-TW': '確定戶外婚禮風格，勘察花園場地',
    },
    note: '',
    status: 'todo',
  },
  // Giai đoạn 2
  {
    id: 'p2-1',
    phase: 'phase2',
    title: { vi: 'Nộp hồ sơ đăng ký kết hôn', 'zh-TW': '遞交結婚登記文件' },
    note: '',
    status: 'todo',
  },
  {
    id: 'p2-2',
    phase: 'phase2',
    title: { vi: 'Chốt hợp đồng quay phóng sự/video cưới', 'zh-TW': '簽訂婚禮錄影合約' },
    note: '',
    status: 'todo',
  },
  {
    id: 'p2-3',
    phase: 'phase2',
    title: { vi: 'Chốt địa điểm tiệc, đặt cọc', 'zh-TW': '確定場地並付訂金' },
    note: '',
    status: 'todo',
  },
  {
    id: 'p2-4',
    phase: 'phase2',
    title: { vi: 'Đặt vé máy bay cho gia đình hai bên', 'zh-TW': '預訂雙方家人機票' },
    note: '',
    status: 'todo',
  },
  {
    id: 'p2-5',
    phase: 'phase2',
    title: { vi: 'Lên danh sách khách mời sơ bộ', 'zh-TW': '擬定初步賓客名單' },
    note: '',
    status: 'todo',
  },
  {
    id: 'p2-6',
    phase: 'phase2',
    title: { vi: 'Xin báo giá studio chụp ảnh cưới', 'zh-TW': '洽詢婚紗攝影棚報價' },
    note: '',
    status: 'todo',
  },
  {
    id: 'p2-7',
    phase: 'phase2',
    title: {
      vi: 'Chọn ngày đẹp tháng 7/2027, tránh tháng cô hồn',
      'zh-TW': '挑選 2027 年 7 月吉日，避開鬼月',
    },
    note: {
      vi: 'Nhờ gia đình Đài Loan kiểm tra lịch âm 2027.',
      'zh-TW': '請台灣家人確認 2027 農曆。',
    },
    status: 'todo',
  },
  // Giai đoạn 3
  {
    id: 'p3-1',
    phase: 'phase3',
    title: { vi: 'Chốt ngày cưới Đài Loan chính thức', 'zh-TW': '確定台灣婚禮正式日期' },
    note: '',
    status: 'todo',
  },
  {
    id: 'p3-2',
    phase: 'phase3',
    title: {
      vi: 'Thử trang phục cưới (áo dài, vest, váy cưới)',
      'zh-TW': '試穿禮服（奧黛、西裝、婚紗）',
    },
    note: '',
    status: 'todo',
  },
  {
    id: 'p3-3',
    phase: 'phase3',
    title: { vi: 'Chốt thực đơn tiệc', 'zh-TW': '確定婚宴菜單' },
    note: '',
    status: 'todo',
  },
  {
    id: 'p3-4',
    phase: 'phase3',
    title: { vi: 'Lên kế hoạch lễ gia tiên', 'zh-TW': '規劃祭祖儀式' },
    note: '',
    status: 'todo',
  },
  {
    id: 'p3-5',
    phase: 'phase3',
    title: {
      vi: 'Lên lịch trình 5 ngày tại Bình Dương (gia đình chú rể)',
      'zh-TW': '安排平陽 5 日行程（新郎家人）',
    },
    note: '',
    status: 'todo',
  },
  {
    id: 'p3-6',
    phase: 'phase3',
    title: {
      vi: 'Lên lịch trình 7 ngày tại Đài Nam (ba mẹ cô dâu)',
      'zh-TW': '安排台南 7 日行程（新娘父母）',
    },
    note: '',
    status: 'todo',
  },
  {
    id: 'p3-7',
    phase: 'phase3',
    title: {
      vi: 'Chuẩn bị vàng hồi môn, phong bì cho ba mẹ',
      'zh-TW': '準備嫁妝金飾、給父母的紅包',
    },
    note: '',
    status: 'todo',
  },
  // Giai đoạn 4
  {
    id: 'p4-1',
    phase: 'phase4',
    title: { vi: 'Chốt danh sách khách mời, gửi thiệp', 'zh-TW': '確定賓客名單並寄喜帖' },
    note: '',
    status: 'todo',
  },
  {
    id: 'p4-2',
    phase: 'phase4',
    title: { vi: 'Chụp ảnh cưới tại studio', 'zh-TW': '婚紗棚拍' },
    note: '',
    status: 'todo',
  },
  {
    id: 'p4-3',
    phase: 'phase4',
    title: { vi: 'Xác nhận toàn bộ vendor', 'zh-TW': '確認所有廠商' },
    note: {
      vi: 'Đồ ăn, âm thanh ánh sáng, MC, hoa trang trí.',
      'zh-TW': '餐飲、音響燈光、主持、花藝。',
    },
    status: 'todo',
  },
  {
    id: 'p4-4',
    phase: 'phase4',
    title: {
      vi: 'Xác nhận lịch trình, đặt nhà hàng cho hai gia đình',
      'zh-TW': '確認行程並預訂雙方家庭餐廳',
    },
    note: '',
    status: 'todo',
  },
  {
    id: 'p4-5',
    phase: 'phase4',
    title: { vi: 'Hoàn tất giấy tờ đăng ký kết hôn', 'zh-TW': '完成結婚登記文件' },
    note: '',
    status: 'todo',
  },
  {
    id: 'p4-6',
    phase: 'phase4',
    title: { vi: 'Rà soát ngân sách thực tế so với dự kiến', 'zh-TW': '核對實際與預計預算' },
    note: '',
    status: 'todo',
  },
  // Giai đoạn 5
  {
    id: 'p5-1',
    phase: 'phase5',
    title: { vi: 'Tổng duyệt lễ Vow', 'zh-TW': '婚禮儀式彩排' },
    note: '',
    status: 'todo',
  },
  {
    id: 'p5-2',
    phase: 'phase5',
    title: { vi: 'Xác nhận số bàn tiệc cuối cùng', 'zh-TW': '確認最終桌數' },
    note: '',
    status: 'todo',
  },
  {
    id: 'p5-3',
    phase: 'phase5',
    title: { vi: 'Đón gia đình hai bên', 'zh-TW': '接待雙方家人' },
    note: '',
    status: 'todo',
  },
  {
    id: 'p5-4',
    phase: 'phase5',
    title: { vi: 'Đám cưới Việt Nam · 12/06/2027', 'zh-TW': '越南婚禮｜2027/06/12' },
    note: '',
    status: 'todo',
  },
  {
    id: 'p5-5',
    phase: 'phase5',
    title: { vi: 'Chuẩn bị bay sang Đài Loan', 'zh-TW': '準備飛往台灣' },
    note: '',
    status: 'todo',
  },
  {
    id: 'p5-6',
    phase: 'phase5',
    title: { vi: 'Đám cưới Đài Loan · dự kiến 07/2027', 'zh-TW': '台灣婚禮｜預計 2027/07' },
    note: '',
    status: 'todo',
  },
];

// ---------------------------------------------------------------------------
// PHẦN 2 — BUDGET BREAKDOWN (100,000,000 VNĐ)
// ---------------------------------------------------------------------------

export const seedBudgetGroups: BudgetGroup[] = [
  { id: 'g_vn', name: { vi: 'Lễ cưới Việt Nam', 'zh-TW': '越南婚禮' } },
  { id: 'g_tw', name: { vi: 'Lễ cưới Đài Loan', 'zh-TW': '台灣婚禮' } },
  { id: 'g_travel', name: { vi: 'Đi lại & lưu trú 2 gia đình', 'zh-TW': '雙方家庭交通與住宿' } },
];

export const seedBudgetItems: BudgetItem[] = [
  // --- Lễ cưới Việt Nam (the original 100M breakdown) ---
  {
    id: 'food',
    groupId: 'g_vn',
    name: { vi: 'Đồ ăn & tiệc', 'zh-TW': '餐飲與婚宴' },
    planned: 42_000_000,
    actual: 0,
    note: { vi: 'Gồm buffet, tráng miệng, đồ uống.', 'zh-TW': '含自助餐、甜點、飲料。' },
    highPriority: true,
  },
  {
    id: 'video',
    groupId: 'g_vn',
    name: { vi: 'Phóng sự cưới + Video', 'zh-TW': '婚禮紀錄片與錄影' },
    planned: 22_000_000,
    actual: 0,
    note: { vi: 'Quay trọn ngày, dựng phim ngắn cinematic.', 'zh-TW': '全天錄影，剪輯電影感短片。' },
    highPriority: true,
  },
  {
    id: 'venue',
    groupId: 'g_vn',
    name: { vi: 'Địa điểm sân vườn + trang trí', 'zh-TW': '花園場地與布置' },
    planned: 13_000_000,
    actual: 0,
    note: { vi: 'Backdrop lễ Vow, ghế khách, hoa trang trí.', 'zh-TW': '儀式背板、賓客座椅、花藝。' },
  },
  {
    id: 'sound',
    groupId: 'g_vn',
    name: { vi: 'Âm thanh, ánh sáng, MC', 'zh-TW': '音響、燈光、主持' },
    planned: 6_000_000,
    actual: 0,
    note: { vi: 'MC song ngữ Việt–Trung.', 'zh-TW': '中越雙語主持。' },
  },
  {
    id: 'attire',
    groupId: 'g_vn',
    name: { vi: 'Trang phục cưới (thuê)', 'zh-TW': '婚禮服裝（租借）' },
    planned: 5_000_000,
    actual: 0,
  },
  {
    id: 'photo',
    groupId: 'g_vn',
    name: { vi: 'Chụp ảnh cưới (studio)', 'zh-TW': '婚紗攝影（棚拍）' },
    planned: 4_000_000,
    actual: 0,
  },
  {
    id: 'ceremony',
    groupId: 'g_vn',
    name: { vi: 'Lễ gia tiên', 'zh-TW': '祭祖儀式' },
    planned: 2_000_000,
    actual: 0,
  },
  {
    id: 'invitations',
    groupId: 'g_vn',
    name: { vi: 'Thiệp mời & vật dụng nhỏ', 'zh-TW': '喜帖與小物' },
    planned: 2_000_000,
    actual: 0,
  },
  {
    id: 'contingency',
    groupId: 'g_vn',
    name: { vi: 'Dự phòng phát sinh', 'zh-TW': '預備金' },
    planned: 4_000_000,
    actual: 0,
    note: { vi: 'Cho tiệc ngoài trời.', 'zh-TW': '戶外婚禮備用。' },
    highPriority: true,
  },
  // --- Lễ cưới Đài Loan (fill in the amounts) ---
  {
    id: 'tw_banquet',
    groupId: 'g_tw',
    name: { vi: 'Tiệc cưới nhà hàng (Đài Loan)', 'zh-TW': '婚宴（台灣餐廳）' },
    planned: 0,
    actual: 0,
  },
  {
    id: 'tw_attire',
    groupId: 'g_tw',
    name: { vi: 'Trang phục & trang điểm', 'zh-TW': '禮服與妝髮' },
    planned: 0,
    actual: 0,
  },
  {
    id: 'tw_decor',
    groupId: 'g_tw',
    name: { vi: 'Trang trí & hoa', 'zh-TW': '布置與花藝' },
    planned: 0,
    actual: 0,
  },
  {
    id: 'tw_gifts',
    groupId: 'g_tw',
    name: { vi: 'Sính lễ & quà cưới', 'zh-TW': '聘禮與喜餅' },
    planned: 0,
    actual: 0,
  },
  // --- Đi lại & lưu trú 2 gia đình ---
  {
    id: 'tr_flights',
    groupId: 'g_travel',
    name: { vi: 'Vé máy bay VN–Đài (khứ hồi)', 'zh-TW': '越南–台灣機票（來回）' },
    planned: 0,
    actual: 0,
  },
  {
    id: 'tr_hotel',
    groupId: 'g_travel',
    name: { vi: 'Khách sạn / lưu trú', 'zh-TW': '飯店／住宿' },
    planned: 0,
    actual: 0,
  },
  {
    id: 'tr_local_bd',
    groupId: 'g_travel',
    name: { vi: 'Di chuyển nội địa (Bình Dương)', 'zh-TW': '平陽當地交通' },
    planned: 0,
    actual: 0,
  },
  {
    id: 'tr_local_tn',
    groupId: 'g_travel',
    name: { vi: 'Di chuyển nội địa (Đài Nam)', 'zh-TW': '台南當地交通' },
    planned: 0,
    actual: 0,
  },
  {
    id: 'tr_food',
    groupId: 'g_travel',
    name: { vi: 'Ăn uống & tham quan', 'zh-TW': '餐飲與觀光' },
    planned: 0,
    actual: 0,
  },
];


// ---------------------------------------------------------------------------
// Vendors — placeholder starting structure per category
// ---------------------------------------------------------------------------

export const seedVendors: Vendor[] = [
  { id: 'v-banquet-1', name: '', category: 'banquet', contact: '', quoteAmount: 0, status: 'contacted', notes: '' },
  { id: 'v-video-1', name: '', category: 'videography', contact: '', quoteAmount: 0, status: 'contacted', notes: '' },
  { id: 'v-sound-1', name: '', category: 'sound_lighting', contact: '', quoteAmount: 0, status: 'contacted', notes: '' },
  { id: 'v-attire-1', name: '', category: 'attire', contact: '', quoteAmount: 0, status: 'contacted', notes: '' },
  { id: 'v-photo-1', name: '', category: 'photography', contact: '', quoteAmount: 0, status: 'contacted', notes: '' },
];

// ---------------------------------------------------------------------------
// Guests — empty starter lists, VN side / TW side
// ---------------------------------------------------------------------------

export const seedGuests: Guest[] = [];

// ---------------------------------------------------------------------------
// Documents — starter vault with typical categories
// ---------------------------------------------------------------------------

export const seedDocuments: DocumentItem[] = [
  {
    id: 'd-marriage-1',
    name: { vi: 'Giấy xác nhận độc thân', 'zh-TW': '單身證明' },
    category: 'marriage',
    status: 'not_started',
    notes: '',
  },
  {
    id: 'd-passport-1',
    name: { vi: 'Hộ chiếu', 'zh-TW': '護照' },
    category: 'passport',
    status: 'not_started',
    notes: '',
  },
];
