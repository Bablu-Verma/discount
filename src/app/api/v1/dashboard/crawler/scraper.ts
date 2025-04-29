import axios from 'axios';
import * as cheerio from 'cheerio';
import UserAgent from 'user-agents';
import sharp from 'sharp';
import scraper_partner from './scraper_partner';

export type Product = {
  title: string;
  price: string;
  source: string;
  image: string;
  client_id: string,
  create_date: Date,
  real_price?: string | null;
};

function getRandomUserAgent() {
  return new UserAgent().toString();
}

export const uploadToImgurFromUrl = async (imageUrl: string) => {
  try {
    const clientId = process.env.imgure_client_id;

    const response = await axios.post('https://api.imgur.com/3/image', {
      image: imageUrl,
      type: 'URL'
    }, {
      headers: {
        Authorization: `Client-ID ${clientId}`
      }
    });

    return {
      url: response.data.data.link,
      success: true,
      message: "Uploaded to Imgur successfully"
    };
  } catch (error: any) {
    return {
      url: null,
      success: false,
      message: error.message || "Imgur upload failed"
    };
  }
};




export async function scrapeAllSites(): Promise<Product[]> {
  const products: Product[] = [];

  const siteScrapingPromises = scraper_partner.map(async (item) => {
    try {
      const response = await axios.get(item.url, {
        headers: {
          'User-Agent': getRandomUserAgent(),
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
          'Connection': 'keep-alive',
        },
        timeout: 10000,
      });

      if (response.status !== 200) {
        throw new Error(`Failed to fetch ${item.source} page. Status code: ${response.status}`);
      }

      const $ = cheerio.load(response.data);

      const productPromises: Promise<void>[] = [];

      $(item.main_container).each((_, el) => {


        console.log("EL HTML:", $.html(el));
        console.log("EL HTML================:");
        
        const task = (async () => {
          let title = $(el).find(item.title).text().trim();
          const price = $(el).find(item.price).text().trim();
          let image = $(el).find(item.image).attr('src')?.trim() || '';
          const realPrice = item.real_price ? $(el).find(item.real_price).text().trim() : null;

          // const upload_ = await uploadToImgurFromUrl(image);

          // if (upload_.success) {
          //   image = upload_.url;
          // }


console.log("TITLE:", $(el).find(item.title).text().trim());
// console.log("PRICE:", $(el).find(item.price).text().trim());
// console.log("IMAGE SRC:", $(el).find(item.image).attr('src'));




          if (title && price && image) {
            title = `Best Deal: ${title}`;

            products.push({
              title,
              price,
              source: item.source,
              create_date: new Date(),
              client_id: item.redirect_url,
              image,
              real_price: realPrice,
            });
          }
        })();

        productPromises.push(task);
      });

      await Promise.all(productPromises);

    } catch (error: any) {
      console.error(`❌ Error scraping ${item.source}:`, error.message || error);
    }
  });

  await Promise.all(siteScrapingPromises);


  console.log("products", products)
  return products;
}
