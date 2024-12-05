import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
	const navigate = useNavigate();
	const [menuOpen, setMenuOpen] = useState(false);

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

	const toggleMenu = () => {
		setMenuOpen(!menuOpen); // Toggle menu visibility
	};

	return (
		<nav>
			<div className='navbar-container'>
				{/* Navbar logo */}
				<div className='navbar-logo'>
					<img src='src/assets/images/sapaLogo.png' alt='Logo' />
				</div>

				{/* Menu Icon for small screens */}
				<div className='menu-icon' onClick={toggleMenu}>
					{/* Simple hamburger icon */}
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
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
