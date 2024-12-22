export default {
    // 主要格式化选项
    printWidth: 120,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: true,
    trailingComma: 'es5',
    bracketSpacing: true,
    arrowParens: 'always',
    parser: 'typescript',
  
    // 针对不同文件类型的特殊配置
    overrides: [
      {
        files: ['*.json', '.syncpackrc'],
        options: {
          parser: 'jsonc',
          singleQuote: false,
          trailingComma: 'none',
        },
      },
      {
        files: ['*.scss', '*.css'],
        options: {
          parser: 'scss',
          trailingComma: 'none',
        },
      },
      {
        files: ['*.md'],
        options: {
          parser: 'markdown',
        },
      },
      {
        files: ['*.html'],
        options: {
          parser: 'html',
        },
      },
      {
        files: ['*.yaml'],
        options: {
          parser: 'yaml',
        },
      },
    ],
  };

