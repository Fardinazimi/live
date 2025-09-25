import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [langVisible, setLangVisible] = useState(false);

  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);
  const { t, i18n } = useTranslation();

  const logout = () => {
    navigate('/login');
    localStorage.removeItem('token');
    setToken('');
    setCartItems({});
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLangVisible(false);
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  };

  return (
    <div className="flex items-center justify-between py-5 font-medium">

      {/* Logo */}
      <Link to="/"><img src={assets.logo} className="w-36" alt="" /></Link>

      {/* Desktop Menu */}
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>{t('home')}</p>
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>{t('collection')}</p>
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>{t('about')}</p>
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>{t('contact')}</p>
        </NavLink>
      </ul>

      {/* Right Section */}
      <div className="flex items-center gap-6">

        {/* Search */}
        <img onClick={() => { setShowSearch(true); navigate('/collection'); }} src={assets.search_icon} className="w-5 cursor-pointer" alt="" />

        {/* Language Dropdown */}
        <div className="relative">
          <button onClick={() => setLangVisible(!langVisible)} className="text-sm px-2 py-1 border rounded cursor-pointer">
            {i18n.language.toUpperCase()}
          </button>
          {langVisible && (
            <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow-lg z-50">
              <p onClick={() => changeLanguage('en')} className="px-3 py-2 hover:bg-gray-100 cursor-pointer">English</p>
              <p onClick={() => changeLanguage('de')} className="px-3 py-2 hover:bg-gray-100 cursor-pointer">Deutsch</p>
              <p onClick={() => changeLanguage('fa')} className="px-3 py-2 hover:bg-gray-100 cursor-pointer">Dari</p>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="group relative">
          <img onClick={() => token ? null : navigate('/login')} className="w-5 cursor-pointer" src={assets.profile_icon} alt="" />
          {token &&
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                <p className="cursor-pointer hover:text-black">{t('myProfile')}</p>
                <p onClick={() => navigate('/orders')} className="cursor-pointer hover:text-black">{t('orders')}</p>
                <p onClick={logout} className="cursor-pointer hover:text-black">{t('logout')}</p>
              </div>
            </div>}
        </div>

        {/* Cart */}
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">{getCartCount()}</p>
        </Link>

        {/* Mobile menu icon */}
        <img onClick={() => setVisible(true)} src={assets.menu_icon} className="w-5 cursor-pointer sm:hidden" alt="" />
      </div>

      {/* Sidebar Menu for Small Screens */}
      <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
        <div className="flex flex-col text-gray-600">
          <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-3 cursor-pointer">
            <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="" />
            <p>{t('back')}</p>
          </div>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/">{t('home')}</NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/collection">{t('collection')}</NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/about">{t('about')}</NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/contact">{t('contact')}</NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
