import * as THREE from 'three'

import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';


export default class ThreeCanvas {

  constructor (container) {
    this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 )
    this.camera.position.z = 250
    
    this.scene = new THREE.Scene();
    
    this.geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
    this.material = new THREE.MeshNormalMaterial();
    
    let temp = document.createElement('div')
    temp.classList.add('sexy')
    let txt = document.createTextNode("Hi there and greetings!")
    temp.appendChild(txt)


    this.elm = new CSS3DObject(
     temp 
    )
    this.scene.add( this.elm );
    
    this.renderer = new CSS3DRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight )

    this.ballControls = new TrackballControls( this.camera, this.renderer.domElement )
    
    this.ballControls.rotateSpeed = 1.0;
    this.ballControls.zoomSpeed = 1.2;
    this.ballControls.panSpeed = 0.8;
    this.ballControls.noZoom = false;
    this.ballControls.noPan = false;
    this.ballControls.staticMoving = true;
    this.ballControls.dynamicDampingFactor = 0.3;
    this.ballControls.keys = [ 65, 83, 68 ];

    this.orbitControls = new OrbitControls( this.camera, this.renderer.domElement )

    // this.controls.addEventListener( 'change', () => {
    //   this.animate()
    // })

    container.appendChild( this.renderer.domElement );
  }

  animate () {
    requestAnimationFrame(() => {
      this.animate()
    })

    this.orbitControls.update()
    this.ballControls.update()

    // this.elm.rotation.x += 0.01
    // this.elm.rotation.y += 0.02
    // this.elm.rotation.z += 0.02

    console.log( this.camera.rotation, this.camera.position)
  
    this.renderer.render( this.scene, this.camera )

  }

}
