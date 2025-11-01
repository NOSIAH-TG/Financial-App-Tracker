import React, { useState, useEffect, useRef } from "react";
import { FaBell } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import "./DashboardHeader.css";

const navigationItems = [
  { name: "Add Project", href: "#projects", description: "Create and manage new projects" },
  { name: "Track", href: "#track", description: "Monitor progress and timelines" },
  { name: "Report", href: "#reports", description: "Generate insights and summaries" },
];

const DashboardHeader = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  const handleNavClick = (href) => {
    const section = document.querySelector(href);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  const filteredNavigation = navigationItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
<header className="dashboard-header">
  <div className="dashboard-header-left">
    <h2 className="dashboard-greeting">Hi, Marvel👋</h2>
    <p className="dashboard-subtitle">
      Welcome back! Here’s your daily overview.
    </p>
  </div>

  {/* Hamburger Button */}
  <button
    className="hamburger-btn"
    onClick={() => setIsMobileMenuOpen((prev) => !prev)}
    aria-label="Toggle dasboard cards"
  >
    ☰
  </button>

  <div className={`dashboard-header-right ${isMobileMenuOpen ? "open" : ""}`}>
    <div className="search-bar" ref={searchRef}>
      <FiSearch
        className="search-icon"
        onClick={() => setIsSearchOpen(!isSearchOpen)}
      />
      <AnimatePresence>
        {isSearchOpen && (
          <motion.input
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            type="text"
            placeholder="Search sections..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSearchOpen && searchQuery && (
          <motion.ul
            className="search-results"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {filteredNavigation.map((item) => (
              <li key={item.name} onClick={() => handleNavClick(item.href)}>
                <strong>{item.name}</strong> – {item.description}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>

    <div className="header-icons">
      <FaBell className="notification-icon" />
      <img
        src="https://picsum.photos/400/300"
        alt="Random Placeholder"
        className="user-avatar"
      />
    </div>
  </div>
</header>
  );
};

export default DashboardHeader;