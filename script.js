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
  container.innerHTML = `
    <input type="text" placeholder="Nom du composant" class="componentName">
    <input type="number" placeholder="Quantité" class="componentQty">
  `;
  document.getElementById("components").appendChild(container);
}

function proposeCraft() {
  const name = document.getElementById("newItemName").value.trim();
  const qty = parseInt(document.getElementById("newItemQty").value);
  const components = [];
  document.querySelectorAll("#components div").forEach(div => {
    const compName = div.querySelector(".componentName").value.trim();
    const compQty = parseInt(div.querySelector(".componentQty").value);
    if (compName && compQty) {
      components.push({ name: compName, qty: compQty });
    }
  });

  if (name && qty && components.length > 0) {
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
    li.textContent = `${craft.qty} x ${craft.name} (composants: ${craft.components.map(c => `${c.qty} x ${c.name}`).join(", ")})`;
    list.appendChild(li);
  });
}
