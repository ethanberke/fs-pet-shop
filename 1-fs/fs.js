//common JS
//const fs = require("node:fs");
//ES6 Modules
import fs from "fs";

const command = process.argv[2];
console.log('command', command);

if(command === "read") {
    //read pets.json
    fs.readFile("../pets.json", "utf-8", function(error, text) {
        //if readFile produces an error, throw is so Node will display the error
        if(error) {
            throw error;
        }
        //parse json to an object
        const pets = JSON.parse(text);
        //log it to the console
         //console.log(pets);

        const petIndex = process.argv[3];
        if (process.argv.length < 4){
            console.log(pets);
            process.exit(1);
        }
        // console.log('petIndex: ', petIndex);
        const indexNum = Number.parseInt(petIndex);

        if (!Number.isInteger(indexNum) || Number.isNaN(indexNum)) {
            console.error('Usage: node fs.js read INDEX');
            process.exit(1);
        }
        if (indexNum < 0 || indexNum >= pets.length){
            console.error('Usage: node fs.js read INDEX');
            process.exit(1);
        }
        console.log(pets[indexNum]);
    }); 


} else if (command === "create") {
    if (process.argv.length !== 6) {
        console.log('Usage: node fs.js update INDEX AGE KIND NAME')
    } else {
        let newPet = {
            age: Number(process.argv[3]), 
            kind: process.argv[4], 
            name: process.argv[5]    
        };
        if (Number.isNaN(newPet.age)) {
            console.error("Usage: node fs.js create AGE KIND NAME");
            process.exit(1);
        }

        fs.readFile("../pets.json", "utf-8", (error, text) => {
            const existingPets = JSON.parse(text);
            existingPets.push(newPet)
            fs.writeFile("../pets.json", JSON.stringify(existingPets), (error) =>{
                console.log(`${newPet.name} has been writen to petJSON as: `, newPet);
            });
        });
    }
// } else if (command === 'update') {
//         console.log('Update')
// } else if (command === 'destroy') {
//         console.log('Destroy');
} else {
    console.error('Usage: node fs.js [read | create | update | destroy]');
    process.exit(1);
}




// const {argv} = rqeuire('node:process');

//console.log(process.argv);