// Seed data derived from ke-hoach-dam-cuoi-viet-dai.md.
// All display text is bilingual { vi, 'zh-TW' } so it switches with the UI language.
// Copy is kept concise and factual — no advisory / explanatory padding.

import type {
  BudgetCategory,
  TaskItem,
  Vendor,
  ItineraryPlan,
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

export const seedBudget: BudgetCategory[] = [
  {
    id: 'food',
    name: { vi: 'Đồ ăn & tiệc', 'zh-TW': '餐飲與婚宴' },
    planned: 42_000_000,
    actual: 0,
    percent: 42,
    note: { vi: 'Gồm buffet, tráng miệng, đồ uống.', 'zh-TW': '含自助餐、甜點、飲料。' },
    highPriority: true,
  },
  {
    id: 'video',
    name: { vi: 'Phóng sự cưới + Video', 'zh-TW': '婚禮紀錄片與錄影' },
    planned: 22_000_000,
    actual: 0,
    percent: 22,
    note: { vi: 'Quay trọn ngày, dựng phim ngắn cinematic.', 'zh-TW': '全天錄影，剪輯電影感短片。' },
    highPriority: true,
  },
  {
    id: 'venue',
    name: { vi: 'Địa điểm sân vườn + trang trí', 'zh-TW': '花園場地與布置' },
    planned: 13_000_000,
    actual: 0,
    percent: 13,
    note: { vi: 'Backdrop lễ Vow, ghế khách, hoa trang trí.', 'zh-TW': '儀式背板、賓客座椅、花藝。' },
    highPriority: false,
  },
  {
    id: 'sound',
    name: { vi: 'Âm thanh, ánh sáng, MC', 'zh-TW': '音響、燈光、主持' },
    planned: 6_000_000,
    actual: 0,
    percent: 6,
    note: { vi: 'MC song ngữ Việt–Trung.', 'zh-TW': '中越雙語主持。' },
    highPriority: false,
  },
  {
    id: 'attire',
    name: { vi: 'Trang phục cưới (thuê)', 'zh-TW': '婚禮服裝（租借）' },
    planned: 5_000_000,
    actual: 0,
    percent: 5,
    note: '',
    highPriority: false,
  },
  {
    id: 'photo',
    name: { vi: 'Chụp ảnh cưới (studio)', 'zh-TW': '婚紗攝影（棚拍）' },
    planned: 4_000_000,
    actual: 0,
    percent: 4,
    note: '',
    highPriority: false,
  },
  {
    id: 'ceremony',
    name: { vi: 'Lễ gia tiên', 'zh-TW': '祭祖儀式' },
    planned: 2_000_000,
    actual: 0,
    percent: 2,
    note: '',
    highPriority: false,
  },
  {
    id: 'invitations',
    name: { vi: 'Thiệp mời & vật dụng nhỏ', 'zh-TW': '喜帖與小物' },
    planned: 2_000_000,
    actual: 0,
    percent: 2,
    note: '',
    highPriority: false,
  },
  {
    id: 'contingency',
    name: { vi: 'Dự phòng phát sinh', 'zh-TW': '預備金' },
    planned: 4_000_000,
    actual: 0,
    percent: 4,
    note: { vi: 'Cho tiệc ngoài trời.', 'zh-TW': '戶外婚禮備用。' },
    highPriority: true,
  },
];

// ---------------------------------------------------------------------------
// PHẦN 3 — LOGISTICS & TOUR PLAN
// ---------------------------------------------------------------------------

export const seedItineraries: ItineraryPlan[] = [
  {
    id: 'binh_duong',
    titleKey: 'timeline.itinerary.binhDuong.title',
    location: 'Bình Dương',
    stayNote: {
      vi: 'Ở khu nghỉ dưỡng Đại Nam (khách sạn 5 sao, biển nhân tạo) hoặc khách sạn trung tâm Thủ Dầu Một.',
      'zh-TW': '可住大南度假區（五星飯店、人造海灘）或土龍木市中心飯店。',
    },
    days: [
      {
        day: 1,
        activities: {
          vi: 'Đón sân bay Tân Sơn Nhất, về Bình Dương (~1,5h). Nhận phòng. Tối dạo Chợ đêm Bạch Đằng.',
          'zh-TW': '新山一機場接機，前往平陽（約 1.5 小時）。入住。晚間逛白藤夜市。',
        },
      },
      {
        day: 2,
        activities: {
          vi: 'Khu du lịch Đại Nam (công viên chủ đề, Safari, biển nhân tạo). Trọn ngày.',
          'zh-TW': '大南文獻樂境樂園（主題樂園、野生動物園、人造海灘），全天。',
        },
      },
      {
        day: 3,
        activities: {
          vi: 'Sáng: Chùa Hội Khánh, Nhà thờ Chánh tòa Phú Cường. Chiều: Vườn trái cây Lái Thiêu.',
          'zh-TW': '上午：會慶寺、富強主教座堂。下午：Lái Thiêu 果園。',
        },
      },
      {
        day: 4,
        activities: {
          vi: 'Khu sinh thái Thủy Châu hoặc Dìn Ký. Không gian sông nước, ăn đặc sản miền Tây.',
          'zh-TW': '水洲或 Dìn Ký 生態區。水鄉風光，品嘗越南西部料理。',
        },
      },
      {
        day: 5,
        activities: {
          vi: 'Mua quà lưu niệm (gốm sứ Minh Long), dạo phố đi bộ, tiễn sân bay.',
          'zh-TW': '採買伴手禮（明龍陶瓷），逛步行街，送機。',
        },
      },
    ],
    foodNote: {
      vi: 'Gỏi gà măng cụt Lái Thiêu, bò nướng ngói, nem Lái Thiêu, buffet hải sản.',
      'zh-TW': 'Lái Thiêu 山竹雞絲涼拌、瓦片烤牛肉、Lái Thiêu 春捲、海鮮自助餐。',
    },
  },
  {
    id: 'dai_nam',
    titleKey: 'timeline.itinerary.daiNam.title',
    location: 'Đài Nam',
    stayNote: {
      vi: 'Ở khu trung tâm (中西區) để đi bộ tới nhiều khu ẩm thực/di tích, hoặc khu An Bình (安平) nếu muốn gần biển.',
      'zh-TW': '可住中西區，步行可達多處美食與古蹟；或住安平區，鄰近海邊。',
    },
    days: [
      {
        day: 1,
        activities: {
          vi: 'Nhận phòng. Tối dạo phố cổ Thần Nông (神農街): đèn lồng đỏ, phố đá cổ.',
          'zh-TW': '入住。晚間漫步神農街：紅燈籠、古石板街。',
        },
      },
      {
        day: 2,
        activities: {
          vi: 'Xích Khảm Lâu (赤崁樓), Văn Miếu (孔廟), phố Phủ Trung (府中街). Tối: chợ đêm Hoa Viên (花園夜市, mở Thứ 4/6/7/CN).',
          'zh-TW': '赤崁樓、台南孔廟、府中街。晚間：花園夜市（週三、五、六、日營業）。',
        },
      },
      {
        day: 3,
        activities: {
          vi: 'Phố cổ An Bình (安平老街): pháo đài An Bình, An Bình Thụ Ốc (安平樹屋). Thử súp bò, bánh tôm.',
          'zh-TW': '安平老街：安平古堡、安平樹屋。品嘗牛肉湯、蝦餅。',
        },
      },
      {
        day: 4,
        activities: {
          vi: 'Bảo tàng Chi Mei (奇美博物館). Chiều: Khu văn hóa sáng tạo Bờ Tường Xanh (藍晒圖文創園區).',
          'zh-TW': '奇美博物館。下午：藍晒圖文創園區。',
        },
      },
      {
        day: 5,
        activities: {
          vi: 'Vườn quốc gia Đài Giang (台江國家公園), đường hầm xanh Tứ Thảo (四草綠色隧道): thuyền trong rừng ngập mặn.',
          'zh-TW': '台江國家公園、四草綠色隧道：搭船遊紅樹林。',
        },
      },
      {
        day: 6,
        activities: {
          vi: 'Phố ẩm thực Quốc Hoa (國華街). Chiều: bách hóa Lâm Bách Hóa (林百貨, 1932).',
          'zh-TW': '國華街美食。下午：林百貨（1932 年古蹟）。',
        },
      },
      {
        day: 7,
        activities: {
          vi: 'Ngày nghỉ linh hoạt/mua quà, hoặc suối nước nóng Quan Tử Lĩnh (關子嶺溫泉, cách trung tâm ~1h).',
          'zh-TW': '彈性休息／採買，或前往關子嶺溫泉（距市中心約 1 小時）。',
        },
      },
    ],
    foodNote: {
      vi: 'Súp bò tươi (牛肉湯), bánh gạo hấp (碗粿), cuốn tôm chiên Kim Đắc (金得春捲), bánh bao thịt A Tùng (阿松割包), đậu hũ hoa Đồng Ký (同記豆花).',
      'zh-TW': '牛肉湯、碗粿、金得春捲、阿松割包、同記豆花。',
    },
  },
];

// ---------------------------------------------------------------------------
// Vendors — placeholder starting structure per category
// ---------------------------------------------------------------------------

export const seedVendors: Vendor[] = [
  { id: 'v-catering-1', name: '', category: 'catering', contact: '', quoteAmount: 0, status: 'contacted', notes: '' },
  { id: 'v-video-1', name: '', category: 'videography', contact: '', quoteAmount: 0, status: 'contacted', notes: '' },
  { id: 'v-venue-1', name: '', category: 'venue', contact: '', quoteAmount: 0, status: 'contacted', notes: '' },
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
