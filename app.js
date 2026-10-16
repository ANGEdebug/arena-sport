const IMG = photo => `https://images.unsplash.com/photo-${photo}?auto=format&fit=crop&w=640&q=80`;

// Pour utiliser tes propres photos : remplace img par "images/ballon-foot.jpg" par exemple.
const PRODUCTS = [
  {id:1,  name:"Ballon de football Pro",   cat:"Ballons",     price:15000, icon:"⚽", img:"images\Ballon.avif", badge:"Best-seller"},
  {id:2,  name:"Ballon de basket Indoor",  cat:"Ballons",     price:18000, icon:"🏀", img:"images\Basket.avif"},
  {id:3,  name:"Ballon de volley",         cat:"Ballons",     price:12000, icon:"🏐", img:"images\volley"},
  {id:4,  name:"Maillot d'entraînement",   cat:"Vêtements",   price:9500,  icon:"👕", img:"https://upload.wikimedia.org/wikipedia/commons/f/f1/Netherlands_national_football_shirt.jpg", badge:"Nouveau", credit:"Strologoff · CC BY-SA 3.0", creditUrl:"https://commons.wikimedia.org/wiki/File:Netherlands_national_football_shirt.jpg"},
  {id:5,  name:"Short de sport",           cat:"Vêtements",   price:6500,  icon:"🩳", img:"https://upload.wikimedia.org/wikipedia/commons/7/74/4R0A2151.jpg", credit:"Lacoste Sokhna · CC BY-SA 4.0", creditUrl:"https://commons.wikimedia.org/wiki/File:4R0A2151.jpg"},
  {id:6,  name:"Survêtement complet",      cat:"Vêtements",   price:25000, icon:"🧥", img:"https://upload.wikimedia.org/wikipedia/commons/0/0d/Kyle-cassidy-tracksuit.jpg", credit:"Kyle Cassidy · CC BY-SA 3.0", creditUrl:"https://commons.wikimedia.org/wiki/File:Kyle-cassidy-tracksuit.jpg"},
  {id:7,  name:"Chaussures de running",    cat:"Chaussures",  price:32000, icon:"👟", img:"images\chaussures", badge:"Best-seller"},
  {id:8,  name:"Crampons de football",     cat:"Chaussures",  price:28000, icon:"🥾", img:IMG("1511882150382-421056c89033")},
  {id:9,  name:"Gants de gardien",         cat:"Accessoires", price:11000, icon:"🧤", img:"https://upload.wikimedia.org/wikipedia/commons/5/57/Football_goalkeeper_gloves_Force_1000.jpg", credit:"Santeri Viinamäki · CC BY-SA 4.0", creditUrl:"https://commons.wikimedia.org/wiki/File:Football_goalkeeper_gloves_Force_1000.jpg"},
  {id:10, name:"Sac de sport",             cat:"Accessoires", price:14000, icon:"🎒", img:IMG("1553062407-98eeb64c6a62")},
  {id:11, name:"Gourde 750 ml",            cat:"Accessoires", price:3500,  icon:"🧴", img:IMG("1602143407151-7111542de6e8"), badge:"Petit prix"},
  {id:12, name:"Corde à sauter",           cat:"Accessoires", price:2500,  icon:"➰", img:IMG("1599058917212-d750089bc07e")},
];
const CATS = ["Tout", ...new Set(PRODUCTS.map(p => p.cat))];

const $ = s => document.querySelector(s);
const fcfa = n => n.toLocaleString("fr-FR").replace(/\u202f|\u00a0/g, " ") + " FCFA";
const state = { cat: "Tout", q: "", sort: "default", cart: JSON.parse(localStorage.getItem("cart") || "{}") };
const save = () => localStorage.setItem("cart", JSON.stringify(state.cart));

/* image avec repli si elle ne charge pas */
function media(p) {
  const img = document.createElement("img");
  img.src = p.img; img.alt = p.name; img.loading = "lazy";
  img.onerror = () => { img.replaceWith(Object.assign(document.createElement("div"), {className: "fallback", textContent: p.icon})); };
  return img;
}

/* boutique */
function renderFilters() {
  const nav = $("#filters"); nav.innerHTML = "";
  CATS.forEach(c => {
    const b = document.createElement("button");
    b.className = "chip" + (c === state.cat ? " on" : ""); b.textContent = c;
    b.onclick = () => { state.cat = c; renderFilters(); renderGrid(); };
    nav.append(b);
  });
}

function renderGrid() {
  let list = PRODUCTS.filter(p =>
    (state.cat === "Tout" || p.cat === state.cat) &&
    p.name.toLowerCase().includes(state.q.toLowerCase()));
  if (state.sort === "asc") list.sort((a, b) => a.price - b.price);
  if (state.sort === "desc") list.sort((a, b) => b.price - a.price);

  const grid = $("#grid"); grid.innerHTML = "";
  list.forEach((p, i) => {
    const card = document.createElement("article");
    card.className = "card"; card.style.animationDelay = `${i * 40}ms`;
    card.innerHTML = `<div class="thumb">${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
        <button class="add">Ajouter</button></div>
      <div class="info"><h3>${p.name}</h3><div class="cat">${p.cat}</div><div class="price">${fcfa(p.price)}</div></div>`;
    card.querySelector(".thumb").prepend(media(p));
    if (p.credit) {
      const credit = document.createElement("a");
      credit.className = "photo-credit";
      credit.href = p.creditUrl;
      credit.target = "_blank";
      credit.rel = "license noopener noreferrer";
      credit.textContent = p.credit;
      card.querySelector(".thumb").append(credit);
    }
    card.querySelector(".add").onclick = () => addToCart(p.id);
    grid.append(card);
  });
  $("#none").hidden = list.length > 0;
}

/* panier */
function addToCart(id) {
  state.cart[id] = (state.cart[id] || 0) + 1; save(); renderCart();
  const b = $("#count"); b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop");
  toast(`${PRODUCTS.find(p => p.id === id).name} ajouté`);
}
function setQty(id, q) { if (q <= 0) delete state.cart[id]; else state.cart[id] = q; save(); renderCart(); }

function renderCart() {
  const entries = Object.entries(state.cart).map(([id, qty]) => ({p: PRODUCTS.find(x => x.id == id), qty})).filter(e => e.p);
  const count = entries.reduce((s, e) => s + e.qty, 0);
  const total = entries.reduce((s, e) => s + e.qty * e.p.price, 0);
  $("#count").textContent = count; $("#total").textContent = fcfa(total);
  $("#foot").hidden = count === 0;

  const box = $("#lines"); box.innerHTML = "";
  if (!count) { box.innerHTML = `<p class="empty">Votre panier est vide.</p>`; return; }
  entries.forEach(({p, qty}) => {
    const row = document.createElement("div"); row.className = "line";
    row.innerHTML = `<div class="t"></div>
      <div><h4>${p.name}</h4><small>${fcfa(p.price)}</small>
        <div class="qty"><button aria-label="Moins">−</button><span>${qty}</span><button aria-label="Plus">+</button></div></div>
      <div class="sub">${fcfa(p.price * qty)}<button class="rm">Retirer</button></div>`;
    row.querySelector(".t").append(media(p));
    const [minus, plus] = row.querySelectorAll(".qty button");
    minus.onclick = () => setQty(p.id, qty - 1); plus.onclick = () => setQty(p.id, qty + 1);
    row.querySelector(".rm").onclick = () => setQty(p.id, 0);
    box.append(row);
  });
}

const drawer = $("#drawer"), overlay = $("#overlay");
function openCart(open) {
  drawer.classList.toggle("on", open); overlay.classList.toggle("on", open);
  drawer.setAttribute("aria-hidden", !open);
  document.body.style.overflow = open ? "hidden" : "";
}
$("#openCart").onclick = () => openCart(true);
$("#closeCart").onclick = overlay.onclick = () => openCart(false);
document.addEventListener("keydown", e => e.key === "Escape" && openCart(false));

$("#order").onsubmit = e => {
  e.preventDefault();
  const total = $("#total").textContent, name = new FormData(e.target).get("name");
  state.cart = {}; save(); renderCart(); e.target.reset();
  $("#doneMsg").textContent = `Merci ${name}. Total à régler : ${total}. Nous vous appelons pour la livraison.`;
  $("#done").hidden = false;
};
$("#doneClose").onclick = () => { $("#done").hidden = true; openCart(false); };

/* toast */
let t; function toast(msg) {
  const el = $("#toast"); el.textContent = msg; el.classList.add("on");
  clearTimeout(t); t = setTimeout(() => el.classList.remove("on"), 1800);
}

$("#search").oninput = e => { state.q = e.target.value; renderGrid(); };
$("#sort").onchange = e => { state.sort = e.target.value; renderGrid(); };

renderFilters(); renderGrid(); renderCart();
