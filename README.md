# Height Maps

> Created with Three.js.

![heightmap](https://i.imgur.com/OgAfytH.png)

Using a black and white image, the pixel color values are extracted and used to create triangular mesh. The values determine the height of the polygons.

## Examples

CodeSandbox with Orbital controls – https://codesandbox.io/s/modest-tharp-4oihk

CodePen with static generation (no orbital controls) https://codepen.io/pbojinov/pen/NwexpM.


# Resources

* https://threejs.org/docs/index.html#api/loaders/TextureLoader

* https://threejs.org/docs/#examples/en/controls/OrbitControls

* http://danni-three.blogspot.com/2013/09/threejs-heightmaps.html

* https://github.com/neilcarpenter/Video-filter-effects-for-canvas

* http://html5doctor.com/video-canvas-magic/


## Cloudflare static deployment

Local checkout: `/Users/petar/dev/heightmap.club`. Use Node 24 LTS.

```sh
npm ci
npm run build
python3 -m http.server 4174 --bind 127.0.0.1 --directory dist
```

The `dist/` folder contains only public browser assets. Deploy it as the Cloudflare Worker `heightmap` in the existing account, with custom domain `https://heightmap.petarbojinov.com`. The `wrangler.jsonc` configuration is ready for `npx wrangler deploy` after Wrangler authentication. Domains remain managed in the Cloudflare dashboard so deployments do not replace their settings.

Embed in a blog post:

```html
<iframe
  src="https://heightmap.petarbojinov.com/"
  title="Image height map"
  loading="lazy"
  style="width: 100%; height: 640px; border: 0;"
  allow="fullscreen"
></iframe>
```

Add a normal link to the demo as an alternative for readers who prefer a separate tab.

### Mobile interaction fix

Orbit controls bind to the rendering canvas. Touch start/move listeners are explicitly non-passive and cancel native scrolling while interacting with the model; overscroll is disabled inside this full-screen demo. The camera fits the image to the current aspect ratio and device pixel ratio is capped at 2. Build output versions the changed CSS and control scripts by content hash so existing browsers receive fixes after a reload.

The local touch regression fixture failed before the fix (neither touch start nor move cancelled) and passes after it (both cancelled, camera moves). Verified at 390×844 CSS pixels.
