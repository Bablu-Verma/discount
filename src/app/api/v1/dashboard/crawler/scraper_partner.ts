export type iPartner = {
    id:Number;
    url: string;
    title: string;
    price: string;
    source: string;
    image: string;
    redirect_url: string;
    real_price?: string | null;
    main_container:string;
  };
  
  const scraper_partner: iPartner[] = [
    {
      id:1,
      main_container:'.zg-carousel-general-faceout',
      url: 'https://www.amazon.in/gp/new-releases/?ref_=nav_em_cs_newreleases_0_1_1_3',
      title: '.p13n-sc-truncate-desktop-type2',
      price: '._cDEzb_p13n-sc-price_3mJ9Z',
      image: 'img.p13n-product-image',
      real_price: null,
      redirect_url:'https://www.amazon.in',
      source:'Amazon'
    }
  ];
  
  export default scraper_partner;
  