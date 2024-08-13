import fs from "fs"
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

// Function to append data to data.txt
function appendToTextFile(filePath, content) {
    return new Promise((resolve, reject) => {
        // Replace \n with actual newline characters
        const formattedContent = content.replace(/\\n/g, '\n');
        
        fs.appendFile(filePath, formattedContent + '\n', 'utf8', (err) => {
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
        
        if (Array.isArray(jsonData)) {
            // If jsonData is an array, iterate over its elements
            for (let value of jsonData) {
                await appendToTextFile('data.txt', value);
            }
        } else if (typeof jsonData === 'object') {
            // If jsonData is an object, iterate over its values
            for (let key in jsonData) {
                if (jsonData.hasOwnProperty(key)) {
                    await appendToTextFile('data.txt', jsonData[key]);
                }
            }
        } else if (typeof jsonData === 'string') {
            // If jsonData is a string, append it directly
            await appendToTextFile('data.txt', jsonData);
        }
        
        console.log('Data appended to data.txt successfully!');
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
