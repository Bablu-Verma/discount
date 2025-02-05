import React from 'react'
import HeroCategory from './HeroCategory'
import Banner from './Banner'
import { ICategory } from '@/model/CategoryModel';
import { ICampaign } from '@/model/CampaignModel';


interface HeroProps {
  home_category: ICategory[];
  banner:ICampaign[]
}
const Hero: React.FC<HeroProps> = ({home_category, banner}) => {
  return (
    <section className="pt-2 lg:pt-10">
      <div className="max-w-[1400px] mx-auto lg:px-4 gap-6 grid grid-cols-5">
        <HeroCategory category={home_category}/>
        <Banner banner={banner}/>
      </div>
    </section>
  )
}

export default Hero