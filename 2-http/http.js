import http from "http";
import fs from "fs";

let server = http.createServer((req, res) => {
    const petRegExp = /^\/pets\/(\d+)$/; // Regular expression to match /pets/{index}

    if (req.method === "GET" && (req.url === "/pets" || req.url === "/pets/")) {
        fs.readFile("../pets.json", "utf-8", function (error, text) {
            if (error) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Internal Server Error');
            } else {
                const pets = JSON.parse(text);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(pets));
            }
        });
    } else if (req.method === "GET" && petRegExp.test(req.url)) {
        const petIndex = parseInt(req.url.match(petRegExp)[1]); // Extract the index from the URL
        fs.readFile("../pets.json", "utf-8", function (error, text) {
            if (error) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Internal Server Error');
            } else {
                const pets = JSON.parse(text);

                if (petIndex >= 0 && petIndex < pets.length) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(pets[petIndex]));
                } else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('Pet Not Found');
                }
            }
        });
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found');
    }
});

server.listen(8000);
