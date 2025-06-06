import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  HiHome,
  HiUser,
  HiViewGrid,
  HiChartBar,
  HiDocumentReport,
  HiChevronDown,
  HiMoon,
  HiSun,
} from "react-icons/hi";
import { HiOfficeBuilding } from 'react-icons/hi';
import { useAuth } from "../components/AuthContext";

function UserProfileMenu() {
  const { logout } = useAuth();
  const user = {
    name: "Rajashekar",
    avatar: "https://i.pravatar.cc/40",
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton className="flex items-center space-x-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
        <HiChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </MenuButton>
      <MenuItems className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
        <div className="py-1">
          <MenuItem>
            {({ close }) => (
              <Link
                to="/profile"
                onClick={close}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white dark:text-gray-200 dark:hover:bg-blue-600"
              >
                Profile
              </Link>
            )}
          </MenuItem>
          <MenuItem>
            {({ close }) => (
              <Link
                to="/settings"
                onClick={close}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white dark:text-gray-200 dark:hover:bg-blue-600"
              >
                Settings
              </Link>
            )}
          </MenuItem>
          <MenuItem>
            {({ close }) => (
              <button
                onClick={() => {
                  // alert("Logged out");
                   logout();
                  close();
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white dark:text-gray-200 dark:hover:bg-blue-600"
              >
                Logout
              </button>
            )}
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}

function CollapsibleMenuItem({ item, collapsed, location }) {
  const [open, setOpen] = useState(false);
  const isActive = (path) => location.pathname === path;
  const hasSubItems = item.subItems && item.subItems.length > 0;

  // For nested submenu hover popup when collapsed (only for Dashboard)
  const [hoverSubmenu, setHoverSubmenu] = useState(false);
  const submenuRef = useRef(null);

  // Close submenu if clicked outside (only relevant when collapsed and hover submenu open)
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        submenuRef.current &&
        !submenuRef.current.contains(event.target) &&
        !event.target.closest(`#collapsed-menu-item-${item.name.replace(/\s/g, "")}`)
      ) {
        setHoverSubmenu(false);
      }
    }
    if (collapsed && hoverSubmenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [collapsed, hoverSubmenu, item.name]);

  // Render submenu recursively for nested subItems
  const renderSubmenuItems = (subItems) => (
    <nav className="flex flex-col space-y-1">
      {subItems.map((subItem) =>
        subItem.subItems ? (
          <div key={subItem.name} className="pl-4">
            <div className="flex items-center space-x-2 text-gray-200 font-semibold">
              {subItem.icon && <subItem.icon className="w-4 h-4" />}
              <span>{subItem.name}</span>
            </div>
            {renderSubmenuItems(subItem.subItems)}
          </div>
        ) : (
          <Link
            key={subItem.name}
            to={subItem.path}
            className={`flex items-center space-x-2 px-2 py-1 rounded hover:bg-blue-600 hover:text-white ${
              isActive(subItem.path) ? "bg-blue-700 text-white" : "text-gray-300"
            }`}
            onClick={() => setHoverSubmenu(false)}
          >
            {subItem.icon && <subItem.icon className="w-4 h-4" />}
            <span>{subItem.name}</span>
          </Link>
        )
      )}
    </nav>
  );

  // When sidebar collapsed, show floating submenu only for Dashboard menu
  const showFloatingSubmenu =
    collapsed && hasSubItems && item.name === "Dashboard" && hoverSubmenu;

  return (
    <>
      <div
        role="tooltip"
        id={`collapsed-menu-item-${item.name.replace(/\s/g, "")}`}
        className={`group relative flex items-center p-2 rounded-lg cursor-pointer select-none ${
          isActive(item.path)
            ? "bg-blue-100 text-blue-600 dark:bg-blue-900"
            : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
        } ${collapsed ? "justify-center" : ""}`}
        onClick={() => hasSubItems && setOpen(!open)}
        onMouseEnter={() => {
          if (collapsed && item.name === "Dashboard") setHoverSubmenu(true);
        }}
        onMouseLeave={() => {
          if (collapsed && item.name === "Dashboard") setHoverSubmenu(false);
        }}
      >
        {item.icon && <item.icon className="w-6 h-6" />}
        <span
          style={{
            display: "inline-block",
            maxWidth: collapsed ? 0 : 120,
            overflow: "hidden",
            whiteSpace: "nowrap",
            opacity: collapsed ? 0 : 1,
            transform: collapsed ? "translateX(-20px)" : "translateX(0)",
            transition: "all 0.3s ease-in-out",
            marginLeft: collapsed ? 0 : "12px",
          }}
        >
          {item.name}
        </span>
        {hasSubItems && !collapsed && (
          <HiChevronDown
            className={`ml-auto w-5 h-5 transition-transform duration-300 ${
              open ? "rotate-180" : "rotate-0"
            }`}
          />
        )}
        {collapsed && (
          <>
            {/* Tooltip for collapsed */}          
          {showFloatingSubmenu && (
            <div
              ref={submenuRef}
              className="absolute left-full mt-0 ml-1 w-56 bg-blue-800 text-white rounded shadow-lg p-3 z-50"
              onMouseEnter={() => setHoverSubmenu(true)}
              onMouseLeave={() => setHoverSubmenu(false)}
              style={{ top: 0 }}
            >
              {/* Pointer triangle at left top */}
              <div className="absolute -left-2 top-2 w-3 h-3 bg-blue-800 rotate-45" />

              {renderSubmenuItems(item.subItems)}
            </div>
          )}


          </>
        )}
      </div>

      {/* Expanded submenu (normal) */}
      {hasSubItems && open && !collapsed && (
        <nav className="ml-8 border-l border-gray-300 dark:border-gray-700">
          {item.subItems.map((subItem) =>
            subItem.subItems ? (
              <CollapsibleMenuItem
                key={subItem.name}
                item={subItem}
                collapsed={collapsed}
                location={location}
              />
            ) : (
              <Link
                key={subItem.name}
                to={subItem.path}
                className={`group relative flex items-center p-2 rounded-lg transition-colors duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isActive(subItem.path)
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900"
                    : "text-gray-700 dark:text-gray-200"
                }`}
              >
                {subItem.icon && <subItem.icon className="w-5 h-5" />}
                <span style={{ marginLeft: "12px" }}>{subItem.name}</span>
              </Link>
            )
          )}
        </nav>
      )}
    </>
  );
}

function findActiveMenuName(menuItems, path) {
  for (const item of menuItems) {
    if (item.path === path) return item.name;
    if (item.subItems) {
      const sub = findActiveMenuName(item.subItems, path);
      if (sub) return sub;
    }
  }
  return null;
}

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const menuItems = [
    { name: "Home", icon: HiHome, path: "/" },
    {
      name: "Dashboard",
      icon: HiViewGrid,
      subItems: [
        { name: "Overview", icon: HiChartBar, path: "/dashboard/overview" },
        {
          name: "Reports",
          icon: HiDocumentReport,
          subItems: [
            { name: "Daily", icon: HiDocumentReport, path: "/dashboard/reports/daily" },
            { name: "Monthly", icon: HiDocumentReport, path: "/dashboard/reports/monthly" },
          ],
        },
      ],
    },
    { name: "Invoices", icon: HiOfficeBuilding, path: "/invoices/list" },
    { name: "Profile", icon: HiUser, path: "/profile" },
  ];

  const activeMenuName = findActiveMenuName(menuItems, location.pathname) || "Dashboard";

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Sidebar */}
      <div
        className="transition-width duration-[500ms] ease-in-out border-r shadow-lg h-full flex flex-col bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        style={{ width: collapsed ? "60px" : "256px" }}
      >
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-300 dark:border-gray-700">
          <div
            style={{
              width: collapsed ? "0px" : "auto",
              maxWidth: collapsed ? "0px" : "180px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              transition: "all 0.3s ease-in-out",
              opacity: collapsed ? 0 : 1,
            }}
          >
            <h1 className="text-xl font-semibold select-none">Matryx Medisys</h1>
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded hover:bg-gray-200 dark:hover:bg-gray-700 p-1"
          >
            <div className="w-5 h-5 flex flex-col justify-center items-center space-y-0.5">
              <span className="block w-5 h-0.5 bg-gray-700 dark:bg-gray-200 rounded"></span>
              <span className="block w-5 h-0.5 bg-gray-700 dark:bg-gray-200 rounded"></span>
              <span className="block w-5 h-0.5 bg-gray-700 dark:bg-gray-200 rounded"></span>
            </div>
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {menuItems.map((item) =>
            item.subItems ? (
              <CollapsibleMenuItem
                key={item.name}
                item={item}
                collapsed={collapsed}
                location={location}
              />
            ) : (
              <Link
                key={item.name}
                to={item.path}
                className={`group relative flex items-center p-2 rounded-lg transition-colors duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  collapsed ? "justify-center" : ""
                } ${
                  location.pathname === item.path
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900"
                    : "text-gray-700 dark:text-gray-200"
                }`}
              >
                {item.icon && <item.icon className="w-6 h-6" />}
                <span
                  style={{
                    display: "inline-block",
                    maxWidth: collapsed ? 0 : 120,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    opacity: collapsed ? 0 : 1,
                    transform: collapsed ? "translateX(-20px)" : "translateX(0)",
                    transition: "all 0.3s ease-in-out",
                    marginLeft: collapsed ? 0 : "12px",
                  }}
                >
                  {item.name}
                </span>
              
                {collapsed && (
                  <div
                    role="tooltip"
                    aria-label={item.name}
                    className="absolute left-full ml-2 top-1/2 -translate-y-1/2 transform rounded bg-blue-800 text-white text-xs px-3 py-1 shadow-lg whitespace-nowrap 
                              opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-300 pointer-events-none z-50 translate-y-[-4px]"
                  >
                    {item.name}
                    <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 w-2 h-2 bg-blue-800 rotate-45" />
                  </div>
                )}
              </Link>
            )
          )}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 px-4 py-2">
          <h2 className="text-lg font-semibold select-none truncate">{activeMenuName}</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDark(!dark)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Toggle Dark Mode"
            >
              {dark ? <HiSun className="w-6 h-6" /> : <HiMoon className="w-6 h-6" />}
            </button>
            <UserProfileMenu />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
}