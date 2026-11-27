const $=id=>document.getElementById(id);
const hdr=$('hdr');
const onScroll=()=>hdr.classList.toggle('solid',scrollY>30);
addEventListener('scroll',onScroll,{passive:true});onScroll();
$('menu').onclick=()=>{const o=$('nav').classList.toggle('open');$('menu').setAttribute('aria-expanded',o)};
$('nav').addEventListener('click',()=>$('nav').classList.remove('open'));
$('yr').textContent=new Date().getFullYear();
// tilt
const stage=$('stage'),stack=$('stack');
if(matchMedia('(hover:hover)').matches&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
  stage.addEventListener('mousemove',e=>{const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;stack.style.transform=`rotateY(${x*14}deg) rotateX(${-y*12}deg)`});
  stage.addEventListener('mouseleave',()=>stack.style.transform='');
}
// reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.rv').forEach((el,i)=>{el.style.transitionDelay=(i%4)*80+'ms';io.observe(el)});
