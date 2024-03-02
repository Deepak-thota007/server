const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const filePath = 'data.json';

// Check if the file exists, and create it if it doesn't
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf-8');
}

app.use(cors());
app.use(bodyParser.json());

app.get('/sample', (req, res) => {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Error reading file');
            return;
        }

        const jsonData = JSON.parse(data);
        res.send(jsonData);
    });
});

app.post('/sample', (req, res) => {
    // Read existing data from the file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Error reading file');
            return;
        }

        let jsonData = JSON.parse(data); // Parse existing JSON data
        const newRowData = req.body; // New data from request body
        newRowData['id'] = jsonData.length + 1;

        // Push new data to the array
        jsonData.push(newRowData);

        // Write updated data back to the file
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file:', err);
                res.status(500).send('Error saving data to file');
            } else {
                console.log('Data appended to file successfully.');
                res.send({ "thanks": "Data received and appended to file." });
            }
        });
    });
});

app.delete('/sample/:id', (req, res) => {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Error reading file');
            return;
        }

        let jsonData = JSON.parse(data);
        console.log(req.params)
        const idToDelete = Number(req.params.id);

        // Find index of object with matching id
        const index = jsonData.findIndex(item => item.id == idToDelete);

        if (index > -1) {
            // Remove object from array
            jsonData.splice(index, 1);

            // Write updated data back to the file
            fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
                if (err) {
                    console.error('Error writing to file:', err);
                    res.status(500).send('Error saving data to file');
                } else {
                    console.log('Data deleted from file successfully.');
                    res.send({ "message": "Data deleted successfully." });
                }
            });
        } else {
            // Object with provided id not found
            res.status(404).send({ "error": "Object not found" });
        }
    });

})

app.listen(2000, () => console.log("Server running on port 2000"));
