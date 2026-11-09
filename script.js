const WHATSAPP = '584145911585'; // 0414-5911585 con código de país
const products = [
  {id:'mn01',name:'Mono Born To Die',cat:'monos',price:26.99,tone:1,letter:'B',img:'img/mono-born-to-die.png',tag:'Nueva colección',desc:'Nacido para morir · 100% algodón grueso'},
  {id:'hd02',name:'Hoodie Essential',cat:'hoodies',price:24.99,tone:1,letter:'H',tag:'Nuevo',desc:'Tela pesada',sizes:['S','M','L'],colors:['Negro','Gris'],colorTone:{Negro:1,Gris:5},colorImg:{Negro:'img/hoodie-negro.png',Gris:'img/hoodie-gris.png'}},
  {id:'bg01',name:'Baggy Humo Globo',cat:'baggy',price:34.99,tone:5,letter:'B',img:'img/baggy-humo-globo.png',desc:'Corte globo'},
  {id:'bg02',name:'Baggy Gris Prelavado',cat:'baggy',price:34.99,tone:6,letter:'B',img:'img/baggy-gris-prelavado.png',tag:'Nuevo modelo',desc:'Corte globo'},
  {id:'bg03',name:'Baggy Globo Azul',cat:'baggy',price:34.99,tone:7,letter:'B',img:'img/baggy-globo-azul.png',tag:'Nuevo modelo',desc:'Corte globo'},
  {id:'ln01',name:'Lentes Chromes Hearts',cat:'lentes',price:21.99,tone:2,letter:'L',tag:'Nuevo',desc:'Lentes de sol',colors:['Transparente','Negro'],colorTone:{Transparente:2,Negro:1},colorImg:{Transparente:'img/lentes-transparentes.png',Negro:'img/lentes-negros.png'}},
  // Con foto: agrega img:'img/hoodie.jpg' al producto
];
const COLOR_HEX = {Negro:'#121010',Gris:'#8a8683',Rojo:'#9c1c1c',Blanco:'#ece8e3',Transparente:'#d9d9d9'};
const SIZES = {monos:['S','M','L','XL'],baggy:['28','30','32','34','36'],hoodies:['S','M','L'],lentes:['Única']};
let cart = [], filter = 'todo';
const $ = s => document.querySelector(s);
const money = n => n.toFixed(2).replace('.',',') + '€';

function productCards(list){
  return list.map(p => {
    const sz = p.sizes || SIZES[p.cat];
    const startTone = p.colors ? p.colorTone[p.colors[0]] : p.tone;
    const startImg = p.colorImg ? p.colorImg[p.colors[0]] : p.img;
    return `<article class="card" data-id="${p.id}">
      <div class="ph t${startTone}">${startImg?`<img src="${startImg}" alt="${p.name}" loading="lazy" decoding="async">`:p.letter}${p.sold?'<span class="tag">Agotado</span>':p.tag?`<span class="tag new">${p.tag}</span>`:''}<span class="code">SV/${p.id.toUpperCase()}</span></div>
      <div class="info">
        <div class="top"><h3>${p.name}</h3><span class="price">${money(p.price)}</span></div>
        ${p.desc?`<p class="desc">${p.desc}</p>`:''}
        ${p.colors?`<div class="colors" aria-label="Color">${p.colors.map((c,i)=>`<button type="button" class="${i===0?'on':''}" data-c="${c}"><i style="background:${COLOR_HEX[c]||'#777'}"></i>${c}</button>`).join('')}</div>`:''}
        <div class="sizes">${sz.map((s,i)=>`<button type="button" class="${i===(sz.length>1?1:0)?'on':''}">${s}</button>`).join('')}</div>
        <button class="add" ${p.sold?'disabled':''}>${p.sold?'Agotado':'Agregar al carrito'}</button>
      </div></article>`;
  }).join('');
}
function renderGrid(){
  const list = products.filter(p => filter==='todo' || p.cat===filter);
  if(!list.length){ $('#grid').innerHTML = '<p class="soon">Muy pronto subimos estas piezas. Escríbenos por WhatsApp si quieres saber antes que nadie.</p>'; return; }
  $('#grid').innerHTML = productCards(list);
}

function renderCart(){
  $('#items').innerHTML = cart.length ? cart.map((c,i)=>`
    <li><b>${c.name}</b><span class="pr">${money(c.price*c.qty)}</span>
    <div class="qty"><button data-m="${i}" aria-label="Menos">−</button><span>${c.qty}</span><button data-p="${i}" aria-label="Más">+</button><small>Talla ${c.size}${c.color?' · '+c.color:''}</small></div>
    <button class="rm" data-r="${i}">Quitar</button></li>`).join('')
    : '<li class="empty">Tu carrito está vacío. Elige una pieza del drop.</li>';
  $('#cartCount').textContent = cart.reduce((a,c)=>a+c.qty,0);
  $('#total').textContent = money(cart.reduce((a,c)=>a+c.price*c.qty,0));
}
const TITLES = {baggy:'Baggys <em>Pantalones anchos</em>',monos:'Monos <em>Born To Die</em>',hoodies:'Hoodies <em>Tela pesada</em>'};
function setFilter(f){
  filter = f;
  document.querySelectorAll('.filters button').forEach(b=>b.classList.toggle('on',b.dataset.f===f));
  $('#shopTitle').innerHTML = TITLES[f] || 'Drop 01';
  renderGrid();
}
const toggle = o => { document.body.classList.toggle('open',o); $('#drawer').setAttribute('aria-hidden',!o); };

document.addEventListener('click', e => {
  const t = e.target;
  const go = t.closest('[data-go]');
  if(go){ setFilter(go.dataset.go); }
  else if(t.matches('.filters button')){ setFilter(t.dataset.f); }
  else if(t.closest('.colors') && t.tagName==='BUTTON'){
    t.parentNode.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b===t));
    const card = t.closest('.card'), p = products.find(x=>x.id===card.dataset.id);
    card.querySelector('.ph').className = 'ph t' + p.colorTone[t.dataset.c];
    if(p.colorImg) card.querySelector('.ph img').src = p.colorImg[t.dataset.c];
  } else if(t.closest('.sizes') && t.tagName==='BUTTON'){
    t.parentNode.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b===t));
  } else if(t.matches('.add')){
    const card = t.closest('.card'), p = products.find(x=>x.id===card.dataset.id);
    const size = card.querySelector('.sizes .on').textContent;
    const col = card.querySelector('.colors .on');
    const color = col ? col.dataset.c : '';
    const f = cart.find(c=>c.id===p.id && c.size===size && c.color===color);
    f ? f.qty++ : cart.push({id:p.id,name:p.name,price:p.price,size,color,qty:1});
    renderCart(); toggle(true);
  } else if(t.dataset.p){ cart[+t.dataset.p].qty++; renderCart(); }
  else if(t.dataset.m){ const c = cart[+t.dataset.m]; c.qty>1 ? c.qty-- : cart.splice(+t.dataset.m,1); renderCart(); }
  else if(t.dataset.r){ cart.splice(+t.dataset.r,1); renderCart(); }
});
$('#openCart').onclick = () => toggle(true);
$('#closeCart').onclick = $('#veil').onclick = () => toggle(false);
document.addEventListener('keydown', e => e.key==='Escape' && toggle(false));

$('#checkout').onclick = () => {
  if(!cart.length) return;
  const lines = cart.map(c=>`- ${c.name} (talla ${c.size}${c.color?', color '+c.color:''}) x${c.qty}: ${money(c.price*c.qty)}`).join('\n');
  const total = money(cart.reduce((a,c)=>a+c.price*c.qty,0));
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hola Street Venom, quiero hacer este pedido:\n'+lines+'\nTotal: '+total)}`,'_blank');
};
$('#waLink').href = 'https://wa.me/' + WHATSAPP;
renderGrid(); renderCart();
