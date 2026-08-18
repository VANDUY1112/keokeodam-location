// Danh sách các ngân hàng phổ biến tại Việt Nam (Chuẩn Napas 247 / VietQR)
export const VIETNAM_BANKS = [
  { id: 'MB', name: 'MBBank (Ngân Hàng Quân Đội)', shortName: 'MBBank', code: '970422' },
  { id: 'VCB', name: 'Vietcombank (Ngoại Thương Việt Nam)', shortName: 'Vietcombank', code: '970436' },
  { id: 'TCB', name: 'Techcombank (Kỹ Thương Việt Nam)', shortName: 'Techcombank', code: '970407' },
  { id: 'ACB', name: 'ACB (Á Châu)', shortName: 'ACB', code: '970416' },
  { id: 'VPB', name: 'VPBank (Việt Nam Thịnh Vượng)', shortName: 'VPBank', code: '970432' },
  { id: 'CTG', name: 'VietinBank (Công Thương Việt Nam)', shortName: 'VietinBank', code: '970415' },
  { id: 'BIDV', name: 'BIDV (Đầu Tư & Phát Triển)', shortName: 'BIDV', code: '970418' },
  { id: 'TPB', name: 'TPBank (Tiên Phong)', shortName: 'TPBank', code: '970423' },
  { id: 'STB', name: 'Sacombank (Sài Gòn Thương Tín)', shortName: 'Sacombank', code: '970403' },
  { id: 'VIB', name: 'VIB (Quốc Tế Việt Nam)', shortName: 'VIB', code: '970441' },
];

export const DEFAULT_BANK_CONFIG = {
  bankId: 'MB',
  accountNo: '0903123456',
  accountName: 'TRAN ANH TUAN',
  template: 'compact2' // 'compact2', 'qr_only', 'print'
};

/**
 * Tạo URL mã VietQR động theo chuẩn Napas 247
 */
export function generateVietQRUrl({
  bankId = 'MB',
  accountNo = '0903123456',
  accountName = 'TRAN ANH TUAN',
  amount = 0,
  addInfo = 'LOCAHOME THANH TOAN',
  template = 'compact2'
}) {
  const cleanAccountNo = accountNo.trim().replace(/\s+/g, '');
  const cleanBankId = bankId.trim();
  const cleanAccountName = encodeURIComponent(accountName.trim().toUpperCase());
  const cleanAddInfo = encodeURIComponent(addInfo.trim());
  const cleanAmount = Math.max(0, Math.round(amount || 0));

  let url = `https://img.vietqr.io/image/${cleanBankId}-${cleanAccountNo}-${template}.png?accountName=${cleanAccountName}`;
  
  if (cleanAmount > 0) {
    url += `&amount=${cleanAmount}`;
  }
  if (cleanAddInfo) {
    url += `&addInfo=${cleanAddInfo}`;
  }

  return url;
}
