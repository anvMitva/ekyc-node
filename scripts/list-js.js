import { readdir } from 'node:fs/promises';
import path from 'node:path';
const JS_EXTENSIONS = new Set(['.js', '.cjs', '.mjs']);
const workspaceRoot = process.cwd();
const srcRoot = path.resolve(workspaceRoot, 'src');
const pending = [];
async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.name.startsWith('.')) {
            // Skip hidden files/directories such as .DS_Store
            continue;
        }
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await walk(fullPath);
            continue;
        }
        if (!entry.isFile()) {
            continue;
        }
        const ext = path.extname(entry.name);
        if (JS_EXTENSIONS.has(ext) && !entry.name.endsWith('.d.ts')) {
            const relativePath = path.relative(workspaceRoot, fullPath).replaceAll('\\', '/');
            pending.push(relativePath);
        }
    }
}
async function main() {
    try {
        await walk(srcRoot);
    }
    catch (error) {
        console.error('Failed to scan source tree:', error);
        process.exitCode = 1;
        return;
    }
    if (pending.length === 0) {
        console.log('✅ All source files are TypeScript.');
        return;
    }
    pending.sort();
    console.log(`JavaScript files pending migration (${pending.length}):`);
    for (const file of pending) {
        console.log(`  - ${file}`);
    }
    const summary = new Map();
    for (const file of pending) {
        const [directory] = file.split('/', 2);
        summary.set(directory, (summary.get(directory) ?? 0) + 1);
    }
    console.log('\nBy top-level folder:');
    for (const [directory, count] of summary.entries()) {
        console.log(`  • ${directory}: ${count}`);
    }
}
await main();
//# sourceMappingURL=list-js.js.map