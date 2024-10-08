import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import urls from "./inputarr.js";

const executor = async (dataurl) => {
    let browser;
    try {
        // Launch a browser instance
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        try {
            // Navigate to the desired URL with a timeout
            await page.goto(dataurl, { waitUntil: 'networkidle2', timeout: 60000 });
        } catch (err) {
            console.error(`Navigation to ${dataurl} failed: ${err.message}`);
            return; // Skip to the next URL
        }

        try {
            // Wait for the main content to load
            await page.waitForSelector('body', { timeout: 60000 });
        } catch (err) {
            console.error(`Waiting for body selector failed on ${dataurl}: ${err.message}`);
            return; // Skip to the next URL
        }

        // Click on all toggle elements (e.g., "View More" buttons)
        const toggleSelectors = ['.toggle-class', 'button.view-more']; // Replace with actual selectors
        for (const selector of toggleSelectors) {
            const toggleElements = await page.$$(selector);
            for (const element of toggleElements) {
                try {
                    await element.click();
                    await page.waitForTimeout(500); // Adjust as needed to allow content to load
                } catch (err) {
                    console.error(`Error clicking element with selector ${selector} on ${dataurl}: ${err.message}`);
                }
            }
        }

        // Scroll to the bottom to load dynamic content
        await autoScroll(page);

        // Remove unwanted elements like navbar, footer, and ads
        await page.evaluate(() => {
            const unwantedSelectors = ['header', 'footer', '.navbar', '.ads', '.subscribe-popup']; // Add or modify selectors as needed
            unwantedSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => element.remove());
            });
        });

        // Get all text content after cleaning up the page
        const textContent = await page.evaluate(() => {
            return document.body.innerText; // Adjust if you want specific sections
        });

        // Format the text content into paragraphs if needed
        const paragraphs = textContent.split('\n').filter(p => p.trim()).map(p => p.trim()).join('\n\n');

        // Load existing JSON data
        let jsonData = {};
        try {
            const data = await fs.readFile('data.json', 'utf-8');
            jsonData = JSON.parse(data);
        } catch (err) {
            console.log('No existing data.json found, creating a new one.');
        }

        // Append new data
        jsonData[dataurl] = paragraphs;

        // Write updated data back to data.json
        try {
            await fs.writeFile('data.json', JSON.stringify(jsonData, null, 2));
            console.log('Data successfully appended to data.json');
        } catch (err) {
            console.error('Error writing data to file', err);
        }

    } catch (err) {
        console.error(`Error during processing ${dataurl}: ${err.message}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }

    async function autoScroll(page) {
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                const distance = 100;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });
    }
};

(async () => {
    for (const element of urls) {
        try {
            await executor(element);
        } catch (error) {
            console.error(`Error processing ${element}:`, error);
        }
    }
})();
