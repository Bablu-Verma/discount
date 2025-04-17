'use client'

import { useParams, usePathname, useRouter } from "next/navigation";


export default function Pinback() {
    const pathname = usePathname()
    const params = useParams()


    console.log(pathname)
    console.log(params)
    

  return (
    <>
     
    </>
  );
}
