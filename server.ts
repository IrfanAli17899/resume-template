import express from "express";
import path from 'path';
import ejs from 'ejs';
import htmlPdf from 'html-pdf-node';
import resume from './constants/resume.json'

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));

app.get('/', (req, res) => {
    res.render('resume', { ...resume, downloadable: true });
});

app.get('/download-pdf', async (req, res) => {
    try {
        // Render EJS to HTML
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

        const file = { content: html };

        const pdfBuffer = await htmlPdf.generatePdf(file, options);

        res.contentType('application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
});

app.listen(4000, () => {
    console.log("Server is running on port 4000");
});