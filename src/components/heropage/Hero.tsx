import React from 'react'
import HeroCategory from './HeroCategory'
import Banner from './Banner'
import { ICategory } from '@/model/CategoryModel';

interface HeroProps {
  home_category: ICategory[];
}
const Hero: React.FC<HeroProps> = ({home_category}) => {
  return (
    <section className="pt-[40px] pb-[20]">
      <div className="max-w-[1400px] mx-auto px-4 gap-6 grid grid-cols-5">
        <HeroCategory category={home_category}/>
        <Banner />
      </div>
    </section>
  )
}

export default Hero