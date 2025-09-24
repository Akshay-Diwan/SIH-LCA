'use client'
import React from 'react'
import Card from './Card'
import Card2 from './Card2'
import GradientButton from '../GradientButton'
import SearchBar from './SearchBar'

const NewProject = () => {
  return (
    <div className='w-screen flex flex-col justify-center items-center min-h-screen bg-gray-900 pt-30'>

    <GradientButton>Create From Scratch</GradientButton>

    <hr className='bg-white text-white h-10'/>
    <SearchBar/>
    <div className='grid w-screen max-w-[800px] gap-5 p-10 grid-cols-2'>
      <Card/>
      <Card/>
      <Card/>
      
    </div>
    </div>
  )
}

export default NewProject
