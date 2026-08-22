import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-brand-mint selection:text-ink">
      <Navbar />
      
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Outlet />
      </main>

      {/* Banner & Footer */}
      <footer className="mt-auto border-t border-hairline bg-canvas overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-hairline pb-8">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-medium uppercase tracking-widest text-ink">
                Flashcard System
              </span>
              <span className="text-hairline font-mono text-xs">&bull;</span>
              <span className="font-mono text-xs text-ink-muted">
                Engineered for High-Retention Learning
              </span>
            </div>

            <div className="flex items-center gap-6 font-mono text-xs uppercase tracking-wider text-ink-muted">
              <Link to="/" className="hover:text-ink transition-colors">Create</Link>
              <Link to="/my-flashcards" className="hover:text-ink transition-colors">Library</Link>
              <span className="text-hairline">&bull;</span>
              <span className="text-ink-light">Indexed Local DB</span>
            </div>
          </div>

          
          <div className="pt-8 pb-4 select-none opacity-40 hover:opacity-70 transition-opacity">
            <p className="font-mono font-medium text-[32px] sm:text-[52px] md:text-[72px] lg:text-[96px] leading-none tracking-tighter text-hairline-strong text-center uppercase whitespace-nowrap overflow-hidden">
              FLASHCARDS&nbsp;&bull;&nbsp;ENGINE
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}


