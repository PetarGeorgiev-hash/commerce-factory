import React from 'react'
import PageLogoComponent from './PageLogoComponent'
import PageNavigation from './PageNavigation'
import SearchBar from './SearchBar'
import UserDropdown from './UserDropdown'
import ShopingCartButton from './ShopingCartButton'
import HamburgerMenu from './HamburgerMenu'

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <PageLogoComponent />
        <PageNavigation />
        <SearchBar />
        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          <ShopingCartButton />
          <UserDropdown />
          {/* Mobile Menu */}
          <HamburgerMenu />
        </div>
      </div>
    </header>
  )
}

export default Navbar