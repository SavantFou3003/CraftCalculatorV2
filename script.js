let pendingCrafts = [];

function openCraftModal() {
  document.getElementById("craftModal").style.display = "block";
}

function closeCraftModal() {
  document.getElementById("craftModal").style.display = "none";
  document.getElementById("newItemName").value = "";
  document.getElementById("newItemQty").value = "";
  document.getElementById("components").innerHTML = "";
}

function addComponent() {
  const container = document.createElement("div");
  container.className = "component";
  container.innerHTML = `
    <input type="text" placeholder="Composant">
    <input type="number" placeholder="Qté">
    <button onclick="addSubComponent(this)">+ Sous-composant</button>
    <div class="subcomponents"></div>
  `;
  document.getElementById("components").appendChild(container);
}

function addSubComponent(button) {
  const subContainer = document.createElement("div");
  subContainer.className = "subcomponent";
  subContainer.innerHTML = `
    <input type="text" placeholder="Sous-composant">
    <input type="number" placeholder="Qté">
  `;
  button.nextElementSibling.appendChild(subContainer);
}

function proposeCraft() {
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
      if(subName && subQty) {
        subcomponents.push({ name: subName, qty: subQty });
      }
    });
    if(compName && compQty) {
      components.push({ name: compName, qty: compQty, subcomponents });
    }
  });

  if(name && qty && components.length > 0) {
    pendingCrafts.push({ name, qty, components });
    updatePendingCraftsList();
    closeCraftModal();
    alert("Craft proposé !");
  } else {
    alert("Veuillez remplir tous les champs !");
  }
}

function updatePendingCraftsList() {
  const list = document.getElementById("pendingCraftsList");
  list.innerHTML = "";
  pendingCrafts.forEach(craft => {
    const li = document.createElement("li");
    let text = `${craft.qty} x ${craft.name} : `;
    text += craft.components.map(c => {
      let sub = "";
      if(c.subcomponents.length > 0) {
        sub = ` [${c.subcomponents.map(s => `${s.qty} x ${s.name}`).join(", ")}]`;
      }
      return `${c.qty} x ${c.name}${sub}`;
    }).join(", ");
    li.textContent = text;
    list.appendChild(li);
  });
}
