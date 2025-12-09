import path from 'path';
import fs from 'fs';
import ejs from 'ejs';
import htmlPdf from 'html-pdf-node';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const jsonFile = process.argv[2];

if (!jsonFile) {
    console.error('Usage: npm run generate <name>');
    process.exit(1);
}

const jsonPath = path.join(__dirname, 'constants', `${jsonFile}.json`);

if (!fs.existsSync(jsonPath)) {
    console.error(`File not found: ${jsonPath}`);
    process.exit(1);
}

const resume = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

async function generate() {
    const html = await ejs.renderFile(path.join(__dirname, './templates/resume.ejs'), { ...resume, downloadable: false });

    const options: htmlPdf.Options = {
        format: 'A4',
        margin: {
            top: '10mm',
            right: '10mm',
            bottom: '10mm',
            left: '10mm'
        },
    };

    const pdfBuffer = await htmlPdf.generatePdf({ content: html }, options);

    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    const outputPath = path.join(outputDir, `${jsonFile}.pdf`);
    fs.writeFileSync(outputPath, pdfBuffer);
    console.log(`Generated: output/${jsonFile}.pdf`);
}

generate().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
