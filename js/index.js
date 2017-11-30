'use strict';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function buildCube() {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
}

// buildCube();

// var loader = new THREE.TextureLoader();
// loader.load(
//     // resource URL
//     'assets/map_small.png',
//     imageUrl,
//     // Function when resource is loaded
//     function(texture) {
//         console.log('done loading', texture);
//         // var geometry = new THREE.PlaneGeometry(5, 20, 32);
//         // in this example we create the material when the texture is loaded
//         // var material = new THREE.MeshBasicMaterial({ map: texture });
//         // var material = new THREE.MeshLambertMaterial({ map: texture });
//         // var plane = new THREE.Mesh(geometry, material);
//         // scene.add(plane);
//         // var geometry = new THREE.BoxGeometry(1, 1, 1);
//         // var material = new THREE.MeshBasicMaterial({ map: texture });
//         // var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
//         // var cube = new THREE.Mesh(geometry, material);
//         // scene.add(cube);
//     },
//     // Function called when download progresses
//     function(xhr) {
//         console.log('done loading');
//         console.log(xhr.loaded / xhr.total * 100 + '% loaded');
//     },
//     // Function called when download errors
//     function(xhr) {
//         console.error('An error happened', xhr);
//     }
// );

// var geometry = new THREE.PlaneGeometry(5, 20, 32);
// var material = new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe: true} );
// const texture = new THREE.TextureLoader().load(imageUrl);
// const texture = THREE.ImageUtils.loadTexture(imageUrl);
// const material = new THREE.MeshLambertMaterial({ map: texture });
// const material = new THREE.MeshLambertMaterial({color: 0xffff00});
// var plane = new THREE.Mesh(geometry, material);
// scene.add(plane);

camera.position.z = 100;

function animate() {
    requestAnimationFrame(animate);
    // if (cube) {
    // 	cube.rotation.x -= 0.01;
    // 	cube.rotation.y += 0.01;
    // }
    renderer.render(scene, camera);
}

animate();

function getHeightData(image) {
    var scale = 1;
    var size = image.width * image.height;
    var data = new Float32Array(size);
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);
    // document.body.appendChild(canvas);
    for (var i = 0; i < size; i++) {
        data[i] = 0;
    }
    var imageData = context.getImageData(0, 0, image.width, image.height);
    var pixels = imageData.data;
    var j = 0;
    for (var i = 0; i < pixels.length; i += 4) {
        // why 4??
        var all = pixels[i] + pixels[i + 1] + pixels[i + 2];
        data[j++] = all / (12 * scale);
    }
    return data;
}

function main() {
    var data = getHeightData(image);
    console.log(data);
    // PlaneGeometry(width, height, widthSegments, heightSegments)
    // https://threejs.org/docs/index.html#api/geometries/PlaneGeometry
    const geometry = new THREE.PlaneGeometry(image.width / 4, image.height / 4, image.width - 1, image.height - 1);
    // TODO: loading a texture doesnt work
    // var geometry = new THREE.PlaneGeometry(10, 10, 5, 5);
    // var texture = new THREE.TextureLoader().load(imageUrl);
    // var material = new THREE.MeshLambertMaterial({ map: texture });
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    var plane = new THREE.Mesh(geometry, material);

    // set the height of the verticies
    for (var i = 0; i < plane.geometry.vertices.length; i++) {
        plane.geometry.vertices[i].z = data[i];
    }
    scene.add(plane);
}

// const imageUrl = "https://upload.wikimedia.org/wikipedia/commons/5/57/Heightmap.png";
// var imageUrl = "https://3.bp.blogspot.com/-IOkIz3Eezc4/Uiyl-h4LmdI/AAAAAAAAANs/NByTUB4UZ1U/s1600/heightmap2_big.png";
// var imageUrl = 'assets/map_small.png';
var imageUrl = 'assets/clouds.png';
var image = new Image();
// this prevents the following error: "The canvas has been tainted by cross-origin data"
// https://stackoverflow.com/a/27840082/907388
image.crossOrigin = 'Anonymous';
image.onload = function() {
    main();
};
image.onerror = function() {
    console.error('error loading image');
};
image.src = imageUrl;

// document.getElementById('app').appendChild(img);
