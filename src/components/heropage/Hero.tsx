import React from 'react'
import HeroCategory from './HeroCategory'
import Banner from './Banner'

const Hero = () => {
  return (
    <section className="pt-[40px] pb-[20]">
      <div className="max-w-[1400px] mx-auto px-4 gap-6 grid grid-cols-5">
        <HeroCategory />
        <Banner />
      </div>
    </section>
  )
}

export default Hero