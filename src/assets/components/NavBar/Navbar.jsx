import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '/src/assets/images/sapaLogo.png';

const Navbar = () => {
	const navigate = useNavigate();
	const [menuOpen, setMenuOpen] = useState(false);

	// Reset menu state when the window is resized (for large screen)
	useEffect(() => {
		const handleResize = () => {
			// Check if the screen size is larger than 768px (or your breakpoint for large screens)
			if (window.innerWidth > 768) {
				setMenuOpen(false); // Close the menu on large screens
			}
		};

		// Add event listener for window resize
		window.addEventListener('resize', handleResize);

		// Clean up the event listener on unmount
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			if (menuOpen) {
				setMenuOpen(false);
			}
		};

		window.addEventListener('scroll', handleScroll);

		// Cleanup event listener on unmount
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [menuOpen]);
	const handleScrollToSection = (sectionId) => {
		// Close the menu when a link is clicked
		setMenuOpen(false);

		// Navigate to the homepage (root route)
		navigate('/');

		// Use setTimeout to ensure navigation has occurred before scrolling
		setTimeout(() => {
			document
				.getElementById(sectionId)
				?.scrollIntoView({ behavior: 'smooth' });
		}, 100);
	};

	const handleNavigation = (path) => {
		// Close the menu when navigating to a different page
		setMenuOpen(false);
		navigate(path);
	};

	const toggleMenu = () => {
		setMenuOpen(!menuOpen); // Toggle menu visibility
	};

	return (
		<nav>
			<div className='navbar-container'>
				{/* Navbar logo */}
				<div className='navbar-logo'>
					<img src={logo} alt='Logo' />
				</div>

				{/* Menu Icon for small screens */}
				<div
					className={`menu-icon ${menuOpen ? 'open' : ''}`}
					onClick={toggleMenu}
				>
					{/* Simple hamburger icon that changes to X when menu is open */}
					<div className='menu-bar'></div>
					<div className='menu-bar'></div>
					<div className='menu-bar'></div>
				</div>

				{/* Navbar links */}
				<div className={`navbar-links ${menuOpen ? 'show' : ''}`}>
					<button onClick={() => handleScrollToSection('home')}>Home</button>
					<button onClick={() => handleScrollToSection('plans')}>Plans</button>
					<button onClick={() => handleScrollToSection('download')}>
						Download
					</button>
					<button onClick={() => handleScrollToSection('contact')}>
						Contact
					</button>
					<button
						onClick={() => handleNavigation('/faq')}
						className='footer-link'
					>
						<b>FAQ</b>
					</button>
					<button
						onClick={() => handleNavigation('/reseller')}
						className='footer-link'
					>
						<b>Resellers</b>
					</button>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
