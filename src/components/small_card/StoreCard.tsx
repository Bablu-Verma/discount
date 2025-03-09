import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Image from 'next/image'
import { IStore } from '@/model/StoreModel'


interface istorecard {
    item:IStore
}
const StoreCard:React.FC<istorecard> = ({item})=> {
  return (
    <Link href={`/store/${item.slug}`} className="bg-white rounded-md p-3 justify-center gap-1 flex flex-col items-center hover:shadow-orange-300">
    <Image src={item.store_img} alt={item.name} width={100} height={100} sizes="100vw" className="rounded-md mb-3"  />

    <p className="text-lg text-secondary"><span className="mr-1 text-sm ">Upto</span>   
    {item.cashback_type=='FLAT_AMOUNT'&& <>₹{item.cashback_amount}.00</>}
    {item.cashback_type=='PERCENTAGE'&& <>{item.cashback_amount}%</>} Cashback</p>
    <h3 className="text-md capitalize text-secondary">{item.name}</h3>
  </Link>
  )
}

StoreCard.propTypes = {}

export default StoreCard