/* ---------- Bank & card catalogue (researched snapshot, Nov 2026; verify with issuers) ---------- */
const BANKS=[
 ['Public sector banks',['State Bank of India (SBI Card)','Bank of Baroda (BOBCARD)','Punjab National Bank','Canara Bank','Union Bank of India','Bank of India','Indian Bank','Central Bank of India','Indian Overseas Bank','UCO Bank','Bank of Maharashtra','Punjab & Sind Bank']],
 ['Private sector banks',['HDFC Bank','ICICI Bank','Axis Bank','Kotak Mahindra Bank','IndusInd Bank','IDFC FIRST Bank','YES Bank','RBL Bank','Federal Bank','IDBI Bank','South Indian Bank','CSB Bank','Bandhan Bank','DCB Bank','Dhanlaxmi Bank','City Union Bank','Karnataka Bank','Karur Vysya Bank','Tamilnad Mercantile Bank','Jammu & Kashmir Bank','Nainital Bank']],
 ['Small finance banks',['AU Small Finance Bank','Equitas Small Finance Bank','Ujjivan Small Finance Bank','Jana Small Finance Bank','Utkarsh Small Finance Bank','ESAF Small Finance Bank','Suryoday Small Finance Bank','Capital Small Finance Bank','slice Small Finance Bank','Shivalik Small Finance Bank','Unity Small Finance Bank']],
 ['Foreign banks in India',['HSBC India','Standard Chartered','Citibank (now with Axis Bank)','DBS Bank India','SBM Bank India','Deutsche Bank','Other foreign bank']],
 ['Card issuers & co-brand platforms',['American Express','OneCard','Scapia','Other fintech co-brand card']],
 ['Others',['Regional Rural Bank (RRB)','Co-operative bank','Other / not listed']]
];
const CARDS={
 'State Bank of India (SBI Card)':['SBI Card ELITE','SBI Card AURUM','SBI Card PRIME','SBI Card PULSE','CASHBACK SBI Card','SimplyCLICK SBI Card','SimplySAVE SBI Card','SimplySAVE UPI RuPay SBI Card','SBI Card MILES','SBI Card MILES PRIME','SBI Card MILES ELITE','Tata Neu Infinity SBI Card','Tata Neu Plus SBI Card','Flipkart SBI Card','BPCL SBI Card','BPCL SBI Card OCTANE','IRCTC SBI Platinum Card','IRCTC SBI Card Premier','Air India SBI Signature','Air India SBI Platinum','Etihad Guest SBI Premier','Etihad Guest SBI Card','KrisFlyer SBI Card','KrisFlyer SBI Card Apex','Apollo SBI Card','Apollo SBI Card SELECT','PhonePe SBI Card SELECT BLACK','PhonePe SBI Card PURPLE','Paytm SBI Card SELECT','Paytm SBI Card','Reliance SBI Card PRIME','Reliance SBI Card','Titan SBI Card','Landmark Rewards SBI Card SELECT','Landmark Rewards SBI Card PRIME','Landmark Rewards SBI Card','Lifestyle Home Centre SBI Card','Max SBI Card','Spar SBI Card','Fabindia SBI Card','Doctor\'s SBI Card','SBI Card Unnati','Shaurya SBI Card','Shaurya SELECT SBI Card','Central SBI SELECT+ Card'],
 'Bank of Baroda (BOBCARD)':['BOBCARD Eterna','BOBCARD Premier','BOBCARD Select','BOBCARD Easy','BOBCARD Tiara','Etihad Guest BOBCARD Premium','Etihad Guest BOBCARD','HPCL BOBCARD ENERGIE','IRCTC BOBCARD','BOBCARD One','Scapia BOBCARD','BOBCARD Yoddha (defence)','BOBCARD Vikram (defence)','BOBCARD Varunah (Navy)','BOBCARD Empower (business)','BOBCARD Corporate'],
 'Punjab National Bank':['PNB RuPay Select','PNB RuPay Platinum','PNB RuPay Millennial','PNB Rakshak RuPay Select','PNB Rakshak RuPay Platinum','PNB Visa Signature','PNB Visa Platinum','PNB Visa Gold','PNB Visa Classic','PNB Wave & Pay','Patanjali PNB RuPay Select','Patanjali PNB RuPay Platinum','EaseMyTrip PNB RuPay','PNB Business / Corporate Card'],
 'Canara Bank':['Canara RuPay Select','Canara RuPay Platinum','Canara Visa Signature','Canara Visa Platinum','Canara Visa Gold','Canara Visa Classic','Canara Mastercard World','Canara Global Gold','Canara Corporate Card'],
 'Union Bank of India':['Union Bank RuPay Select','Union Bank RuPay Platinum','Union Bank Visa Signature','Union Bank Visa Platinum','Union Bank Visa Gold','Union Bank Uni-Carbon','Union Bank Business Card'],
 'Bank of India':['BOI RuPay Select','BOI RuPay Platinum','BOI Visa Signature','BOI Visa Platinum','BOI Visa Gold','BOI Visa Classic','BOI Mastercard World'],
 'Indian Bank':['Indian Bank RuPay Select','Indian Bank RuPay Platinum','Indian Bank Visa Gold','Indian Bank Visa Classic','Indian Bank MSME Prime','OneCard (Indian Bank)'],
 'Central Bank of India':['Cent RuPay Select','Cent RuPay Platinum','Cent Visa Gold','Cent Visa Classic'],
 'Indian Overseas Bank':['IOB RuPay Platinum','IOB RuPay Select','IOB Visa Platinum','IOB Visa Gold','IOB Visa Classic'],
 'UCO Bank':['UCO RuPay Select','UCO RuPay Platinum','UCO Visa Gold','UCO Visa Classic'],
 'Bank of Maharashtra':['Maha Bank RuPay Platinum','Maha Bank Visa Gold','Maha Bank Visa Classic'],
 'Punjab & Sind Bank':['PSB RuPay Select','PSB RuPay Platinum'],
 'HDFC Bank':['Infinia Metal Edition','Diners Club Black Metal Edition','Diners Club Privilege','Regalia Gold','Regalia','Marriott Bonvoy HDFC Bank','Millennia','MoneyBack+','Freedom','Swiggy HDFC Bank','Tata Neu Infinity HDFC Bank','Tata Neu Plus HDFC Bank','IndianOil HDFC Bank','IRCTC HDFC Bank','6E Rewards XL IndiGo HDFC Bank','6E Rewards IndiGo HDFC Bank','Shoppers Stop Black HDFC Bank','Shoppers Stop HDFC Bank','PhonePe HDFC Bank Ultimo','PhonePe HDFC Bank UNO','Paytm HDFC Bank SELECT','Paytm HDFC Bank','PIXEL Play','PIXEL Go','UPI RuPay Credit Card','Platinum Times','BizBlack Metal','BizPower','BizGrow','BizFirst','Business Regalia','Business MoneyBack','Doctor\'s Regalia'],
 'ICICI Bank':['Emeralde Private Metal','Emeralde','Sapphiro','Rubyx','Coral','Coral RuPay','Platinum Chip','Amazon Pay ICICI Bank','Times Black ICICI Bank','Emirates Skywards ICICI Bank Emeralde','Emirates Skywards ICICI Bank Sapphiro','Emirates Skywards ICICI Bank Rubyx','MakeMyTrip ICICI Bank Signature','MakeMyTrip ICICI Bank Platinum','Adani One ICICI Bank Signature','Adani One ICICI Bank Platinum','HPCL Super Saver','HPCL Coral','Manchester United Signature','Manchester United Platinum','Chennai Super Kings ICICI Bank','Parakram Select (defence)','Expressions','Instant Platinum','Business Advantage / Corporate'],
 'Axis Bank':['Primus','Burgundy Private','Magnus for Burgundy','Magnus','Reserve','Olympus','Atlas','Horizon','Select','Privilege','Rewards','MY Zone','Neo','ACE','Flipkart Axis Bank','Flipkart Axis Bank Super Elite','Airtel Axis Bank','IndianOil Axis Bank','IndianOil Axis Bank Premium','Samsung Axis Bank Infinite','Samsung Axis Bank Signature','Shoppers Stop Axis Bank','super.money Axis Bank','Fibe Axis Bank','LIC Axis Bank Signature','LIC Axis Bank Platinum','Pride Signature (defence)','Pride Platinum (defence)','Axis Bank Business Card'],
 'Kotak Mahindra Bank':['White Reserve','White','Solitaire','Zen Signature','Privy League Signature','League Platinum','Royale Signature','Kotak Air+','Cashback+','Myntra Kotak','PVR INOX Kotak','IndianOil Kotak','Essentia Platinum','Mojo Platinum','811 #DreamDifferent','Kotak UPI RuPay','Kotak Corporate Card'],
 'IndusInd Bank':['Pioneer Heritage Metal','Pioneer Legacy','Indulge','Crest','Celesta','Solitaire','Pinnacle','Iconia','Legend','Nexxt','Tiger','Platinum','Platinum Aura Edge','Duo','Samman RuPay','Platinum RuPay','EazyDiner Signature','EazyDiner Platinum','Avios Visa Infinite','IndusInd Business Card'],
 'IDFC FIRST Bank':['FIRST Private','Ashva','Mayura','FIRST Wealth','FIRST Select','FIRST Millennia','FIRST Classic','FIRST WOW!','FIRST Power+','FIRST Power','FIRST SWYP','FIRST EA₹N','FIRST Digital RuPay','LIC FIRST Select','LIC FIRST Classic','Club Vistara IDFC FIRST (legacy)','IDFC FIRST Business Card'],
 'YES Bank':['YES Marquee','YES Reserv','YES Private','YES Prosperity Edge','YES Prosperity Rewards Plus','YES Elite+','YES Select','YES Ace','YES Wellness Plus','YES Klick','YES BYOC','Kiwi YES Bank RuPay','POP-CLUB YES Bank','Paisabazaar PaisaSave YES Bank','YES Business Card'],
 'RBL Bank':['Insignia Preferred Banking World','Icon','World Safari','Platinum Maxima Plus','Platinum Delight','ShopRite','Edition','Cookies','Monthly Treats','Fun+','Popcorn','Play','Titanium Delight','iGlobe','IndianOil RBL Bank XTRA','IndianOil RBL Bank','Bajaj Finserv RBL Bank SuperCard','Paisa On Demand'],
 'Federal Bank':['Celesta','Imperio','Signet','Scapia Federal Bank','OneCard (Federal Bank)','Jupiter Edge+ (Federal Bank)','Federal Bank RuPay'],
 'IDBI Bank':['Royal Signature','Euphoria World','Aspire Platinum','Imperium Platinum','Winnings RuPay Select'],
 'South Indian Bank':['SIB Visa Platinum','SIB RuPay Select','OneCard (South Indian Bank)'],
 'CSB Bank':['Jupiter Edge CSB Bank RuPay','OneCard (CSB Bank)','CSB Bank Credit Card'],
 'Jammu & Kashmir Bank':['J&K Bank RuPay Platinum','J&K Bank Visa Platinum','J&K Bank Visa Gold','J&K Bank Visa Classic'],
 'Karnataka Bank':['Karnataka Bank Credit Card (partner-issued)'],
 'Karur Vysya Bank':['KVB Credit Card (partner-issued)'],
 'AU Small Finance Bank':['Zenith+','Zenith','Vetta','Altura Plus','Altura','LIT','SwipeUp','InstaPay','Xcite','ixigo AU','AU SPONT','ABC Flex / ABC NXT (Aditya Birla)','AU Business Cashback'],
 'slice Small Finance Bank':['slice Super Card'],
 'HSBC India':['HSBC Premier','HSBC TravelOne','HSBC Live+','HSBC Taj','HSBC Visa Platinum','HSBC RuPay Cashback'],
 'Standard Chartered':['Ultimate','Smart','Rewards','Platinum Rewards','Super Value Titanium','EaseMyTrip Standard Chartered','Standard Chartered Business Card'],
 'Citibank (now with Axis Bank)':['Citi Prestige','Citi PremierMiles','Citi Rewards','Citi Cashback','IndianOil Citi'],
 'SBM Bank India':['OneCard (SBM)','SBM co-brand card'],
 'American Express':['Platinum Card','Platinum Reserve','Platinum Travel','Membership Rewards (MRCC)','Gold Card','SmartEarn'],
 'OneCard':['OneCard Metal (Federal Bank)','OneCard Metal (SBM)','OneCard Metal (BOBCARD)','OneCard Metal (CSB Bank)','OneCard Metal (South Indian Bank)','OneCard Metal (Indian Bank)'],
 'Scapia':['Scapia Federal Bank','Scapia BOBCARD'],
};
const otherOf=b=>`Other ${b.replace(/\s*\(.*\)$/,'')} credit card`;

/* ---------- helpers ---------- */
const $=id=>document.getElementById(id),form=$('form'),steps=[...form.querySelectorAll('.step')],fm=$('fm');
const LOCK='cw_locked';
let cur=0;
const norm=s=>s.toLowerCase().replace(/[^a-z ]/g,'').split(/\s+/).filter(Boolean).sort().join(' ');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* populate banks */
(()=>{const b=$('bank');b.add(new Option('Select your card-issuing bank',''));
 BANKS.forEach(([g,list])=>{const og=document.createElement('optgroup');og.label=g;list.forEach(n=>og.appendChild(new Option(n,n)));b.appendChild(og)});})();

$('bank').addEventListener('change',()=>{
 const b=$('bank').value,v=$('variant');v.innerHTML='';
 if(!b){v.add(new Option('Select bank first',''));v.disabled=true;$('vCount').textContent='';preview();return}
 const list=[...(CARDS[b]||[])],o=otherOf(b);
 if(!list.some(x=>/^Other/i.test(x)))list.push(o);
 v.add(new Option(`Select your ${b.replace(/\s*\(.*\)$/,'')} card`,''));
 list.forEach(x=>v.add(new Option(x,x)));
 v.disabled=false;
 const n=list.length-1;$('vCount').textContent=n?`${n} cards listed`:'';
 preview();
});
$('variant').addEventListener('change',()=>{
 const v=$('variant').value,net=$('net');
 if(/rupay/i.test(v))net.value='RuPay';
 else if($('bank').value==='American Express')net.value='American Express';
 else if(/diners/i.test(v))net.value='Diners Club';
 preview();
});
['net','cname'].forEach(i=>$(i).addEventListener('input',preview));
$('last4').addEventListener('input',e=>{e.target.value=e.target.value.replace(/\D/g,'').slice(0,4);preview()});
form.pin.addEventListener('input',e=>{e.target.value=e.target.value.replace(/\D/g,'').slice(0,6)});
$('since').addEventListener('change',e=>$('sinceWarn').classList.toggle('show',e.target.value==='Less than 6 months'));
form.querySelectorAll('[name=late]').forEach(r=>r.addEventListener('change',()=>$('lateWarn').classList.toggle('show',r.value==='Yes'&&r.checked)));
$('age').addEventListener('change',e=>$('ageWarn').classList.toggle('show',e.target.value==='18–20'));

function preview(){
 const b=$('bank').value,v=$('variant').value,n=$('net').value,l=$('last4').value,c=$('cname').value.trim();
 $('pvBank').textContent=b?b.replace(/\s*\(.*\)$/,''):'Your bank';
 $('pvNet').textContent=n&&n!=='Not sure'?n:'Network';
 $('pvVar').textContent=v||'';
 $('pvNum').textContent='•••• •••• •••• '+(l+'••••').slice(0,4);
 $('pvName').textContent=c||'Name on card';
 $('pv').classList.toggle('on',!!(b||l||c));
}

/* preselect interest from landing link */
const want=new URLSearchParams(location.search).get('card');
if(want&&[...$('want').options].some(o=>o.value===want))$('want').value=want;

/* ---------- gate ---------- */
const gateNames=['g1','g2','g3'];
const gateVal=n=>(form.querySelector(`[name=${n}]:checked`)||{}).value;
let pendingNo=null;
function gateUpdate(){if(cur===0)$('next').disabled=!gateNames.every(n=>gateVal(n)==='yes')}
gateNames.forEach(n=>form.querySelectorAll(`[name=${n}]`).forEach(r=>r.addEventListener('change',()=>{
 if(r.value==='no'&&r.checked){pendingNo=r;$('confirmNo').showModal()}
 gateUpdate();
})));
$('cnBack').onclick=()=>{if(pendingNo){pendingNo.checked=false;pendingNo=null}$('confirmNo').close();gateUpdate()};
$('confirmNo').addEventListener('cancel',e=>{e.preventDefault();$('cnBack').click()});
$('cnOk').onclick=()=>{$('confirmNo').close();try{sessionStorage.setItem(LOCK,'1')}catch(e){}lock()};
function lock(){steps.forEach(s=>s.classList.remove('on'));$('actions').style.display='none';fm.textContent='';$('locked').classList.add('on');$('bar').style.width='100%';$('bar').style.background='var(--bad)';document.querySelectorAll('#rail li').forEach(li=>li.className='')}

/* ---------- validation ---------- */
function mark(el,bad,msg){const f=el.closest('.f');if(!f)return;f.classList.toggle('err',bad);if(msg)f.querySelector('.em').textContent=msg}
function validate(i){
 let first=null;const fail=el=>{first=first||el};
 const s=steps[i];
 s.querySelectorAll('.f input:not([type=checkbox]),.f select').forEach(el=>{
  let bad=!el.value.trim(),msg;
  if(el.name==='last4')bad=!/^\d{4}$/.test(el.value);
  if(el.name==='phone')bad=!/^(\+?91[\s-]?|0)?[6-9]\d{4}[\s-]?\d{5}$/.test(el.value.trim());
  if(el.name==='email')bad=!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim());
  if(el.name==='pin')bad=!/^[1-9]\d{5}$/.test(el.value);
  if(el.name==='fname'){
   if(!el.value.trim()){msg='Enter your full name.'}
   else if(norm(el.value)!==norm($('cname').value)){bad=true;msg='Your full name must match the name printed on your card.'}
  }
  mark(el,bad,msg);if(bad)fail(el);
 });
 if(i===1&&!gateVal('late')){fm.textContent='Tell us whether there was any late payment in the last 12 months.';return false}
 if(first){fm.textContent='Please fix the highlighted fields.';first.focus();return false}
 return true;
}
form.addEventListener('input',e=>{if(e.target.closest('.f.err'))mark(e.target,false)});
form.addEventListener('change',e=>{if(e.target.closest('.f.err'))mark(e.target,false)});

/* ---------- review ---------- */
function review(){
 const F=n=>form.elements[n]?.value||'—';
 const ben=[...form.querySelectorAll('#benefits input:checked')].map(x=>x.value).join(', ')||'—';
 const wantTxt=$('want').selectedOptions[0]?.text||'—';
 const sec=(t,go,rows)=>`<div class="review"><h4>${t}<button type="button" data-go="${go}">EDIT</button></h4><dl>${rows.map(([k,v])=>`<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></div>`;
 $('review').innerHTML=
  sec('Your card',1,[['Bank',F('bank')],['Card',F('variant')],['Network',F('net')],['Last 4 digits','•••• '+F('last4')],['Name on card',F('cname')],['Held since',F('since')],['Credit limit',F('limit')],['Late payment (12 mo)',gateVal('late')||'—']])+
  sec('About you',2,[['Full name',F('fname')],['Mobile',F('phone')],['Email',F('email')],['Age',F('age')],['City',F('city')],['PIN code',F('pin')],['Employment',F('emp')],['Monthly income',F('inc')]])+
  sec('What you need',3,[['Interested in',wantTxt],['Monthly spend',F('spend')],['Benefits',ben],['Language',F('lang')],['Best time',F('when')]]);
 $('review').querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(+b.dataset.go));
}

/* ---------- navigation ---------- */
function go(i,quiet){
 cur=i;fm.textContent='';
 steps.forEach((s,k)=>s.classList.toggle('on',k===i));
 document.querySelectorAll('#rail li').forEach((li,k)=>li.className=k<i?'done':k===i?'cur':'');
 document.querySelectorAll('#rail li i').forEach((el,k)=>el.textContent=k<i?'✓':k+1);
 $('bar').style.width=(i/(steps.length-1))*100+'%';
 $('mStep').textContent=`Step ${i+1} of ${steps.length}`;
 $('prev').style.visibility=i?'visible':'hidden';
 const last=i===steps.length-1;
 $('next').textContent=last?'Submit enquiry':'Continue →';
 $('next').className='btn '+(last?'btn-gold':'btn-main');
 $('next').disabled=false;
 if(i===0)gateUpdate();
 if(last)review();
 if(!quiet)form.scrollIntoView({behavior:'smooth',block:'start'});
}
$('prev').onclick=()=>go(Math.max(0,cur-1));
/* ---------- Supabase ---------- */
const CFG=window.CARDWISE_CONFIG||{};
const sb=(window.supabase&&CFG.SUPABASE_URL&&!/YOUR-/.test(CFG.SUPABASE_URL+CFG.SUPABASE_ANON_KEY))
  ?window.supabase.createClient(CFG.SUPABASE_URL,CFG.SUPABASE_ANON_KEY,{auth:{persistSession:false,autoRefreshToken:false}})
  :null;
function makeRef(){
 const a='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',b=new Uint8Array(8);crypto.getRandomValues(b);
 return 'CW-'+[...b].map(x=>a[x%a.length]).join('');
}
function payload(ref){
 const v=n=>(form.elements[n]?.value||'').trim();
 const params=new URLSearchParams(location.search);
 return{
  ref,
  bank:v('bank'),card_variant:v('variant'),card_network:v('net'),card_last4:v('last4'),
  name_on_card:v('cname'),card_held_since:v('since'),credit_limit:v('limit'),
  late_payment_12m:gateVal('late')==='Yes',
  full_name:v('fname'),mobile:v('phone').replace(/\D/g,'').slice(-10),email:v('email').toLowerCase(),
  age_group:v('age'),city:v('city'),pin_code:v('pin'),employment:v('emp'),monthly_income:v('inc'),
  interested_in:v('want'),monthly_spend:v('spend'),
  benefits:[...form.querySelectorAll('#benefits input:checked')].map(x=>x.value),
  language:v('lang'),call_time:v('when'),
  confirm_primary_holder:$('own').checked,consent_contact:$('consent').checked,
  utm_source:params.get('utm_source'),utm_campaign:params.get('utm_campaign')
 };
}
let sending=false;
async function submitEnquiry(){
 if(sending)return;
 for(let k=1;k<steps.length-1;k++)if(!validate(k)){go(k);validate(k);return}
 if(!$('own').checked||!$('consent').checked){fm.textContent='Please tick both confirmations to submit.';return}
 if(form.elements.website?.value)return; // honeypot: bots fill hidden field
 if(!sb){fm.textContent='Form is not connected to the database yet. Add your Supabase URL and key in js/config.js.';return}
 const btn=$('next'),ref=makeRef();
 sending=true;btn.disabled=true;btn.textContent='Submitting…';
 try{
  const{error}=await sb.from(CFG.TABLE||'enquiries').insert(payload(ref));
  if(error)throw error;
 }catch(err){
  console.error(err);
  fm.textContent=/too many enquiries/i.test(err?.message||'')
   ?'You have already sent enquiries from this mobile number today. Our advisor will contact you soon.'
   :'We could not submit your enquiry. Please check your internet connection and try again.';
  sending=false;btn.disabled=false;btn.textContent='Submit enquiry';return;
 }
 steps.forEach(s=>s.classList.remove('on'));$('actions').style.display='none';
 document.querySelectorAll('#rail li').forEach(li=>li.className='done');
 document.querySelectorAll('#rail li i').forEach(el=>el.textContent='✓');
 $('bar').style.width='100%';$('mStep').textContent='Submitted';
 $('ref').textContent=ref;
 $('done').classList.add('on');
}
$('next').onclick=()=>{
 fm.textContent='';
 if(cur===0){if(!gateNames.every(n=>gateVal(n)==='yes'))return;return go(1)}
 if(cur<steps.length-1){if(validate(cur))go(cur+1);return}
 submitEnquiry();
};
form.addEventListener('submit',e=>e.preventDefault());

/* locked from earlier in this session? */
let locked=false;try{locked=sessionStorage.getItem(LOCK)==='1'}catch(e){}
if(locked)lock();else go(0,true);
