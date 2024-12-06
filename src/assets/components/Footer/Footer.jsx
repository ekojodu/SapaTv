import { useNavigate } from 'react-router-dom';

const Footer = () => {
	const navigate = useNavigate();

	return (
		<div className='footer-container'>
			{/* Copyright Section */}
			<div className='footer-copyright'>
				<p>&copy; 2024@Sapatv.ng - All Rights Reserved</p>
			</div>

			{/* Links Section */}
			<div className='footer-links'>
				<span onClick={() => navigate('/faq')} className='footer-link'>
					<b>FAQ</b>
				</span>
				<span onClick={() => navigate('/reseller')} className='footer-link'>
					<b>Resellers</b>
				</span>
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
