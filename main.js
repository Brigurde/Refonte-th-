let up = false;
let down = false;
let rerender = false;
let hauteurParcourue = 0
let mesh, light, ambient, loader, camera, teaBoxes = [], scene, renderer, meshes = [], activeTea = 1, rotY = 0
let root = document.documentElement;

let els = [
 {color: "red", title: "titre partie red"},
 {color: "lightblue", title: "titre partie blue"},
 {color: "lightgreen", title: "titre partie green"},
 {color: "purple", title: "titre partie green"}
]
renderHTML()
initializeThree()
renderer.render( scene, camera );

function initializeThree(){

 createjs.Ticker.framerate = 120;

 //camera
 camera = new THREE.PerspectiveCamera( 45, window.innerWidth*0.3 / window.innerHeight, 0.1, 1000 );
 camera.position.set(-1.5,2,5);
 camera.lookAt(0,1,0)

 //renderer
 renderer = new THREE.WebGLRenderer({ alpha: true });
 renderer.setSize( window.innerWidth*0.3, window.innerHeight );
 renderer.setClearColor(0x000000, 0); 
 renderer.gammaOutput = true;
 document.body.appendChild( renderer.domElement );

 //lighting
 ambient = new THREE.AmbientLight("#85b2cd");
 light = new THREE.DirectionalLight("#c1582d", 1);
 light.position.set( 0, -70, 100 ).normalize();

 //scene
 scene = new THREE.Scene();
 scene.add(light);
 scene.add(ambient);

 //loader
 loader = new THREE.GLTFLoader();
 els.forEach((el, i) => {
  loader.load(
   // resource URL
   './assets/boite1.glb',
   // called when the resource is loaded
   function ( gltf ) {
    mesh = gltf.scene;
    meshes.push(mesh)
    mesh.scale.set( 10, 10, 10 );
    scene.add( mesh );
    mesh.position.set(0,3*i-3,0)
    mesh.rotation.y = 0
   },
   // called when loading is in progresses
   function ( xhr ) {
    if(xhr.loaded == xhr.total){
     animate();
    }
   },
   // called when loading has errors
   function ( error ) {
    console.log( 'An error happened' );
   }
   );
  })
 document.querySelector('.wrapper').appendChild( renderer.domElement );
}
 
 function animate() {
 requestAnimationFrame( animate )
 render()
}
function render(){
  if(meshes[activeTea]){
     meshes[activeTea].rotation.y += rotY
  }
 renderer.render( scene, camera );
}

document.addEventListener('mousemove', (e)=>{
  rotY = e.clientX / window.innerWidth * 0.02;
})

let animComplete = true
window.addEventListener('wheel', (e) => {
  if(animComplete && !navActive){
  animComplete = false
  meshes.forEach((mesh, i) => {
   var position = mesh.position;
   var newY
   if(e.wheelDeltaY > 0){
    if(meshes[i+1]){
     newY = meshes[i+1].position.y
    }else{
     newY = meshes[0].position.y
    }
   }else{
    if(meshes[i-1]){
     newY = meshes[i-1].position.y
    }else{
     newY = meshes[meshes.length-1].position.y
    }
   }
    var target = { x: position.x, y: newY };
    var tween = new createjs.Tween(position)
    .to(target, 1000, createjs.Ease.cubicOut)
    .call(()=>{
     animComplete = true
    })
  })
  rerenderContent(e.wheelDeltaY>0?-1:1)
 }
})

function rerenderContent(newActiveTea){
 if(newActiveTea == 1){
  if(meshes[activeTea + 1]){
   activeTea++
   if(meshes[activeTea + 1] != meshes[activeTea]){
    rerender = true
   }
  }else{
   activeTea = 0
   if(meshes[0] != meshes[activeTea]){
    rerender = true
   }
  }
 }else{
  if(meshes[activeTea - 1]){
   activeTea--
   if(meshes[activeTea - 1] != meshes[activeTea]){
    rerender = true
   }
  }else{
   activeTea = meshes.length-1
   if(meshes[meshes.length-1] != meshes[activeTea]){
    rerender = true
   }
  }
}
console.log(activeTea);
 if(rerender){
  renderHTML(true)
 }
}

function renderHTML(isRerender){
  // root.style.setProperty('--activeColor', els[activeTea].color);
  if(!isRerender){
    document.querySelector('.content .title span').classList.add('active')
    setTimeout(() => {
      document.querySelector('.content').classList.add('ready')
    }, 600);
  }else{
    document.querySelector('.content .title span').classList.remove('active')
    document.querySelector('.content').classList.remove('ready')
    document.querySelector('.content').classList.add('disappear')
    setTimeout(()=>{
      document.querySelector('.content .title span').classList.add('active')
      document.querySelector('.content').classList.remove('contentTransition')
      document.querySelector('.content').classList.remove('disappear')
      document.querySelector('.content').classList.add('contentTransition')
      setTimeout(() => {
        document.querySelector('.content').classList.add('ready')
      }, 700);
      },700)
      document.querySelector('.content').classList.add('ready')
  }
}