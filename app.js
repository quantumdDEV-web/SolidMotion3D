import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";
import {OrbitControls} from "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/controls/OrbitControls.js";

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x030811);
const camera=new THREE.PerspectiveCamera(48,1,.05,100);
camera.position.set(7,5.5,8);
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.shadowMap.enabled=true;
document.querySelector("#scene").appendChild(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;controls.target.set(0,.3,0);

scene.add(new THREE.HemisphereLight(0x9fcfff,0x07101e,2));
const key=new THREE.DirectionalLight(0xffffff,3);key.position.set(5,8,6);key.castShadow=true;scene.add(key);
const fill=new THREE.PointLight(0x168fff,18,14);fill.position.set(-4,3,4);scene.add(fill);

const grid=new THREE.GridHelper(14,28,0x29435e,0x142438);grid.position.y=-1.15;scene.add(grid);

function axis(color,dir,len=1.7){
 const g=new THREE.Group(),mat=new THREE.LineBasicMaterial({color});
 g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),dir.clone().multiplyScalar(len)]),mat));
 const cone=new THREE.Mesh(new THREE.ConeGeometry(.055,.18,12),new THREE.MeshBasicMaterial({color}));
 cone.position.copy(dir.clone().multiplyScalar(len));cone.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir);g.add(cone);
 return g;
}
const worldAxes=new THREE.Group();
worldAxes.add(axis(0xff5268,new THREE.Vector3(1,0,0)));
worldAxes.add(axis(0x54df91,new THREE.Vector3(0,1,0)));
worldAxes.add(axis(0x4fa8ff,new THREE.Vector3(0,0,1)));
worldAxes.position.set(0,-1.1,0);scene.add(worldAxes);

const body=new THREE.Group();scene.add(body);
const mesh=new THREE.Mesh(new THREE.BoxGeometry(2,1.35,1.15),new THREE.MeshStandardMaterial({color:0x168fff,metalness:.42,roughness:.25,transparent:true,opacity:.9}));
mesh.castShadow=true;mesh.receiveShadow=true;body.add(mesh);
body.add(new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry),new THREE.LineBasicMaterial({color:0xc6e5ff})));
const bodyAxes=new THREE.Group();
bodyAxes.add(axis(0xff5268,new THREE.Vector3(1,0,0)));
bodyAxes.add(axis(0x54df91,new THREE.Vector3(0,1,0)));
bodyAxes.add(axis(0x4fa8ff,new THREE.Vector3(0,0,1)));
body.add(bodyAxes);

const point=new THREE.Mesh(new THREE.SphereGeometry(.09,16,16),new THREE.MeshBasicMaterial({color:0xffffff}));point.position.set(1,.25,.45);body.add(point);
const trailGeom=new THREE.BufferGeometry(),trailPts=[];
const trailLine=new THREE.Line(trailGeom,new THREE.LineBasicMaterial({color:0x39a7ff,transparent:true,opacity:.72}));scene.add(trailLine);
const velocityArrow=new THREE.ArrowHelper(new THREE.Vector3(1,0,0),new THREE.Vector3(),1,0xffd166,.12,.07);scene.add(velocityArrow);
const nodal=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2,0,0),new THREE.Vector3(2,0,0)]),new THREE.LineBasicMaterial({color:0xd47cff,transparent:true,opacity:.75}));scene.add(nodal);

const $=id=>document.getElementById(id);
const state={playing:false,t:0,mode:"general",px:0,py:.4,pz:0,psi:35,theta:25,phi:60};
function setText(id,v){$(id).textContent=v}
function bindRange(id,key,out,dec=2){$(id).addEventListener("input",e=>{state[key]=+e.target.value;setText(out,Number(state[key]).toFixed(dec));updateReadouts(state.psi,state.theta,state.phi)})}
bindRange("px","px","pxv");bindRange("py","py","pyv");bindRange("pz","pz","pzv");
$("psi").oninput=e=>{state.psi=+e.target.value;setText("psiv",state.psi+"°");updateReadouts(state.psi,state.theta,state.phi)};
$("theta").oninput=e=>{state.theta=+e.target.value;setText("thetav",state.theta+"°");updateReadouts(state.psi,state.theta,state.phi)};
$("phi").oninput=e=>{state.phi=+e.target.value;setText("phiv",state.phi+"°");updateReadouts(state.psi,state.theta,state.phi)};
$("mode").onchange=e=>state.mode=e.target.value;
$("playBtn").onclick=()=>{state.playing=!state.playing;setText("playBtn",state.playing?"❚❚ Pause":"▶ Run")};
$("resetBtn").onclick=reset;
$("trail").onchange=e=>trailLine.visible=e.target.checked;
$("axes").onchange=e=>bodyAxes.visible=e.target.checked;
$("nodal").onchange=e=>nodal.visible=e.target.checked;
$("vectors").onchange=e=>velocityArrow.visible=e.target.checked;
$("gridToggle").onchange=e=>grid.visible=e.target.checked;
$("gridBtn").onclick=()=>grid.visible=!grid.visible;
$("homeView").onclick=()=>{camera.position.set(7,5.5,8);controls.target.set(0,.3,0);controls.update()};

document.querySelectorAll(".tab").forEach(btn=>btn.onclick=()=>{
 document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
 document.querySelectorAll(".tab-content").forEach(x=>x.classList.remove("active"));
 btn.classList.add("active");$(btn.dataset.tab).classList.add("active");
});

function updateReadouts(psi,theta,phi){
 setText("oriRead",`ψ ${psi}° · θ ${theta}° · φ ${phi}°`);
 setText("analysisAngles",`ψ=${psi}° · θ=${theta}° · φ=${phi}°`);
}
function reset(){
 state.playing=false;state.t=0;Object.assign(state,{px:0,py:.4,pz:0,psi:35,theta:25,phi:60});
 ["px","py","pz"].forEach((id,i)=>{$(id).value=[0,.4,0][i];setText(id+"v",[0,.4,0][i].toFixed(2))});
 ["psi","theta","phi"].forEach((id,i)=>$(id).value=[35,25,60][i]);
 setText("psiv","35°");setText("thetav","25°");setText("phiv","60°");setText("playBtn","▶ Run");
 trailPts.length=0;trailGeom.setFromPoints([]);
 updateReadouts(35,25,60);
}

function rotationQuaternion(psi,theta,phi){
 const d=THREE.MathUtils.degToRad;
 const qPsi=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1),d(psi));
 const qTheta=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),d(theta));
 const qPhi=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),d(phi));
 return qPsi.multiply(qTheta).multiply(qPhi);
}
const clock=new THREE.Clock();
function animate(){
 requestAnimationFrame(animate);
 const dt=Math.min(clock.getDelta(),.04);
 if(state.playing)state.t+=dt;
 const t=state.t;
 let x=state.px,y=state.py,z=state.pz,psi=state.psi,theta=state.theta,phi=state.phi;
 let v=new THREE.Vector3();
 if(state.playing){
   if(state.mode==="translation"||state.mode==="general"){x=state.px+1.1*Math.sin(t*.65);z=state.pz+.8*Math.cos(t*.65)-.8;y=state.py+.25*Math.sin(t*1.1);v.set(.715*Math.cos(t*.65),.275*Math.cos(t*1.1),-.52*Math.sin(t*.65))}
   if(state.mode==="rotation"){psi=state.psi+t*45;v.set(0,0,0)}
   if(state.mode==="euler"){psi=state.psi+t*35;theta=state.theta+12*Math.sin(t*.8);phi=state.phi+t*80;v.set(.3*Math.cos(t),.2*Math.sin(t),.3*Math.cos(t*.5))}
   if(state.mode==="rolling"){x=state.px+t*.55-1.5;phi=state.phi+t*55;v.set(.55,0,0)}
 }
 body.position.set(x,y,z);
 body.quaternion.copy(rotationQuaternion(psi,theta,phi));
 const worldPoint=point.getWorldPosition(new THREE.Vector3());
 trailPts.push(worldPoint.clone());if(trailPts.length>300)trailPts.shift();trailGeom.setFromPoints(trailPts);
 velocityArrow.position.copy(worldPoint);
 const speed=v.length();if(speed>.0001)velocityArrow.setDirection(v.clone().normalize());
 velocityArrow.setLength(Math.min(1.8,Math.max(.12,speed*1.8)));
 const ks=new THREE.Vector3(0,1,0).applyQuaternion(body.quaternion);
 nodal.position.set(x,y,z);nodal.setRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),ks));

 const wx=(Math.sin(t)*.4+(state.mode==="euler"?.6:0));
 const wy=Math.cos(t)*.3;
 const wz=(state.mode==="rotation"?.78:.35)+Math.sin(t*.7)*.12;
 const wm=Math.sqrt(wx*wx+wy*wy+wz*wz);
 setText("wx",wx.toFixed(2));setText("wy",wy.toFixed(2));setText("wz",wz.toFixed(2));setText("wm",wm.toFixed(2));
 setText("simTime",`t = ${t.toFixed(2)} s`);
 setText("posRead",`${x.toFixed(2)} · ${y.toFixed(2)} · ${z.toFixed(2)} m`);
 setText("analysisPos",`Oₛ = (${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)}) m`);
 setText("analysisOmega",`|ω| = ${wm.toFixed(2)} rad/s`);
 setText("pointWorld",`P₀ = (${worldPoint.x.toFixed(2)}, ${worldPoint.y.toFixed(2)}, ${worldPoint.z.toFixed(2)}) m`);
 controls.update();
 const w=document.querySelector("#scene").clientWidth,h=document.querySelector("#scene").clientHeight;
 if(renderer.domElement.width!==Math.floor(w*renderer.getPixelRatio())||renderer.domElement.height!==Math.floor(h*renderer.getPixelRatio())){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
 renderer.render(scene,camera);
 fps();
}
let frames=0,lastFps=performance.now();
function fps(){frames++;if(performance.now()-lastFps>1000){setText("fps",frames);frames=0;lastFps=performance.now()}}
updateReadouts(35,25,60);animate();