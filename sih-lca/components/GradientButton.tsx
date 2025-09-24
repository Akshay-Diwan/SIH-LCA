import React, { ReactNode } from 'react'
interface buttonProps {
  children?: ReactNode
}
const GradientButton = (props: buttonProps) => {
  return (
    
     <button className='text-xl sm:text-md md:text-lg font-bold tracking-tight text-black px-5 py-4 rounded-2xl bg-gradient-to-br from-purple-400 to-cyan-400 leading-tight hover:cursor-pointer hover:from-purple-500 hover:to-cyan-500'>
        {props.children}
        </button> 
  )
}

export default GradientButton
