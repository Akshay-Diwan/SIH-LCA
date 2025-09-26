'use client'
import React, { useEffect } from 'react'
import Editor from '@/components/Editor/Editor'
import { RedirectToSignIn, SignedIn, SignedOut, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import { redirect } from 'next/navigation'

const page = () => {
  const { isSignedIn, isLoaded } = useAuth();

 
  if (!isLoaded) {
    return <div>Loading…</div>;
  }

  // if (!isSignedIn) {
  //   return null; // Prevent flicker before redirect
  // }
   if (isLoaded && !isSignedIn) {
      redirect("/sign-in");
    }

  return <Editor />;

}

export default page
