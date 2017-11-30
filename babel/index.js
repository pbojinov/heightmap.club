const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function buildCube() {
	const geometry = new THREE.BoxGeometry( 1, 1, 1 );
	const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );
	const cube = new THREE.Mesh( geometry, material );
	scene.add( cube );	
}

var loader = new THREE.TextureLoader();

// load a resource
loader.load(
	// resource URL
	// 'textures/land_ocean_ice_cloud_2048.jpg',
	imageUrl,
	// Function when resource is loaded
	function ( texture ) {
		// in this example we create the material when the texture is loaded
		var material = new THREE.MeshBasicMaterial( {
			map: texture
		 } );
	},
	// Function called when download progresses
	function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	},
	// Function called when download errors
	function ( xhr ) {
		console.error( 'An error happened', xhr);
	}
);

var geometry = new THREE.PlaneGeometry( 5, 20, 32 );
// var material = new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe: true} );
// const texture = new THREE.TextureLoader().load(imageUrl);
// const texture = THREE.ImageUtils.loadTexture(imageUrl);
// const material = new THREE.MeshLambertMaterial({map: texture});
// const material = new THREE.MeshLambertMaterial({color: 0xffff00});
var plane = new THREE.Mesh( geometry, material );
scene.add(plane);
// buildCube();

camera.position.z = 15;

function animate() {
	requestAnimationFrame( animate );
	// if (cube) {
	// 	cube.rotation.x -= 0.01;
	// 	cube.rotation.y += 0.01;		
	// }
	renderer.render( scene, camera );
}

animate();

function getHeightData(image) {
	const scale = 1;
	const size = image.width * image.height;
	const data = new Float32Array(size);
	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d");
	canvas.width = image.width;
	canvas.height = image.height;
	context.drawImage(image, 0, 0);
	// document.body.appendChild(canvas);
	for (let i = 0; i < size; i++) {
		data[i] = 0;
	};
	const imageData = context.getImageData(0, 0, image.width, image.height);
	const pixels = imageData.data;
	let j = 0;
	for (let i = 0; i < pixels.length; i += 4 ) { // why 4??
		const all = pixels[i] + pixels[i+1] + pixels[i+2];
		data[j++] = all / (12 * scale);
	}
	return data;
}

function main() {
	const data = getHeightData(image);
	console.log(data);
	// PlaneGeometry(width, height, widthSegments, heightSegments)
	// https://threejs.org/docs/index.html#api/geometries/PlaneGeometry
	// const geometry = new THREE.PlaneGeometry(image.width, image.height, image.width-1, image.height-1);
	const geometry = new THREE.PlaneGeometry(10, 10, 5, 5);
	const texture = new THREE.TextureLoader().load(imageUrl);
	const material = new THREE.MeshLambertMaterial({map: texture});
	const plane = new THREE.Mesh(geometry, material);

	// set the height of the verticies
	for (let i = 0; i < plane.geometry.vertices.length; i++) {
		plane.geometry.vertices[i].z = data[i];
	}
	scene.add(plane);
}

// const imageUrl = "https://upload.wikimedia.org/wikipedia/commons/5/57/Heightmap.png";
const imageUrl = "https://3.bp.blogspot.com/-IOkIz3Eezc4/Uiyl-h4LmdI/AAAAAAAAANs/NByTUB4UZ1U/s1600/heightmap2_big.png";
const image = new Image();
// this prevents the following error: "The canvas has been tainted by cross-origin data"
// https://stackoverflow.com/a/27840082/907388
image.crossOrigin = "Anonymous";
image.onload = function() {
	main();
};
image.onerror = function() {
	console.error('error loading image');
};
image.src = imageUrl;

// document.getElementById('app').appendChild(img);
