// Seed data extracted verbatim from ke-hoach-dam-cuoi-viet-dai.md
// Vietnamese content is intentionally left untranslated per spec.

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
  // Giai đoạn 1: 12+ tháng trước (T7–T9/2026)
  {
    id: 'p1-1',
    phase: 'phase1',
    title: 'Khám sức khỏe tiền hôn nhân',
    note: 'Nên làm sớm vì nếu phát sinh vấn đề cần điều trị/tái khám sẽ có đủ thời gian xử lý',
    status: 'todo',
  },
  {
    id: 'p1-2',
    phase: 'phase1',
    title: 'Bắt đầu tìm hiểu thủ tục đăng ký kết hôn Việt – Đài',
    note: 'Đây là hạng mục rủi ro thời gian cao nhất — cần xác nhận độc thân, hợp pháp hóa lãnh sự, dịch thuật công chứng ở cả hai nước. Nên tư vấn luật sư/dịch vụ chuyên làm hồ sơ kết hôn Đài–Việt ngay từ giờ',
    status: 'todo',
  },
  {
    id: 'p1-3',
    phase: 'phase1',
    title: 'Mua nhẫn cầu hôn (tại Đài Loan)',
    note: 'Có thể kết hợp đặt luôn nhẫn cưới để được ưu đãi combo',
    status: 'todo',
  },
  {
    id: 'p1-4',
    phase: 'phase1',
    title: 'Bắt đầu khảo sát, xin báo giá đơn vị quay phóng sự cưới & video',
    note: 'Vì đây là hạng mục ưu tiên ngân sách cao nhất, cần xem portfolio kỹ, chốt sớm để giữ lịch cuối tuần đẹp gần ngày 12/06/2027',
    status: 'todo',
  },
  {
    id: 'p1-5',
    phase: 'phase1',
    title: 'Xác định concept tiệc ngoài trời + lễ Vow, khảo sát địa điểm sân vườn tại khu vực tổ chức',
    note: 'Địa điểm đẹp mùa hè (tháng 6) thường được đặt trước rất sớm',
    status: 'todo',
  },
  // Giai đoạn 2: 9–6 tháng trước (T9/2026 – T12/2026)
  {
    id: 'p2-1',
    phase: 'phase2',
    title: 'Nộp hồ sơ đăng ký kết hôn (giai đoạn xử lý chính thức)',
    note: 'Theo sát tiến độ hai bên cơ quan',
    status: 'todo',
  },
  {
    id: 'p2-2',
    phase: 'phase2',
    title: 'Chốt hợp đồng đơn vị quay phóng sự/video cưới VN',
    note: 'Cần chốt trước khi vào mùa cưới cao điểm',
    status: 'todo',
  },
  {
    id: 'p2-3',
    phase: 'phase2',
    title: 'Chốt địa điểm tiệc ngoài trời + đặt cọc',
    note: '',
    status: 'todo',
  },
  {
    id: 'p2-4',
    phase: 'phase2',
    title: 'Đặt vé máy bay khứ hồi cho gia đình hai bên',
    note: 'Giá tốt nhất thường săn được 6–9 tháng trước, đặc biệt mùa hè là cao điểm bay VN–Đài',
    status: 'todo',
  },
  {
    id: 'p2-5',
    phase: 'phase2',
    title: 'Bắt đầu lên danh sách khách mời sơ bộ hai bên',
    note: 'Để làm cơ sở tính số bàn tiệc, ngân sách đồ ăn',
    status: 'todo',
  },
  {
    id: 'p2-6',
    phase: 'phase2',
    title: 'Khảo sát studio chụp ảnh cưới đơn giản, xin báo giá',
    note: 'Vì đây là hạng mục tiết kiệm, chỉ cần chốt nhanh gọn',
    status: 'todo',
  },
  {
    id: 'p2-7',
    phase: 'phase2',
    title: 'Bắt đầu tìm hiểu ngày đẹp tại Đài Loan tháng 7/2027, tránh tháng cô hồn (âm lịch)',
    note: 'Nên nhờ chú rể/gia đình Đài Loan kiểm tra lịch âm chính xác cho năm 2027, vì tháng 7 âm lịch có thể rơi vào cuối tháng 7 hoặc tháng 8 dương lịch tùy năm',
    status: 'todo',
  },
  // Giai đoạn 3: 6–3 tháng trước (T12/2026 – T3/2027)
  {
    id: 'p3-1',
    phase: 'phase3',
    title: 'Chốt ngày cưới Đài Loan chính thức',
    note: 'Sau khi đã tránh được tháng cô hồn',
    status: 'todo',
  },
  {
    id: 'p3-2',
    phase: 'phase3',
    title: 'Thử trang phục cưới (áo dài, vest, váy cưới)',
    note: '',
    status: 'todo',
  },
  {
    id: 'p3-3',
    phase: 'phase3',
    title: 'Chốt thực đơn tiệc với đơn vị nấu ăn/nhà hàng',
    note: 'Vì "đồ ăn ê hề, ngon" là ưu tiên số 1, nên dành nhiều buổi thử món',
    status: 'todo',
  },
  {
    id: 'p3-4',
    phase: 'phase3',
    title: 'Lên kế hoạch chi tiết lễ gia tiên đơn giản',
    note: 'Chỉ cần các nghi thức tối giản, không cần thuê ê-kíp riêng',
    status: 'todo',
  },
  {
    id: 'p3-5',
    phase: 'phase3',
    title: 'Bắt đầu lên lịch trình 5 ngày cho gia đình chú rể tại Bình Dương',
    note: 'Đặt khách sạn sớm nếu đi vào mùa cao điểm',
    status: 'todo',
  },
  {
    id: 'p3-6',
    phase: 'phase3',
    title: 'Bắt đầu lên lịch trình 1 tuần cho ba mẹ cô dâu tại Đài Nam',
    note: '',
    status: 'todo',
  },
  {
    id: 'p3-7',
    phase: 'phase3',
    title: 'Chuẩn bị vàng của hồi môn, phong bì cho ba mẹ cô dâu',
    note: '',
    status: 'todo',
  },
  // Giai đoạn 4: 3–1 tháng trước (T3–T5/2027)
  {
    id: 'p4-1',
    phase: 'phase4',
    title: 'Chốt danh sách khách mời cuối cùng hai bên, gửi thiệp mời',
    note: '',
    status: 'todo',
  },
  {
    id: 'p4-2',
    phase: 'phase4',
    title: 'Chụp ảnh cưới tại studio',
    note: '',
    status: 'todo',
  },
  {
    id: 'p4-3',
    phase: 'phase4',
    title: 'Xác nhận toàn bộ vendor: đồ ăn, âm thanh ánh sáng, MC, hoa trang trí',
    note: '',
    status: 'todo',
  },
  {
    id: 'p4-4',
    phase: 'phase4',
    title: 'Xác nhận lịch trình + đặt chỗ nhà hàng, điểm tham quan cho hai gia đình',
    note: '',
    status: 'todo',
  },
  {
    id: 'p4-5',
    phase: 'phase4',
    title: 'Hoàn tất mọi giấy tờ đăng ký kết hôn (nếu chưa xong ở giai đoạn 1–2)',
    note: 'Đây là hạn chót an toàn để không ảnh hưởng đến kế hoạch tổ chức',
    status: 'todo',
  },
  {
    id: 'p4-6',
    phase: 'phase4',
    title: 'Rà soát lại toàn bộ ngân sách thực tế so với dự kiến',
    note: 'Đây chính là lúc tính năng Dynamic Budgeting của app phát huy tác dụng nhiều nhất',
    status: 'todo',
  },
  // Giai đoạn 5: 1 tháng trước – ngày cưới
  {
    id: 'p5-1',
    phase: 'phase5',
    title: 'Rehearsal / tổng duyệt lễ Vow',
    note: '',
    status: 'todo',
  },
  {
    id: 'p5-2',
    phase: 'phase5',
    title: 'Xác nhận số bàn tiệc cuối cùng với đơn vị đồ ăn',
    note: '',
    status: 'todo',
  },
  {
    id: 'p5-3',
    phase: 'phase5',
    title: 'Đón gia đình hai bên, khởi động lịch trình logistics',
    note: '',
    status: 'todo',
  },
  {
    id: 'p5-4',
    phase: 'phase5',
    title: 'Đám cưới VN — 12/06/2027',
    note: '',
    status: 'todo',
  },
  {
    id: 'p5-5',
    phase: 'phase5',
    title: 'Chuẩn bị bay sang Đài Loan',
    note: '',
    status: 'todo',
  },
  {
    id: 'p5-6',
    phase: 'phase5',
    title: 'Đám cưới Đài Loan — dự kiến 07/2027',
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
    name: 'Đồ ăn & tiệc (ê hề, ngon)',
    planned: 42_000_000,
    actual: 0,
    percent: 42,
    note: 'Ưu tiên #1 — nên chọn đơn vị catering có buffet phần ăn phụ (tráng miệng, đồ uống) đa dạng để tạo cảm giác "ê hề"',
    highPriority: true,
  },
  {
    id: 'video',
    name: 'Phóng sự cưới + Video',
    planned: 22_000_000,
    actual: 0,
    percent: 22,
    note: 'Ưu tiên #2 — tìm ê-kíp chuyên phóng sự (không chỉ chụp ảnh), có gói quay 1 ngày trọn vẹn + dựng phim ngắn cinematic',
    highPriority: true,
  },
  {
    id: 'venue',
    name: 'Địa điểm sân vườn + trang trí + lễ Vow',
    planned: 13_000_000,
    actual: 0,
    percent: 13,
    note: 'Bao gồm backdrop lễ Vow, ghế ngồi khách, hoa trang trí tối giản theo tông tự nhiên (giảm chi phí hoa tươi cao cấp)',
    highPriority: false,
  },
  {
    id: 'sound',
    name: 'Âm thanh, ánh sáng, MC',
    planned: 6_000_000,
    actual: 0,
    percent: 6,
    note: 'Gói cơ bản cho tiệc ngoài trời, ưu tiên MC song ngữ nếu có khách Đài Loan tham dự',
    highPriority: false,
  },
  {
    id: 'attire',
    name: 'Trang phục cưới (thuê)',
    planned: 5_000_000,
    actual: 0,
    percent: 5,
    note: 'Thuê thay vì may đo để tiết kiệm',
    highPriority: false,
  },
  {
    id: 'photo',
    name: 'Chụp ảnh cưới (studio đơn giản)',
    planned: 4_000_000,
    actual: 0,
    percent: 4,
    note: 'Hạng mục cắt giảm — chọn studio gói cơ bản, ít bối cảnh, không cần ê-kíp trang điểm cao cấp riêng',
    highPriority: false,
  },
  {
    id: 'ceremony',
    name: 'Lễ gia tiên (tối giản)',
    planned: 2_000_000,
    actual: 0,
    percent: 2,
    note: 'Chỉ mua lễ vật cơ bản, không thuê đội bê tráp/không quay riêng',
    highPriority: false,
  },
  {
    id: 'invitations',
    name: 'Thiệp mời & vật dụng nhỏ lẻ',
    planned: 2_000_000,
    actual: 0,
    percent: 2,
    note: '',
    highPriority: false,
  },
  {
    id: 'contingency',
    name: 'Dự phòng phát sinh',
    planned: 4_000_000,
    actual: 0,
    percent: 4,
    note: 'Cho tiệc ngoài trời (mưa, quạt/che nắng phát sinh…)',
    highPriority: true,
  },
];

// "can-cut" order per doc guidance: decor/venue first, then invitations.
// Never cut food or videography.
export const CUT_FIRST_ORDER: BudgetCategory['id'][] = [
  'venue',
  'invitations',
  'photo',
  'sound',
  'attire',
  'ceremony',
];
export const NEVER_CUT: BudgetCategory['id'][] = ['food', 'video'];

// ---------------------------------------------------------------------------
// PHẦN 3 — LOGISTICS & TOUR PLAN
// ---------------------------------------------------------------------------

export const seedItineraries: ItineraryPlan[] = [
  {
    id: 'binh_duong',
    titleKey: 'timeline.itinerary.binhDuong.title',
    location: 'Bình Dương',
    stayNote:
      'Vì Bình Dương chủ yếu có khách sạn tầm trung/khu nghỉ dưỡng sinh thái, gia đình chú rể có 2 lựa chọn: ở lại khu nghỉ dưỡng trong Khu du lịch Đại Nam (có khách sạn 5 sao, bãi biển nhân tạo, tiện tổ chức vài ngày nghỉ dưỡng luôn tại chỗ), hoặc ở khách sạn trung tâm Thủ Dầu Một rồi di chuyển ra ngoài tham quan mỗi ngày. Nên đặt phòng trước ít nhất vài tuần vào mùa hè.',
    days: [
      {
        day: 1,
        title: 'Ngày 1',
        activities:
          'Đón sân bay Tân Sơn Nhất → di chuyển về Bình Dương (~1–1,5h). Nhận phòng khách sạn, nghỉ ngơi. Tối dạo Chợ đêm Bạch Đằng hoặc thử đặc sản gỏi gà măng cụt Lái Thiêu',
      },
      {
        day: 2,
        title: 'Ngày 2',
        activities:
          'Khu du lịch Lạc Cảnh Đại Nam Văn Hiến (công viên chủ đề + Safari + biển nhân tạo) — dành trọn ngày vì khu này rất rộng, phù hợp cả gia đình nhiều thế hệ',
      },
      {
        day: 3,
        title: 'Ngày 3',
        activities:
          'Buổi sáng: Chùa Hội Khánh (chùa cổ, có tượng Phật nằm lớn) + Nhà thờ Chánh tòa Phú Cường (kiến trúc Gothic). Buổi chiều: Vườn trái cây Lái Thiêu (nếu đúng mùa trái chín ~T5–T8 sẽ rất hợp)',
      },
      {
        day: 4,
        title: 'Ngày 4',
        activities:
          'Khu du lịch sinh thái Thủy Châu hoặc Dìn Ký — không gian sông nước, cắm trại, ăn đặc sản miền Tây, phù hợp cho một ngày thư giãn nhẹ nhàng thay vì di chuyển nhiều',
      },
      {
        day: 5,
        title: 'Ngày 5',
        activities:
          'Mua sắm/quà lưu niệm (gốm sứ Minh Long là đặc sản Bình Dương), dạo phố đi bộ, tiễn sân bay hoặc di chuyển lịch trình tiếp theo',
      },
    ],
    foodNote:
      'gỏi gà măng cụt Lái Thiêu (đặc sản mùa hè), bò nướng ngói, nem Lái Thiêu, các quán buffet hải sản.',
  },
  {
    id: 'dai_nam',
    titleKey: 'timeline.itinerary.daiNam.title',
    location: 'Đài Nam',
    stayNote:
      'Nên ở khu trung tâm (中西區) để đi bộ ra được nhiều khu ẩm thực/di tích, hoặc khu An Bình (安平) nếu muốn gần biển và có phòng view hoàng hôn.',
    days: [
      {
        day: 1,
        title: 'Ngày 1',
        activities: 'Nhận phòng, dạo phố cổ Thần Nông (神農街) buổi tối — đèn lồng đỏ, phố đá cổ, quán xá văn nghệ',
      },
      {
        day: 2,
        title: 'Ngày 2',
        activities:
          'Xích Khảm Lâu (赤崁樓) → Văn Miếu Đài Nam (孔廟) → phố Phủ Trung (府中街) → tối ăn ở khu chợ đêm Hoa Viên (花園夜市, chỉ mở Thứ 4/6/7/CN)',
      },
      {
        day: 3,
        title: 'Ngày 3',
        activities:
          'Phố cổ An Bình (安平老街) — pháo đài An Bình, cây cổ thụ An Bình Thụ Ốc (安平樹屋), thử món súp bò và bánh tôm nổi tiếng',
      },
      {
        day: 4,
        title: 'Ngày 4',
        activities:
          'Bảo tàng Chi Mei (奇美博物館) — bảo tàng tư nhân lớn nhất Đài Loan, rất phù hợp gia đình. Buổi chiều nghỉ ngơi, dạo Khu văn hóa sáng tạo Bờ Tường Xanh (藍晒圖文創園區)',
      },
      {
        day: 5,
        title: 'Ngày 5',
        activities:
          'Vườn quốc gia Đài Giang (台江國家公園) + đường hầm xanh Tứ Thảo (四草綠色隧道) — trải nghiệm thuyền trong rừng ngập mặn, khá đặc biệt và nhẹ nhàng, hợp với người lớn tuổi',
      },
      {
        day: 6,
        title: 'Ngày 6',
        activities:
          'Chợ Vĩnh Lạc/phố ẩm thực Quốc Hoa (國華街) — thiên đường ăn vặt Đài Nam; buổi chiều mua sắm ở bách hóa Lâm Bách Hóa (林百貨, tòa nhà cổ 1932)',
      },
      {
        day: 7,
        title: 'Ngày 7',
        activities:
          'Ngày nghỉ linh hoạt/mua sắm quà, hoặc nếu muốn thư giãn có thể đi suối nước nóng bùn khoáng Quan Tử Lĩnh (關子嶺溫泉, cách trung tâm khoảng 1 giờ)',
      },
    ],
    foodNote:
      'súp bò tươi (牛肉湯), bánh gạo hấp (碗粿), cuốn tôm chiên Kim Đắc (金得春捲), bánh bao thịt A Tùng (阿松割包), đậu hũ hoa Đồng Ký (同記豆花).',
  },
];

// ---------------------------------------------------------------------------
// Vendors — placeholder starting structure per category from the doc
// (catering, phóng sự/video, địa điểm, âm thanh ánh sáng, trang phục, chụp ảnh)
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
// Documents — empty starter vault with typical categories the user can fill
// ---------------------------------------------------------------------------

export const seedDocuments: DocumentItem[] = [
  {
    id: 'd-marriage-1',
    name: 'Giấy xác nhận độc thân',
    category: 'marriage',
    status: 'not_started',
    notes: '',
  },
  {
    id: 'd-passport-1',
    name: 'Hộ chiếu',
    category: 'passport',
    status: 'not_started',
    notes: '',
  },
];
