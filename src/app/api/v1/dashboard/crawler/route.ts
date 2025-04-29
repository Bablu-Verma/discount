
import LiveDealModel from '@/model/LiveDeal';
import { scrapeAllSites } from './scraper';
import dbConnect from '@/lib/dbConnect';
import { authenticateAndValidateUser } from '@/lib/authenticate';
import { NextResponse } from 'next/server';

export async function POST(req: Request) 
{
  console.log('Scraping started...');

  try {
    await dbConnect();

     const { authenticated, usertype, message } = await authenticateAndValidateUser(req);

     if (!authenticated) {
           return new NextResponse(
             JSON.stringify({ success: false, message: message || "User is not authenticated" }),
             { status: 401, headers: { "Content-Type": "application/json" } }
           );
         }
     
         
         if (!(usertype === "admin" || usertype === "data_editor")) {
           return new NextResponse(
             JSON.stringify({
               success: false,
               message: "Access denied: You do not have the required role",
             }),
             {
               status: 403,
               headers: {
                 "Content-Type": "application/json",
               },
             }
           );
         }
     
     

    const products = await scrapeAllSites();

    console.log("products crawler", products);

    if (products.length > 0) {
      await LiveDealModel.insertMany(products);
      console.log('Products saved to MongoDB ✅');
      return new NextResponse(
        JSON.stringify({ success: false, message: "Products saved to MongoDB. Scraping done" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      console.log('No products scraped.');
      return new NextResponse(
        JSON.stringify({ success: false, message: "No products scraped." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    
  } catch (error) {
    console.error('Scraping failed ❌', error);
  }
}
