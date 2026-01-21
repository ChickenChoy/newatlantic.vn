/**
 * Validate Vietnamese phone number
 * - Must be 10 digits starting with 0 (or +84)
 * - Must use valid Vietnamese mobile carrier prefix
 * - Rejects fake patterns (repeated digits, sequential numbers)
 */
export function validateVietnamesePhone(phone: string): { valid: boolean; error?: string } {
  const cleaned = phone.replace(/[\s\-\.]/g, '');

  // Normalize +84 to 0
  const normalized = cleaned.startsWith('+84')
    ? '0' + cleaned.slice(3)
    : cleaned;

  // Must be 10 digits starting with 0
  if (!/^0\d{9}$/.test(normalized)) {
    return { valid: false, error: 'Số điện thoại phải có 10 chữ số' };
  }

  // Valid Vietnamese mobile prefixes
  const validPrefixes = [
    // Viettel
    '032', '033', '034', '035', '036', '037', '038', '039', '086', '096', '097', '098',
    // Vinaphone
    '081', '082', '083', '084', '085', '088', '091', '094',
    // Mobifone
    '070', '076', '077', '078', '079', '089', '090', '093',
    // Vietnamobile
    '052', '056', '058', '092',
    // Gmobile
    '059', '099',
    // Itelecom
    '087'
  ];

  const prefix = normalized.slice(0, 3);
  if (!validPrefixes.includes(prefix)) {
    return { valid: false, error: 'Đầu số không hợp lệ' };
  }

  // Reject repeated digits (e.g., 0901111111, 0900000000)
  const digits = normalized.slice(1); // Remove leading 0
  if (/^(\d)\1{8}$/.test(digits)) {
    return { valid: false, error: 'Số điện thoại không hợp lệ' };
  }

  // Reject sequential patterns (0123456789, 9876543210)
  const sequential = '0123456789';
  const reverseSeq = '9876543210';
  if (sequential.includes(digits) || reverseSeq.includes(digits)) {
    return { valid: false, error: 'Số điện thoại không hợp lệ' };
  }

  // Reject too many repeated consecutive digits (e.g., 0901234444)
  if (/(\d)\1{4,}/.test(digits)) {
    return { valid: false, error: 'Số điện thoại không hợp lệ' };
  }

  // Reject patterns like 0909090909
  if (/^(\d{2})\1{4}$/.test(digits) || /^(\d{3})\1{2}\d$/.test(digits)) {
    return { valid: false, error: 'Số điện thoại không hợp lệ' };
  }

  return { valid: true };
}
