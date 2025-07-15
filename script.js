async function loadCrafts() {
  const pending = await fetch('/pending-crafts').then(res => res.json());
  const validated = await fetch('/validated-crafts').then(res => res.json());

  const pendingList = document.getElementById("pendingCraftsList");
  const validatedList = document.getElementById("validatedCraftsList");
  pendingList.innerHTML = "";
  validatedList.innerHTML = "";

  pending.forEach(craft => pendingList.appendChild(createCraftElement(craft, true)));
  validated.forEach(craft => validatedList.appendChild(createCraftElement(craft, false)));
}

function createCraftElement(craft, canValidate) {
  const li = document.createElement("li");
  let text = `${craft.qty} x ${craft.name}`;
  text += craft.components.map(c => {
    let sub = c.subcomponents.length ? ` [${c.subcomponents.map(s => `${s.qty} x ${s.name}`).join(", ")}]` : "";
    return ` | ${c.qty} x ${c.name}${sub}`;
  }).join("");
  li.textContent = text;

  if (canValidate) {
    const btn = document.createElement("button");
    btn.textContent = "Valider";
    btn.onclick = () => validateCraft(craft);
    li.appendChild(btn);
  }
  return li;
}

function openCraftModal() {
  document.getElementById("craftModal").style.display = "block";
}

function closeCraftModal() {
  document.getElementById("craftModal").style.display = "none";
  document.getElementById("newItemName").value = "";
  document.getElementById("newItemQty").value = "";
  document.getElementById("components").innerHTML = "";
}

function addComponent(button) {
  const container = document.createElement("div");
  container.className = "component";
  container.innerHTML = `
    <input type="text" placeholder="Composant">
    <input type="number" placeholder="Qté">
    <button onclick="addSubComponent(this)">+ Sous-composant</button>
  `;
  button.parentNode.parentNode.querySelector("#components").appendChild(container);
}

function addSubComponent(button) {
  const sub = document.createElement("div");
  sub.className = "subcomponent";
  sub.innerHTML = `
    <input type="text" placeholder="Sous-composant">
    <input type="number" placeholder="Qté">
  `;
  button.parentNode.appendChild(sub);
}

async function proposeCraft() {
  const name = document.getElementById("newItemName").value.trim();
  const qty = parseInt(document.getElementById("newItemQty").value);
  const components = [];

  document.querySelectorAll("#components .component").forEach(comp => {
    const compName = comp.querySelector("input[type='text']").value.trim();
    const compQty = parseInt(comp.querySelector("input[type='number']").value);
    const subcomponents = [];
    comp.querySelectorAll(".subcomponent").forEach(sub => {
      const subName = sub.querySelector("input[type='text']").value.trim();
      const subQty = parseInt(sub.querySelector("input[type='number']").value);
      if(subName && subQty) subcomponents.push({name: subName, qty: subQty});
    });
    if(compName && compQty) components.push({name: compName, qty: compQty, subcomponents});
  });

  if(name && qty && components.length > 0) {
    await fetch('/add-pending', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name, qty, components })
    });
    closeCraftModal();
    loadCrafts();
  } else {
    alert("Remplis tout !");
  }
}

async function validateCraft(craft) {
  const pwd = prompt("Mot de passe admin ?");
  if (!pwd) return;
  await fetch('/validate-craft', {
    method: 'POST', headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ craft, password: pwd })
  });
  loadCrafts();
}

loadCrafts();
