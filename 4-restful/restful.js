import express from "express";
import fs from "fs/promises";

const app = express();
// enable middleware for receiving JSON request body
app.use(express.json()); 

const port = 8001;

app.use(express.json());

app.use((req, res, next) => {
  console.log("Request received", req.method, req.url);
  next();
});

app.get("/", (req, res) => {
  res.send("Goodbye");
});

// app.use((req, res, next) => {
//     if (req.get("Authorization") !== "y378jdts3gj4") {
//       res.sendStatus(401);
//     } else {
//       next();
//     }
// });

app.get("/pets", (req, res) => {
    fs.readFile("../pets.json", "utf-8")
      .then((data) => {
        res.json(JSON.parse(data));
      })
      .catch((err) => {
        res.sendStatus(500);
        console.error(err);
      });
  });

  app.get("/pets/:id", (req, res) => {
    const petId = Number.parseInt(req.params.id);
    fs.readFile("../pets.json", "utf-8")
        .then((data)=>{
            const pets = JSON.parse(data);
            // make sure ID is in range of pets array, and that its a number
            if (pets[petId] === undefined){
                 return res.sendStatus(404);
            }
            // get specific pet and send it as response
            res.json(pets[petId]);
        })
        .catch((err)=>{
            console.error(err.stack);
            res.sendStatus(500);
        });
  });
  
  // endpoint to create a new pet
  app.post("/pets", (req, res) => {
      // console.log("req.body", req.body);
      const age = Number.parseInt(req.body.age); // make sure its a number
      const kind = req.body.kind;
      const name = req.body.name;
      // validate data from request body
      if (!kind || !name || Number.isNaN(age)){
          return res.sendStatus(404);
      }
      // create a new pet object
      const newPet = { 
          age: age, 
          name: name, 
          kind: kind
      }
      console.log("newPet", newPet);
      // add to pets.json using Promise chaining
      fs.readFile("../pets.json", "utf-8")
        .then((data) => { // reading pets.json
             // parse text into json
            const pets = JSON.parse(data);
            pets.push(newPet);
            // return value will be wrapped in an automatically resolved Promise
            return pets; 
        }) 
        .then((data) => { // writing to pets.json
            console.log("writing all the current pets: ", data);
            return fs.writeFile("../pets.json", JSON.stringify(data)) // return the Promise             
        }) 
        .then(()=>{ // chain HTTP response after the fs.writeFile Promise is resolved
            console.log("response...");
            res.statusCode = 201;
            res.send(newPet);
        })
        .catch((err)=>{ // will catch errors from rejection of any of the Promises
            console.error(err.stack);
            res.sendStatus(500);
        });
  });
  


  app.patch("/pets/:id", (req, res) => {
    const petId = Number.parseInt(req.params.id);

    fs.readFile("../pets.json", "utf-8")
        .then((data) => {
            const pets = JSON.parse(data);

            if (petId < 0 || petId >= pets.length) {
                return res.sendStatus(404); // Invalid pet ID
              }

              const updatedPet = { ...pets[petId], ...req.body };
      pets[petId] = updatedPet;

              return fs.writeFile("../pets.json", JSON.stringify(pets));
            })
                .catch((err) => {
                console.error(err.stack);
                res.sendStatus(500);
            });
    res.send(`PATCH request called to patch ${petId}`)
  });


  app.delete("/pets/:id", (req, res) => {
    const petId = Number.parseInt(req.params.id);

    fs.readFile("../pets.json", "utf-8")
        .then((data) => {
            const pets = JSON.parse(data);

            if (petId < 0 || petId >= pets.length) {
                return res.sendStatus(404); // Invalid pet ID
              }

              pets.splice(petId, 1);

              return fs.writeFile("../pets.json", JSON.stringify(pets));
        })
        .catch((err) => {
            console.error(err.stack);
            res.sendStatus(500);
        });

    res.send(`DELETE Request Called to delete ${petId}`)
  });

  
  app.listen(port, () => {  
    console.log(`Example app listening on port ${port}`);
  });