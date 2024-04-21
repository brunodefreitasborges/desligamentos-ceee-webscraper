import fetch from "node-fetch";
import cheerio from "cheerio";
import fs from 'fs';

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

      const title = $('.titulo', element).text().trim();
      const hour = $('.hora', element).text().trim();

      const ruasArray = $('ul#listaDesligamentos\\:0\\:j_idt34_list > li.itens-listas')
      .map((index, element) => $(element).text().trim())
      .get();

      const data = {
        Titulo: title,
        Hora: hour,
        Ruas: ruasArray
      };

      dataList.push(data);
    });

     const jsonData = JSON.stringify(dataList, null, 2);

     fs.writeFile('data.json', jsonData, (err) => {
       if (err) {
         throw err;
       }
       console.log('Data has been written to data.json');
     });
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });
