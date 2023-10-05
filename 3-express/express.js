import express from "express"; //ES6 Module
import fs from "fs";

const app = express();
app.use(express.json())
const port = 8000;

app.get("/", (req, res) => {
    res.send("Goodbye World!");
});

app.get("/pets", (req, res) => {
    fs.readFile("../pets.json", "utf-8", (err, text) => {
        if(err) {
            console.error(err.stack);
            res.sendStatus(500);
            return;
        }
        const pets = JSON.parse(text);
        res.json(pets);
    })
})

app.get("/pets/:id/", (req, res) => {
    const petId = Number.parseInt(req.params.id);
    fs.readFile("../pets.json", "utf-8", (err, text) => {
        if(err) {
            console.error(err.stack);
            res.sendStatus(500);
            return;
        }
    const pets = JSON.parse(text);
    if (petId >= 0 && petId < pets.length) {
        res.json(pets[petId]);
    } else {
        res.status(404).send("No fluffy pet here :(");
        return;
        }
    });
});

app.post("/pets", (req, res) => {
   const age = Number.parseInt(req.body.age);
   const name = req.body.name;
   const kind = req.body.kind;
   //Validate data from request object
   if (!kind || !name || Number.isNaN(age)) {
        return res.sendStatus(404);
   }
   const newPet = {
    age: age,
    name: name,
    kind: kind
   }
   console.log(newPet);
   //add to pets.json
   fs.readFile("../pets.json", "utf-8", (err, text) => {
        if(err) {
            console.error(err.stack);
            res.sendStatus(500);
            return;
        }
        const pets = JSON.parse(text);
        pets.push(newPet);
        fs.writeFile('../pets.json', JSON.stringify(pets), (err) => {
            if (err){
                console.error(error.stack);
                res.sendStatus(500);
                return;
            }
            res.send(newPet);
        })
    })
})


app.listen(port, () => {
    console.log(`Example App listening on port ${port}`)
})