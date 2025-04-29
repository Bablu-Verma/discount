import axios from 'axios';
import * as cheerio from 'cheerio';
import UserAgent from 'user-agents';
import sharp from 'sharp';

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

  try {
    const response = await axios.get('https://www.amazon.in/gp/new-releases/?ref_=nav_em_cs_newreleases_0_1_1_3', {
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
      throw new Error(`Failed to fetch Amazon page. Status code: ${response.status}`);
    }

    const $ = cheerio.load(response.data);

    const productPromises = $('.zg-carousel-general-faceout').map(async (_, el) => {
      let title = $(el).find('.p13n-sc-truncate-desktop-type2').text().trim();
      const price = $(el).find('._cDEzb_p13n-sc-price_3mJ9Z').text().trim();
      let image = $(el).find('img.p13n-product-image').attr('src')?.trim() || '';
      const realPrice = $(el).find('.a-text-strike').text().trim() || null;

      let upload_ = await uploadToImgurFromUrl(image)
      // console.log(upload_)

      if (upload_.success) {
        image = upload_.url
      }

      if (title && price && image) {

        title = `Best Deal: ${title}`;

        products.push({ title, price, source: 'Amazon', create_date: new Date, client_id: 'https://www.amazon.in/gp/new-releases/?ref_=nav_em_cs_newreleases_0_1_1_3', image, real_price: realPrice });
      }
    }).get();

    await Promise.all(productPromises);

  } catch (error: any) {
    console.error('❌ Error scraping Amazon:', error.message || error);
  }

  return products;
}
