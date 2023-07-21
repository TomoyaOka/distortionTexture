import { ShaderMaterial,PlaneGeometry,Mesh ,TextureLoader,Vector2} from "three";
import vertexShader from "../shader/vertex.glsl?raw";
import fragmentShader from "../shader/fragment.glsl?raw";

import { gsap,Power4 } from "gsap";

export default class Model {
  constructor(stage) {
    this.stage = stage;
    this.geometry;
    this.material;
    this.mesh;
    this.loader = new TextureLoader();

    this.mouse = new Vector2(0.0,0.0);

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.tl = gsap.timeline();
    this.imageButton01 = document.querySelector('#button01');
    this.imageButton02 = document.querySelector('#button02');
  }

  _init() {
    this.createMesh();
    this._setAnimation();
  }

  createMesh() {
    const size = {
      x:2,
      y:2,
    }

    const texture = this.loader.load("../img01.jpg");
    const texture02 = this.loader.load("../img02.jpg");
    this.disp = this.loader.load("../noise.png");
    const uniforms = {
      uResolution: {
        value: new Vector2(this.width,this.height),
      },
      uImageResolution: {
        value: new Vector2(2048, 1356),
      },
      uCenter:{
        value:new Vector2(0.5, 0.5),
      },
      uTexture: {
        value: texture,
      },
      uNextTexture: {
        value:texture02
      },
      disp: { 
        value: this.disp //noise-map
      },
      uPower: {
        value:0.0 //変化の強度
      },
      uChangeTransition:{
        value:0.0 //変化の経過時間
      },
    }
    
    this.geometry = new PlaneGeometry(size.x,size.y);
    this.material = new ShaderMaterial({
      uniforms:uniforms,
      vertexShader: vertexShader,
      fragmentShader:fragmentShader
    });
    this.mesh = new Mesh(this.geometry,this.material);
    this.stage.scene.add(this.mesh);


  }

  powerChange() {
    this.tl.to(this.mesh.material.uniforms.uPower,{
      value:1.0,
      ease:Power4.easeOut,
      duration:0.75
    }).to(this.mesh.material.uniforms.uPower,{
      value:0.0,
      ease:Power4.easeOut,
      duration:0.75
    })
  }

  _setAnimation() {
    let className = "--none";
    this.imageButton01.addEventListener('click',()=>{
      gsap.to(this.mesh.material.uniforms.uChangeTransition,{
        value:0.0,
        ease:Power4.easeOut,
        duration:1.5
      })
      this.powerChange();

      this.imageButton01.classList.add(className);
      this.imageButton02.classList.remove(className);
    });
    this.imageButton02.addEventListener('click',()=>{
      gsap.to(this.mesh.material.uniforms.uChangeTransition,{
        value:1.0,
        ease:Power4.easeOut,
        duration:1.5
      })
      this.powerChange();
      this.imageButton01.classList.remove(className);
      this.imageButton02.classList.add(className);
    });
  }


  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.mesh.material.uniforms.uResolution.value.set(this.width,this.height);
  }
}