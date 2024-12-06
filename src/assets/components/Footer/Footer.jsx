

const Footer = () => {

	return (
		<div className='footer-container'>
			{/* Copyright Section */}
			<div className='footer-copyright'>
				<p>&copy; 2024@Sapatv.ng - All Rights Reserved</p>
			</div>

			{/* Links Section */}
			<div className='footer-links'>
				
			</div>

			{/* Social Media Section */}
			<div className='footer-social-media'>
				<a
					href='https://facebook.com'
					className='social-link'
					target='_blank'
					rel='noopener noreferrer'
				>
					Facebook
				</a>
				<a
					href='https://twitter.com'
					className='social-link'
					target='_blank'
					rel='noopener noreferrer'
				>
					Twitter
				</a>
				<a
					href='https://instagram.com'
					className='social-link'
					target='_blank'
					rel='noopener noreferrer'
				>
					Instagram
				</a>
			</div>
		</div>
	);
};

export default Footer;
