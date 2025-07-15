let pendingCrafts = [];  // en attente
let validatedCrafts = []; // validés

let adminPassword = "secret123";  // change le mot de passe ici (non affiché)

function addComponent() {
    const container = document.createElement("div");
    container.innerHTML = `
        <input type="text" placeholder="Nom du composant" class="componentName">
        <input type="number" placeholder="Quantité" class="componentQty">
    `;
    document.getElementById("components").appendChild(container);
}

function proposeCraft() {
    const name = document.getElementById("newItemName").value;
    const qty = parseInt(document.getElementById("newItemQty").value);
    const componentsEls = document.querySelectorAll("#components div");
    const components = [];
    componentsEls.forEach(div => {
        const compName = div.querySelector(".componentName").value;
        const compQty = parseInt(div.querySelector(".componentQty").value);
        if(compName && compQty) components.push({name: compName, qty: compQty});
    });
    if(name && qty && components.length > 0){
        pendingCrafts.push({name, qty, components});
        alert("Craft proposé !");
    } else {
        alert("Veuillez remplir tous les champs");
    }
}

function validateCrafts() {
    const pass = prompt("Mot de passe admin:");
    if(pass === adminPassword){
        validatedCrafts = validatedCrafts.concat(pendingCrafts);
        pendingCrafts = [];
        alert("Crafts validés !");
    } else {
        alert("Mot de passe incorrect");
    }
}

// Fonction récursive pour calculer tous les composants bruts
function getTotalResources(itemName, qty) {
    let craft = validatedCrafts.find(c => c.name === itemName);
    if(!craft){
        return {[itemName]: qty};
    }
    let total = {};
    craft.components.forEach(comp => {
        const subTotal = getTotalResources(comp.name, comp.qty * qty / craft.qty);
        for(const key in subTotal){
            total[key] = (total[key] || 0) + subTotal[key];
        }
    });
    return total;
}

function calculateAndShow(){
    const name = prompt("Nom de l'item à fabriquer:");
    const qty = parseInt(prompt("Quantité à fabriquer:"));
    if(!name || !qty) return;

    const total = getTotalResources(name, qty);
    let html = `<h2>Ressources nécessaires pour fabriquer ${qty} ${name}</h2>`;
    html += "<table border='1'><tr><th>Item</th><th>Quantité</th></tr>";
    for(const key in total){
        html += `<tr><td>${key}</td><td>${Math.ceil(total[key])}</td></tr>`;
    }
    html += "</table>";
    document.getElementById("result").innerHTML = html;
}

function downloadTable(){
    let csv = "Item,Quantité\\n";
    validatedCrafts.forEach(craft => {
        csv += `${craft.name},${craft.qty}\\n`;
    });
    const blob = new Blob([csv], {type: "text/csv"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "validated_crafts.csv";
    a.click();
}
