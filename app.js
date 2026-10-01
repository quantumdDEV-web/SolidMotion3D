import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";
import {OrbitControls} from "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/controls/OrbitControls.js";

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x050914);
const camera=new THREE.PerspectiveCamera(48,1,.05,100);
camera.position.set(7,5.5,8);
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.shadowMap.enabled=true;
document.querySelector("#scene").appendChild(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;controls.target.set(0,.5,0);

scene.add(new THREE.HemisphereLight(0x9fcfff,0x07101e,2));
const key=new THREE.DirectionalLight(0xffffff,3);key.position.set(5,8,6);key.castShadow=true;scene.add(key);

const grid=new THREE.GridHelper(12,24,0x29435e,0x142438);grid.position.y=-1.15;scene.add(grid);
const origin=new THREE.Group();scene.add(origin);

function axis(color,dir,len=1.7){
 const g=new THREE.Group(); const mat=new THREE.LineBasicMaterial({color});
 const pts=[new THREE.Vector3(),dir.clone().multiplyScalar(len)];
 g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),mat));
 const cone=new THREE.Mesh(new THREE.ConeGeometry(.055,.18,12),new THREE.MeshBasicMaterial({color}));
 cone.position.copy(dir.clone().multiplyScalar(len));cone.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir);g.add(cone);return g;
}
const worldAxes=new THREE.Group();
worldAxes.add(axis(0xff5268,new THREE.Vector3(1,0,0)));
worldAxes.add(axis(0x54df91,new THREE.Vector3(0,1,0)));
worldAxes.add(axis(0x4fa8ff,new THREE.Vector3(0,0,1)));
worldAxes.position.set(0,-1.1,0);scene.add(worldAxes);

const body=new THREE.Group();scene.add(body);
const mesh=new THREE.Mesh(new THREE.BoxGeometry(2,1.35,1.15),new THREE.MeshStandardMaterial({color:0x168fff,metalness:.35,roughness:.28,transparent:true,opacity:.88}));
mesh.castShadow=true;mesh.receiveShadow=true;body.add(mesh);
const edge=new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry),new THREE.LineBasicMaterial({color:0xb8dcff}));body.add(edge);

const bodyAxes=new THREE.Group();
bodyAxes.add(axis(0xff5268,new THREE.Vector3(1,0,0)));
bodyAxes.add(axis(0x54df91,new THREE.Vector3(0,1,0)));
bodyAxes.add(axis(0x4fa8ff,new THREE.Vector3(0,0,1)));
body.add(bodyAxes);

const point=new THREE.Mesh(new THREE.SphereGeometry(.09,16,16),new THREE.MeshBasicMaterial({color:0xffffff}));
point.position.set(1,0.25,.45);body.add(point);

const trailGeom=new THREE.BufferGeometry();const trailPts=[];const trailLine=new THREE.Line(trailGeom,new THREE.LineBasicMaterial({color:0x39a7ff,transparent:true,opacity:.7}));scene.add(trailLine);

const velocityArrow=new THREE.ArrowHelper(new THREE.Vector3(1,0,0),new THREE.Vector3(),1,0xffd166,.12,.07);scene.add(velocityArrow);
const nodal=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2,0,0),new THREE.Vector3(2,0,0)]),new THREE.LineBasicMaterial({color:0xd47cff,transparent:true,opacity:.75}));scene.add(nodal);

const $=id=>document.getElementById(id);
const state={playing:false,t:0,last:performance.now(),lastFps:performance.now(),frames:0,mode:"general",pos:[0,.4,0],psi:35,theta:25,phi:60};
function bindRange(id,key,out,suffix=""){const el=$(id);el.addEventListener("input",()=>{state[key]=+el.value;$(out).textContent=Number(el.value).toFixed(key==="px"||key==="py"||key==="pz"?2:0)+suffix;});}
bindRange("px","px","pxv");bindRange("py","py","pyv");bindRange("pz","pz","pzv");
$("psi").oninput=e=>{state.psi=+e.target.value;$("psiv").textContent=state.psi+"°"};
$("theta").oninput=e=>{state.theta=+e.target.value;$("thetav").textContent=state.theta+"°"};
$("phi").oninput=e=>{state.phi=+e.target.value;$("phiv").textContent=state.phi+"°"};
$("mode").onchange=e=>{state.mode=e.target.value;$("modeBadge").textContent=e.target.options[e.target.selectedIndex].text.toUpperCase()};
$("playBtn").onclick=()=>{state.playing=!state.playing;$("playBtn").textContent=state.playing?"❚❚ Pause":"▶ Play"};
$("resetBtn").onclick=()=>{state.t=0;state.px=0;state.py=.4;state.pz=0;state.psi=35;state.theta=25;state.phi=60;["px","py","pz"].forEach((id,i)=>{$(id).value=[0,.4,0][i];$(id+"v").textContent=[0,.4,0][i].toFixed(2)});$("psi").value=35;$("theta").value=25;$("phi").value=60;$("psiv").textContent="35°";$("thetav").textContent="25°";$("phiv").textContent="60°";trailPts.length=0};
$("trail").onchange=e=>trailLine.visible=e.target.checked;
$("axes").onchange=e=>bodyAxes.visible=e.target.checked;
$("nodal").onchange=e=>nodal.visible=e.target.checked;
$("vectors").onchange=e=>velocityArrow.visible=e.target.checked;

function zxz(psi,theta,phi){
 const e=new THREE.Euler(THREE.MathUtils.degToRad(theta),0,0,"XYZ");
 const qPsi=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(psi));
 const qTheta=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),THREE.MathUtils.degToRad(theta));
 const qPhi=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(phi));
 return qPsi.multiply(qTheta).multiply(qPhi);
}
const clock=new THREE.Clock();
function animate(){
 requestAnimationFrame(animate);
 const dt=Math.min(clock.getDelta(),.04);
 if(state.playing)state.t+=dt;
 const t=state.t;
 let x=+state.px,y=+state.py,z=+state.pz,psi=state.psi,theta=state.theta,phi=state.phi;
 if(state.playing){
   if(state.mode==="translation"||state.mode==="general"){x=state.px+1.1*Math.sin(t*.65);z=state.pz+.8*Math.cos(t*.65)-.8; y=state.py+.25*Math.sin(t*1.1)}
   if(state.mode==="rotation"){psi=state.psi+t*45}
   if(state.mode==="euler"){psi=state.psi+t*35;theta=state.theta+12*Math.sin(t*.8);phi=state.phi+t*80}
   if(state.mode==="rolling"){x=state.px+t*.55-1.5; y=state.py;z=state.pz;phi=state.phi+t*55}
 }
 body.position.set(x,y,z);
 body.quaternion.copy(zxz(psi,theta,phi));
 const worldPoint=point.getWorldPosition(new THREE.Vector3());
 trailPts.push(worldPoint.clone());if(trailPts.length>280)trailPts.shift();trailGeom.setFromPoints(trailPts);
 const v=new THREE.Vector3();
 if(state.playing){v.set(.715*Math.cos(t*.65),.275*Math.cos(t*1.1),-.52*Math.sin(t*.65));if(state.mode==="rotation")v.set(0,0,0)}
 velocityArrow.position.copy(worldPoint);if(v.lengthSq()>.0001)velocityArrow.setDirection(v.normalize());velocityArrow.setLength(Math.min(1.8,Math.max(.15,v.length()*1.8)));
 const ks=new THREE.Vector3(0,1,0).applyQuaternion(body.quaternion);
 nodal.position.set(x,y,z);nodal.setRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),ks));
 $("wx").textContent=(Math.sin(t)*.4+(state.mode==="euler"?0.6:0)).toFixed(2);
 $("wy").textContent=(Math.cos(t)*.3).toFixed(2);
 $("wz").textContent=((state.mode==="rotation"?0.78:0.35)+Math.sin(t*.7)*.12).toFixed(2);
 controls.update();
 const w=renderer.domElement.clientWidth,h=renderer.domElement.clientHeight;if(renderer.domElement.width!==w*devicePixelRatio||renderer.domElement.height!==h*devicePixelRatio){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
 renderer.render(scene,camera);
 state.frames++;if(performance.now()-state.lastFps>1000){$("fps").textContent=state.frames+" FPS";state.frames=0;state.lastFps=performance.now()}
}
animate();