let express = require("express");
let fs = require("fs");
let data = require("./furnitureData.js");
let fname = "furn.json";
let app = express();
app.use(express.json());
app.use(function(req,res,next){
res.header("Access-Control-Allow-Origin","*");
res.header("Access-Control-Allow-Headers",
"Origin,X-Requested-With,Content-Type,Accept");
res.header("Access-Control-Allow-Methods",
"GET,PUT,POST,DELETE,PATCH,OPTIONS,HEAD");
next();
})
let port = process.env.PORT||2410;
app.listen(port,()=>console.log(`Node app listening on port ${port}!`));

app.get("/resetData",async function(req,res){
let str = JSON.stringify(data);
try{
  await fs.promises.writeFile(fname,str); 
  res.send("Data Successfully Reset");
}catch(err){
  if(err.response){
    res.status(err.response.status).send(err.response.statusText);
  }else res.status(404).send(err);
}
})
app.get("/products",async function(req,res){
 try{
  let furniture = await fs.promises.readFile(fname,"utf-8"); 
  let furn = JSON.parse(furniture);
  res.send(furn.furnitures)
}catch(err){
  if(err.response){
    res.status(err.response.status).send(err.response.statusText);
  }else res.status(404).send(err);
}   
})
app.get("/products/category/:category",async function(req,res){
    let { category } = req.params;
 try{
  let furniture = await fs.promises.readFile(fname,"utf-8"); 
  let furnitureData = JSON.parse(furniture);
  let furn = furnitureData.furnitures.filter((f1)=>f1.category === category);
  res.send(furn); 
}catch(err){
  if(err.response){
    res.status(err.response.status).send(err.response.statusText);
  }else res.status(404).send(err);
}
})
app.get("/products/:prodCode",async function(req,res){
    let { prodCode } = req.params;
 try{
  let furniture = await fs.promises.readFile(fname,"utf-8"); 
  let furnitureData = JSON.parse(furniture);
  let furn = furnitureData.furnitures.find((f1)=>f1.prodCode === prodCode);
 if(furn) res.send(furn); 
 else res.status(404).send("No product found")
}catch(err){
  if(err.response){
    res.status(err.response.status).send(err.response.statusText);
  }else res.status(404).send(err);
}
})
app.post("/login",async function(req,res){
let body = req.body;
  try{
    let furniture = await fs.promises.readFile(fname,"utf-8"); 
    let logData = JSON.parse(furniture);
    let furn = logData.loginData.find((f1)=>
    f1.email === body.email&& f1.password=== body.password);
    if(furn)
    res.json({
      email: furn.email,
      role: furn.role
    }); 
    else res.status(404).send("Invalid username or password")
  }catch(err){
    if(err.response){
      res.status(err.response.status).send(err.response.statusText);
    }else res.status(404).send(err);
  }
})
app.post("/products",async function(req,res){
let body = req.body;
try{
 let furnitureData = await fs.promises.readFile(fname,"utf-8");
 let furniture = JSON.parse(furnitureData);
 furniture.furnitures.push(body);
 let str = JSON.stringify(furniture);
 await fs.promises.writeFile(fname,str);
 res.send(body);
}catch(err){
   if(err.response){
     res.status(err.response.status).send(err.response.statusText);
   }else res.status(404).send(err);
}
})
app.put("/products/:prodCode",async function(req,res){
let prodCode = req.params.prodCode;
let body = req.body;
try{
  let furnitureData = await fs.promises.readFile(fname,"utf-8");
  let furniture = JSON.parse(furnitureData);
  let index = furniture.furnitures.findIndex((f1)=>f1.prodCode===prodCode);
  if(index>=0){
    let update = {...body}
    furniture.furnitures[index] = update;
    let str = JSON.stringify(furniture);
    await fs.promises.writeFile(fname,str);
    res.send(body);
  }else res.status(404).send("prodCode is inValid")
}catch(err){
  if(err.response){
    res.status(err.response.status).send(err.response.statusText);
  }else res.status(404).send(err);
}
})
app.delete("/products/:prodCode",async function(req,res){
  let prodCode = req.params.prodCode;
  try{
    let furnitureData = await fs.promises.readFile(fname,"utf-8");
    let furniture = JSON.parse(furnitureData);
    let index = furniture.furnitures.findIndex((f1)=>f1.prodCode===prodCode);
    if(index>=0){
      furniture.furnitures.splice(index,1);
      let str = JSON.stringify(furniture);
      await fs.promises.writeFile(fname,str);
      res.send("1 Data Successfully Deleted");
    }else res.status(404).send("prodCode is inValid")
  }catch(err){
    if(err.response){
      res.status(err.response.status).send(err.response.statusText);
    }else res.status(404).send(err);
  }
  })
