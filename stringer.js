import fs from "fs";

// Function to read data from data.json
function readJsonFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
}

// Function to write data to data.txt
function writeToTextFile(filePath, content) {
    return new Promise((resolve, reject) => {
        // Remove all \n characters
        const formattedContent = content.replace(/\n/g, '');

        fs.writeFile(filePath, formattedContent, 'utf8', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

// Main function to handle the operation
async function main() {
    try {
        const jsonData = await readJsonFile('data.json');
        
        let content = '';
        
        if (Array.isArray(jsonData)) {
            // If jsonData is an array, concatenate its elements
            content = jsonData.join('');
        } else if (typeof jsonData === 'object') {
            // If jsonData is an object, concatenate its values
            content = Object.values(jsonData).join('');
        } else if (typeof jsonData === 'string') {
            // If jsonData is a string, use it directly
            content = jsonData;
        }
        
        await writeToTextFile('data.txt', content);
        
        console.log('Data written to data.txt successfully!');
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
