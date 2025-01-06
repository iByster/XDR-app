export const DetectionRules = {
  // Email detection rules
  suspiciousKeywords: [
    'password',
    'urgent',
    'click here',
    'reset your account',
    'verify your identity',
    'login',
    'bank account',
  ],
  phishingIndicators: [
    'update your credentials',
    'verify your identity',
    'confirm your password',
    'account suspended',
    'unauthorized login',
  ],
  allowedDomains: ['trusted-domain.com', 'company.com'],

  // Attachment detection rules
  dangerousContentTypes: [
    'application/x-msdownload', // Executable files
    'application/x-sh', // Shell scripts
    'application/x-bat', // Batch files
    'application/x-python', // Python scripts
    'application/vnd.ms-office',
    'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
  ],
  suspiciousFileExtensions: ['exe', 'bat', 'sh', 'js', 'vbs', 'dll', 'py'],
  maxAttachmentSize: 15 * 1024 * 1024, // 15 MB limit
};
