import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const closeMobileMenu = () => setShowingNavigationDropdown(false);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sticky, modern navigation bar */}
            <nav className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 shadow-sm backdrop-blur-sm transition-all">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        {/* Logo and Desktop Navigation */}
                        <div className="flex items-center">
                            {/* Logo / Brand */}
                            <Link href={route('dashboard')} className="flex shrink-0 items-center gap-2">

                                <span className="hidden text-lg font-semibold tracking-tight text-gray-800 sm:inline-block">
                                    CTO Tracker
                                </span>
                            </Link>

                            {/* Desktop Navigation Links */}
                            <div className="hidden sm:ms-8 sm:flex sm:items-center sm:space-x-1">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100 hover:text-indigo-600"
                                    activeClassName="!text-indigo-600 !bg-indigo-50"
                                >
                                    Dashboard
                                </NavLink>
                                <NavLink
                                    href={route('employees.index')}
                                    active={route().current('employees.*')}
                                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100 hover:text-indigo-600"
                                    activeClassName="!text-indigo-600 !bg-indigo-50"
                                >
                                    Employees
                                </NavLink>
                                <NavLink
                                    href={route('cto-credits.index')}
                                    active={route().current('cto-credits.*')}
                                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100 hover:text-indigo-600"
                                    activeClassName="!text-indigo-600 !bg-indigo-50"
                                >
                                    CTO Credits
                                </NavLink>
                                <NavLink
                                    href={route('cto-usages.index')}
                                    active={route().current('cto-usages.*')}
                                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100 hover:text-indigo-600"
                                    activeClassName="!text-indigo-600 !bg-indigo-50"
                                >
                                    CTO Usages
                                </NavLink>
                                <NavLink
                                    href={route('ledger.index')}
                                    active={route().current('ledger.*')}
                                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100 hover:text-indigo-600"
                                    activeClassName="!text-indigo-600 !bg-indigo-50"
                                >
                                    CTO Ledger
                                </NavLink>
                                <NavLink
                                    href={route('departments.index')}
                                    active={route().current('departments.*')}
                                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100 hover:text-indigo-600"
                                    activeClassName="!text-indigo-600 !bg-indigo-50"
                                >
                                    Departments
                                </NavLink>
                                <NavLink
                                    href={route('negative.balance')}
                                    active={route().current('negative.balance')}
                                    className="rounded-md px-3 py-2 text-sm font-medium text-amber-700 transition-all hover:bg-amber-50 hover:text-amber-800"
                                    activeClassName="!text-amber-800 !bg-amber-50"
                                >
                                    Negative Balance
                                </NavLink>

                                {/* Reports Dropdown */}
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100 hover:text-indigo-600 focus:outline-none">
                                            Reports
                                            <svg className="-me-0.5 ms-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content align="left" className="mt-2 w-56 rounded-xl border border-gray-200 bg-white p-1 shadow-lg">
                                        <Dropdown.Link href={route('reports.employee-ledger', { employee: 1 })} className="rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600">
                                            Employee Ledger
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('reports.monthly-summary')} className="rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600">
                                            Monthly Summary
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('reports.department-summary')} className="rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600">
                                            Department Summary
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Desktop User Menu */}
                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="flex items-center gap-2 rounded-full px-2 py-1 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100 focus:outline-none">
                                            {/* Avatar placeholder */}
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                                                <span className="text-sm font-medium uppercase">
                                                    {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                                                </span>
                                            </div>
                                            <span className="hidden md:inline">{user.name}</span>
                                            <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content align="right" className="mt-2 w-48 rounded-xl border border-gray-200 bg-white p-1 shadow-lg">
                                        <Dropdown.Link href={route('profile.edit')} className="rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600">
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button" className="rounded-lg px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((prev) => !prev)}
                                className="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="border-t border-gray-100 bg-white pb-3 pt-2 shadow-inner">
                        <div className="space-y-1 px-2">
                            <ResponsiveNavLink
                                href={route('dashboard')}
                                active={route().current('dashboard')}
                                onClick={closeMobileMenu}
                                className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                                activeClassName="!bg-indigo-50 !text-indigo-600"
                            >
                                Dashboard
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                href={route('employees.index')}
                                active={route().current('employees.*')}
                                onClick={closeMobileMenu}
                                className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                                activeClassName="!bg-indigo-50 !text-indigo-600"
                            >
                                Employees
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                href={route('cto-credits.index')}
                                active={route().current('cto-credits.*')}
                                onClick={closeMobileMenu}
                                className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                                activeClassName="!bg-indigo-50 !text-indigo-600"
                            >
                                CTO Credits
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                href={route('cto-usages.index')}
                                active={route().current('cto-usages.*')}
                                onClick={closeMobileMenu}
                                className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                                activeClassName="!bg-indigo-50 !text-indigo-600"
                            >
                                CTO Usages
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                href={route('ledger.index')}
                                active={route().current('ledger.*')}
                                onClick={closeMobileMenu}
                                className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                                activeClassName="!bg-indigo-50 !text-indigo-600"
                            >
                                CTO Ledger
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                href={route('departments.index')}
                                active={route().current('departments.*')}
                                onClick={closeMobileMenu}
                                className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                                activeClassName="!bg-indigo-50 !text-indigo-600"
                            >
                                Departments
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                href={route('negative.balance')}
                                active={route().current('negative.balance')}
                                onClick={closeMobileMenu}
                                className="block rounded-lg px-3 py-2 text-base font-medium text-amber-700 hover:bg-amber-50 hover:text-amber-800"
                                activeClassName="!bg-amber-50 !text-amber-800"
                            >
                                Negative Balance
                            </ResponsiveNavLink>

                            <div className="pt-2">
                                <div className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Reports
                                </div>
                                <ResponsiveNavLink
                                    href={route('reports.employee-ledger', { employee: 1 })}
                                    onClick={closeMobileMenu}
                                    className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                                >
                                    Employee Ledger
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('reports.monthly-summary')}
                                    onClick={closeMobileMenu}
                                    className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                                >
                                    Monthly Summary
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('reports.department-summary')}
                                    onClick={closeMobileMenu}
                                    className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                                >
                                    Department Summary
                                </ResponsiveNavLink>
                            </div>
                        </div>

                        <div className="mt-4 border-t border-gray-100 pt-4">
                            <div className="flex items-center gap-3 px-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                                    <span className="text-sm font-medium uppercase">
                                        {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                                    </span>
                                </div>
                                <div>
                                    <div className="text-base font-medium text-gray-800">{user.name}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                            </div>
                            <div className="mt-3 space-y-1 px-2">
                                <ResponsiveNavLink
                                    href={route('profile.edit')}
                                    onClick={closeMobileMenu}
                                    className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                                >
                                    Profile
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    method="post"
                                    href={route('logout')}
                                    as="button"
                                    onClick={closeMobileMenu}
                                    className="block w-full rounded-lg px-3 py-2 text-left text-base font-medium text-red-600 hover:bg-red-50"
                                >
                                    Log Out
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Page Header */}
            {header && (
                <header className="border-b border-gray-200 bg-white shadow-sm">
                    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                        <div className="text-2xl font-semibold tracking-tight text-gray-800">{header}</div>
                    </div>
                </header>
            )}

            {/* Main Content */}
            <main className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
            </main>
        </div>
    );
}
