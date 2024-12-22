const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
  name: 'esbuild-problem-matcher',

  setup(build) {
    build.onStart(() => {
      console.log('[watch] build started');
    });
    build.onEnd((result) => {
      result.errors.forEach(({ text, location }) => {
        console.error(`✘ [ERROR] ${text}`);
        console.error(`    ${location.file}:${location.line}:${location.column}:`);
      });
      console.log('[watch] build finished');
    });
  },
};

async function main() {
  const ctx = await esbuild.context({
    entryPoints: ['src/extension.ts'],
    bundle: true,
    format: 'cjs',
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
    platform: 'node',
    outfile: 'dist/extension.js',
    external: ['vscode'],
    logLevel: 'silent',
    plugins: [
      /* add to the end of plugins array */
      esbuildProblemMatcherPlugin,
    ],
  });
  if (watch) {
    await ctx.watch();
    await moveFile('src/snippets.js', 'dist/snippets.js');
  } else {
    await ctx.rebuild();
    // 移动文件到 dist
    await moveFile('src/snippets.js', 'dist/snippets.js');
    await ctx.dispose();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

async function moveFile(source, destination) {
  try {
    await fs.promises.mkdir(path.dirname(destination), { recursive: true }); // 确保目标文件夹存在
    await fs.promises.copyFile(source, destination); // 复制文件
    console.log(`Moved ${source} to ${destination}`);
  } catch (err) {
    console.error(`Failed to move file: ${err.message}`);
    process.exit(1);
  }
}
