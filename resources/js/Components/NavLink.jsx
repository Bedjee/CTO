import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    activeClassName = '',
    children,
    ...props
}) {
    // Base classes
    const baseClasses = 'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none';

    // Determine active styles
    const activeClasses = active
        ? (activeClassName || 'border-indigo-400 text-gray-900 focus:border-indigo-700')
        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700';

    const finalClassName = `${baseClasses} ${activeClasses} ${className}`.trim();

    // Remove activeClassName before forwarding props to avoid DOM warning
    const { activeClassName: _, ...linkProps } = props;

    return (
        <Link {...linkProps} className={finalClassName}>
            {children}
        </Link>
    );
}
