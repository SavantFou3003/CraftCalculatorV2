
const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.static('.'));
app.use(express.json());

const VALIDATED = './data/validated_crafts.json';
const PENDING = './data/pending_crafts.json';
const ADMIN_PASS = 'admin123';

app.get('/api/crafts', (req,res)=>{
  const crafts = JSON.parse(fs.readFileSync(VALIDATED));
  res.json(crafts);
});

app.post('/api/propose', (req,res)=>{
  const pending = JSON.parse(fs.readFileSync(PENDING));
  pending.push(req.body);
  fs.writeFileSync(PENDING, JSON.stringify(pending,null,2));
  res.json({message:'Craft proposé !'});
});

app.post('/api/validate', (req,res)=>{
  if(req.body.password!==ADMIN_PASS) return res.status(403).json({message:'Mot de passe invalide'});
  let pending = JSON.parse(fs.readFileSync(PENDING));
  let validated = JSON.parse(fs.readFileSync(VALIDATED));
  validated = validated.concat(pending);
  pending = [];
  fs.writeFileSync(VALIDATED, JSON.stringify(validated,null,2));
  fs.writeFileSync(PENDING, JSON.stringify(pending,null,2));
  res.json({message:'Crafts validés !'});
});

app.listen(3000, ()=>console.log('Serveur sur http://localhost:3000'));
