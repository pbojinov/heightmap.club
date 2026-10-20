import { mkdir, rm, cp, copyFile } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const name of ['index.html', 'css', 'js', 'vendor', 'assets', '_headers', 'license.txt']) {
  await cp(name, `dist/${name}`, { recursive: true, filter: path => !path.endsWith('.DS_Store') });
}
await copyFile('node_modules/three/build/three.min.js', 'dist/vendor/three.min.js');
await copyFile('node_modules/three/LICENSE', 'dist/vendor/three-LICENSE.txt');
console.log('Static height map built in dist/');
