// Test the page range functionality
// This is a simple test script to validate the page range parsing

// Mock the parsePageRange function from main-app.js
function parsePageRange(rangeText) {
    const pages = new Set();
    const parts = rangeText.split(',').map(part => part.trim());

    parts.forEach(part => {
        if (part.includes('-')) {
            // Range like "5-8"
            const [start, end] = part.split('-').map(num => parseInt(num.trim()));
            if (!isNaN(start) && !isNaN(end) && start <= end) {
                for (let i = start; i <= end; i++) {
                    pages.add(i);
                }
            }
        } else {
            // Single page like "3"
            const pageNum = parseInt(part);
            if (!isNaN(pageNum) && pageNum > 0) {
                pages.add(pageNum);
            }
        }
    });

    return Array.from(pages).sort((a, b) => a - b);
}

// Test cases
console.log('Testing page range parsing function:');
console.log('=====================================');

// Test cases
const testCases = [
    { input: '1', expected: [1], description: 'Single page' },
    { input: '1,3,5', expected: [1, 3, 5], description: 'Multiple individual pages' },
    { input: '1-3', expected: [1, 2, 3], description: 'Simple range' },
    { input: '1-3,5', expected: [1, 2, 3, 5], description: 'Range + individual page' },
    { input: '1,3-5,7', expected: [1, 3, 4, 5, 7], description: 'Individual + range + individual' },
    { input: '1,3,5-8,10', expected: [1, 3, 5, 6, 7, 8, 10], description: 'Complex range' },
    { input: '1,1,2', expected: [1, 2], description: 'Duplicates should be removed' },
    { input: '   1  ,   3   ', expected: [1, 3], description: 'Handle whitespace' },
    { input: '10-8', expected: [], description: 'Invalid range (start > end)' },
    { input: 'abc', expected: [], description: 'Invalid input' },
    { input: '0,1,2', expected: [1, 2], description: 'Invalid page number (0)' }
];

testCases.forEach(testCase => {
    const result = parsePageRange(testCase.input);
    const passed = JSON.stringify(result) === JSON.stringify(testCase.expected);
    const status = passed ? '✅ PASS' : '❌ FAIL';

    console.log(`${status} ${testCase.description}`);
    console.log(`  Input: "${testCase.input}"`);
    console.log(`  Expected: [${testCase.expected.join(', ')}]`);
    console.log(`  Got: [${result.join(', ')}]`);
    console.log('');
});

console.log('Testing shouldApplyParafToPage function:');
console.log('===========================================');

// Mock state variables
let parafPageRange = 'all';
let selectedPages = [2, 4, 6];

function shouldApplyParafToPage(pageNum) {
    if (parafPageRange === 'all') {
        return true;
    } else if (parafPageRange === 'custom') {
        return selectedPages.includes(pageNum);
    }
    return false;
}

// Test shouldApplyParafToPage function
console.log('Testing with parafPageRange = "all":');
for (let i = 1; i <= 6; i++) {
    const result = shouldApplyParafToPage(i);
    console.log(`  Page ${i}: ${result ? '✅' : '❌'} (should be true)`);
}

console.log('\nTesting with parafPageRange = "custom", selectedPages = [2, 4, 6]:');
parafPageRange = 'custom';
for (let i = 1; i <= 6; i++) {
    const result = shouldApplyParafToPage(i);
    const expected = selectedPages.includes(i);
    const status = result === expected ? '✅' : '❌';
    console.log(`  Page ${i}: ${status} ${result} (should be ${expected})`);
}

console.log('\nTest completed!');