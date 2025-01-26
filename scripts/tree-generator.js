const { Octokit } = require('@octokit/rest');

// Replace with your GitHub token
const octokit = new Octokit({
  auth: 'YOUR_GITHUB_TOKEN'
});

async function fetchDirectoryContents(owner, repo, path = '') {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path
    });

    let tree = '';
    const items = Array.isArray(data) ? data : [data];

    for (const item of items) {
      const prefix = path ? '│   ' : '';
      const isDir = item.type === 'dir';
      tree += `${prefix}${isDir ? '├── ' : '└── '}${item.name}\n`;

      if (isDir) {
        const subtree = await fetchDirectoryContents(owner, repo, item.path);
        tree += subtree;
      }
    }
    return tree;
  } catch (error) {
    console.error(`Error fetching ${path}:`, error.message);
    return '';
  }
}

async function generateTree(owner, repo) {
  console.log(`${repo}/`);
  const tree = await fetchDirectoryContents(owner, repo);
  console.log(tree);
}

// Run the script
generateTree('morhendos', 'subscription-tracker');