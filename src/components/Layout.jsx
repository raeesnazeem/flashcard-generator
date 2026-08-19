import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-apple-surface text-apple-ink flex flex-col font-sans selection:bg-apple-blue/15 selection:text-apple-ink">
      <Navbar />
      <main className="flex-1 max-w-[1024px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <Outlet />
      </main>
    </div>
  )
}

