// Simple test file to verify phone number formatting
import { formatPhoneForWhatsApp, formatPhoneInput } from './src/models/utils.jsx';

// Test cases
const testCases = [
  '08123456789',     // Should become: 62123456789
  '+628123456789',   // Should become: 628123456789  
  '628123456789',    // Should remain: 628123456789
  '0812-345-6789',   // Should become: 6212-345-6789
  '+62 812 345 6789', // Should become: 62 812 345 6789
  '08123456789',     // Should become: 62123456789
];

console.log('Testing formatPhoneForWhatsApp:');
testCases.forEach(phone => {
  console.log(`Input: "${phone}" -> Output: "${formatPhoneForWhatsApp(phone)}"`);
});

console.log('\nTesting formatPhoneInput:');
testCases.forEach(phone => {
  console.log(`Input: "${phone}" -> Output: "${formatPhoneInput(phone)}"`);
});
