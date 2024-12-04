import { useNavigate } from 'react-router-dom'; // Removed Link

const Navbar = () => {
	const navigate = useNavigate(); // Declare the useNavigate hook here

	const handleScrollToSection = (sectionId) => {
		// Navigate to the homepage (root route)
		navigate('/');

		// Use setTimeout to ensure navigation has occurred before scrolling
		setTimeout(() => {
			// Scroll to the desired section after navigation
			document
				.getElementById(sectionId)
				?.scrollIntoView({ behavior: 'smooth' });
		}, 100); // Adjust the timeout if necessary to ensure the page has loaded
	};

	return (
		<nav>
			<div className='navbar-container'>
				{/* Add an image to the navbar */}
				<div className='navbar-logo'>
					<img src='src/assets/images/sapaLogo.png' alt='Logo' />
				</div>

				{/* Navbar Links */}
				<div className='navbar-links'>
					{/* Removed Link, directly using button onClick */}
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
