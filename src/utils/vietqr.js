// Danh sách ngân hàng thụ hưởng (Mặc định BIDV)
export const VIETNAM_BANKS = [
  { 
    id: 'BIDV', 
    name: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam', 
    shortName: 'BIDV', 
    code: '970418',
    icon: '/bidv.png'
  }
];

export const DEFAULT_BANK_CONFIG = {
  bankId: 'BIDV',
  accountNo: '5901170138',
  accountName: 'HO VAN DUY',
  template: 'compact2' // 'compact2', 'qr_only', 'print'
};

/**
 * Tạo URL mã VietQR động theo chuẩn Napas 247
 */
export function generateVietQRUrl({
  bankId = 'BIDV',
  accountNo = '5901170138',
  accountName = 'HO VAN DUY',
  amount = 0,
  addInfo = 'KEO KEO DAM THANH TOAN',
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
