import React from "react";

const Featured = () => {
  return (
    <div className="max-w-[1400px] mx-auto px-4 pt-2 md:grid gap-2 md:gap-x-10 gap-y-5 grid-cols-4 mb-5">
      <div className="row-span-2 min-h-[250px] col-span-2 bg-[url('https://dmassets.micron.com/is/image/microntechnology/mobile-y52n-astronaut-phone-power-efficiency?ts=1724191387695&dpr=off')] bg-cover bg-center bg-no-repeat md:rounded relative">
        <div className="absolute left-5 bottom-5 w-[80%]">
          <h3 className="font-semibold text-2xl md:text-3xl text-white tracking-wide pb-2">
            Mobile Collections
          </h3>
          <p className="text-sm md:text-base text-white">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi
            illum, enim cumque porro odio, rerum dolorum quaerat similique
            exercitationem officia
          </p>
          <a
            href=""
            className="underline text-white py-1 mt-3 inline-block text-sm md:text-base  font-medium"
          >
            Shop Now
          </a>
        </div>
      </div>

      <div className="bg-green-500 min-h-[250px] bg-[url('https://photoai.com/cdn-cgi/image/format=jpeg,fit=cover,width=1024,height=1536,quality=85/https://r2-us-west.photoai.com/1714357281-6257ca04761b8146c73ead4819da52cf-14.png')] relative md:rounded bg-cover bg-center bg-no-repeat col-span-2">
      <div className="absolute left-5 bottom-5 w-[80%]">
          <h3 className="font-semibold text-2xl md:text-3xl text-white tracking-wide pb-2">
            Mobile Collections
          </h3>
          <p className="text-sm md:text-base text-white">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi
            illum, enim cumque porro odio, rerum dolorum quaerat similique
            exercitationem officia
          </p>
          <a
            href=""
            className="underline text-white py-1 mt-3 inline-block text-sm md:text-base  font-medium"
          >
            Shop Now
          </a>
        </div>
      </div>
      <div className="bg-green-500 min-h-[220px] bg-[url('https://hips.hearstapps.com/hmg-prod/images/fashion-model-naomi-campbell-wears-a-furry-cocktail-dress-news-photo-1656444150.jpg?crop=1xw:0.49663xh;center,top&resize=1200:*')] md:rounded bg-cover bg-center relative bg-no-repeat">
      <div className="absolute left-5 bottom-5 w-[80%]">
          <h3 className="font-semibold text-2xl md:text-3xl text-white tracking-wide pb-2">
            Mobile 
          </h3>
          <p className="text-sm md:text-base text-white">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi
           
          </p>
          <a
            href=""
            className="underline text-white py-1 mt-3 inline-block text-sm md:text-base  font-medium"
          >
            Shop Now
          </a>
        </div>
      </div>
      <div className="bg-green-500 min-h-[220px] md:rounded bg-[url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLeUxRIDBpKclsVIioQQ0Zlvk86ptJggLBxw&s')] relative bg-cover bg-center bg-no-repeat">
      <div className="absolute left-5 bottom-5 w-[80%]">
          <h3 className="font-semibold text-2xl md:text-3xl text-white tracking-wide pb-2">
            Mobile 
          </h3>
          <p className="text-sm md:text-base text-white">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi
           
          </p>
          <a
            href=""
            className="underline text-white py-1 mt-3 inline-block text-sm md:text-base  font-medium"
          >
            Shop Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default Featured;
