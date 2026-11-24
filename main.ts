// Tiny stack VM: faithful interpreter of make.fun's tiny stack ISA v1. V packs each
// opcode's (pops,pushes,immediate): code-48 = pops*16+pushes*4+imm2+1, imm2 0,1,2,3 =
// 0,1,2,4 immediate bytes; '0' = not an opcode.
import{readdirSync as R,readFileSync as r,writeFileSync as w,mkdirSync as m}from"node:fs";
const V="168AIY]m00000000UUUUUUUEUUUEUUU0UUU00000000000003CC3100000000000EQ00000000000000AA5A";
function run(p,q){
 const D=[],C=[],M=[],o=new Uint8Array(65536);
 let s=0,c=0,pc=0,ip=0,t=0,n=0;
 const T=e=>[o.slice(0,n),e];
 for(;;){
  if(t==1e6)return T(10);
  if(pc<0||pc>=p.length)return T(9);
  const x=p[pc];
  let z=V.charCodeAt(x)-48;
  if(!z)return T(5);
  z--;
  let g=z&3;
  if(g==3)g=4;
  const a=z>>4,b=z>>2&3;
  if(pc+g>=p.length)return T(9);
  t++;
  pc+=1+g;
  if(s<a||s-a+b>256)return T(s<a?2:3);
  const v=D[s-1];
  if(x<8){
   if(x==0)return T(0);
   else if(x==1)D[s++]=(p[pc-1]<<24)>>24;
   else if(x==2)D[s++]=p[pc-4]|p[pc-3]<<8|p[pc-2]<<16|p[pc-1]<<24;
   else if(x==3)s--;
   else if(x==4)D[s]=D[s-1],s++;
   else if(x==5){const h=D[s-1];D[s-1]=D[s-2];D[s-2]=h}
   else if(x==6)D[s]=D[s-2],s++;
   else{const h=D[s-3];D[s-3]=D[s-2];D[s-2]=D[s-1];D[s-1]=h}
  }else if(x==23||x==27)D[s-1]=x==23?-v|0:~v;
  else if(a==2&&b==1){
   const k=x-16,u=D[s-2],U=u>>>0,W=v>>>0;
   if(v==0&&k>=3&&k<=6)return T(4);
   s-=2;
   D[s++]=[u+v|0,u-v|0,Math.imul(u,v),(u/v)|0,u%v|0,U/W|0,U%W|0,0,u&v,u|v,u^v,0,u<<v,u>>v,u>>>v|0,0,+(u==v),+(u<v),+(U<W)][k];
  }else if(x>=48&&x<=52){
   if(x==52){
    if(c==0)return T(8);
    pc=C[--c];
   }else if(x==51){
    if(c==64)return T(7);
    C[c++]=pc;
    pc=p[pc-2]|p[pc-1]<<8;
   }else{
    const e=((p[pc-2]|p[pc-1]<<8)<<16)>>16;
    let f=1;
    if(x!=48){const j=D[--s];f=x==49?j==0:j!=0}
    if(f)pc+=e;
   }
  }else if(x==64){
   if(v<0||v>255)return T(6);
   D[s-1]=M[v]|0;
  }else if(x==65){
   const u=D[s-2];
   if(v<0||v>255)return T(6);
   s-=2;
   M[v]=u;
  }else if(x==80){
   const h=String(v);
   if(n+h.length>65536)return T(11);
   s--;
   for(const ch of h)o[n++]=ch.charCodeAt(0);
  }else if(x==81){
   if(n==65536)return T(11);
   o[n++]=D[--s]&255;
  }else if(x==82)D[s++]=ip<q.length?q[ip++]:-1;
  else return T(D[--s]&255);
 }
}
const I=process.env.MAKEFUN_INPUT_DIR||"/input",O=process.env.MAKEFUN_OUTPUT_DIR||"/output";
for(const d of R(I).sort()){
 const P="/"+d+"/",z=run(r(I+P+"program.bin"),r(I+P+"input.bin"));
 m(O+P,{recursive:true});
 w(O+P+"stdout.bin",z[0]);
 w(O+P+"exit.txt",z[1]+"\n");
}
