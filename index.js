import fetch from "node-fetch";
import cheerio from "cheerio";
import express from 'express';

const app = express();

app.get('/download', (req, res) => {
    fetch('https://ceee.equatorialenergia.com.br/app/dp/DesligProgramado.xhtml')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            const $ = cheerio.load(html);

            const dataList = [];

            $('ul#listaDesligamentos_list > li.ui-datalist-item').each((index, element) => {

                const title = $('.titulo', element).text().split(" - ");
                const date = title[0].trim();
                const city = title[2].trim();

                if (city !== "PORTO ALEGRE") {
                    return true; // Skip this iteration if city is not PORTO ALEGRE
                }

                const hour = $('.hora', element).text().trim();

                const ruasArray = $('ul#listaDesligamentos\\:0\\:j_idt34_list > li.itens-listas')
                    .map((index, element) => $(element).text().trim())
                    .get();

                const data = {
                    Data: date,
                    Cidade: city,
                    Hora: hour,
                    Ruas: ruasArray
                };

                dataList.push(data);
            });

            const jsonData = JSON.stringify(dataList, null, 2);
       
            res.set('Content-Disposition', 'attachment; filename="data.json"');
            res.set('Content-Type', 'application/json');
            res.send(jsonData);

        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
