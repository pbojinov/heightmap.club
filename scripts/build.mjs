import { createHash } from 'node:crypto';
import { mkdir, rm, cp, copyFile, readFile, writeFile } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const name of ['index.html', 'css', 'js', 'vendor', 'assets', '_headers', 'license.txt']) {
  await cp(name, `dist/${name}`, { recursive: true, filter: path => !path.endsWith('.DS_Store') });
}
await copyFile('node_modules/three/build/three.min.js', 'dist/vendor/three.min.js');
await copyFile('node_modules/three/LICENSE', 'dist/vendor/three-LICENSE.txt');
let html = await readFile('dist/index.html', 'utf8');
for (const path of ['css/style.css', 'vendor/OrbitControls.js', 'js/index.js']) {
  const hash = createHash('sha256').update(await readFile(`dist/${path}`)).digest('hex').slice(0, 12);
  html = html.replaceAll(path, `${path}?v=${hash}`);
}
await writeFile('dist/index.html', html);
console.log('Static height map built in dist/');
