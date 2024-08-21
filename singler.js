import { promises as fs } from 'fs';
import path from 'path';

async function convertFileToSingleLine(inputFilePath, outputFilePath) {
    try {
        // Read the file content
        const fileContent = await fs.readFile(inputFilePath, 'utf8');

        // Remove all newline characters
        const singleLineContent = fileContent.replace(/[\r\n]+/g, ' ');

        // Write the single line content to a new file
        await fs.writeFile(outputFilePath, singleLineContent);

        console.log(`File converted to a single line and saved to ${outputFilePath}`);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Define the input and output file paths
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const inputFilePath = path.join(__dirname, 'discipline.txt');
const outputFilePath = path.join(__dirname, 'discipline1.txt');

// Convert the file
convertFileToSingleLine(inputFilePath, outputFilePath);
