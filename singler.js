import fs from "fs";

// Function to read data from a text file
function readTextFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

// Function to write data to a text file
function writeTextFile(filePath, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, content, 'utf8', (err) => {
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
        // Read the content of the file
        let data = await readTextFile('data.txt');
        
        // Replace double newlines with a single newline
        const updatedData = data.replace(/\n\n+/g, '\n');
        
        // Write the updated content back to the file
        await writeTextFile('data.txt', updatedData);
        
        console.log('Double line gaps replaced with single line gaps successfully!');
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
