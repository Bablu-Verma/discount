import type { Metadata } from "next";
import { Toaster } from 'react-hot-toast';
import "./globals.css";
import ReduxProvider from "@/redux-store/provider_";
import '../crawler/crawlerCron'


import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';


export const metadata: Metadata = {
  title: "Discount For You",
  description: "Best Descount, Offers, Cashback and Free products available",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
<html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
     
      </head>
      <body className="font-roboto antialiased bg-highlight_color">
       <Toaster  position="top-right" />
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
   
    
  );
}
