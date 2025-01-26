async function fetchDirectoryContents(path = '') {
  const response = await fetch(`https://api.github.com/repos/morhendos/subscription-tracker/contents/${path}`);
  const data = await response.json();
  let tree = '';
  
  for (const item of data) {
    const prefix = path ? '│   ' : '';
    tree += `${prefix}${item.type === 'dir' ? '├── ' : '└── '}${item.name}\n`;
    
    if (item.type === 'dir') {
      const subtree = await fetchDirectoryContents(item.path);
      tree += subtree;
    }
  }
  
  return tree;
}

async function generateTree() {
  const tree = await fetchDirectoryContents();
  console.log('subscription-tracker/\n' + tree);
}

generateTree();