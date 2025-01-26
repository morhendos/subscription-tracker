const fs = require('fs');
const path = require('path');

function generateTree(startPath, prefix = '') {
    let tree = '';
    const files = fs.readdirSync(startPath);
    
    files.forEach((file, index) => {
        const filePath = path.join(startPath, file);
        const isLast = index === files.length - 1;
        const stats = fs.statSync(filePath);
        
        tree += `${prefix}${isLast ? '└── ' : '├── '}${file}\n`;
        
        if (stats.isDirectory()) {
            tree += generateTree(filePath, prefix + (isLast ? '    ' : '│   '));
        }
    });
    
    return tree;
}

console.log('project/');
console.log(generateTree('.'));