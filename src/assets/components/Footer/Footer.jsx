import { FaFacebook, FaWhatsapp, FaInstagram } from 'react-icons/fa'; // Font Awesome Icons

const Footer = () => {
	return (
		<div className='footer-container'>
			{/* Copyright Section */}
			<div className='footer-copyright'>
				<p>&copy; 2024@Sapatv.ng - All Rights Reserved</p>
			</div>

			{/* Links Section */}
			<div className='footer-links'></div>

			{/* Social Media Section */}
			<div className='footer-social-media'>
				<a
					href='https://web.facebook.com/profile.php?id=61559137037621&mibextid=JRoKGi&_rdc=1&_rdr#'
					className='social-link'
					target='_blank'
					rel='noopener noreferrer'
				>
					<FaFacebook style={{ color: '#4267B2', fontSize: '2em' }} />
				</a>
				<a
					href='https://api.whatsapp.com/send?phone=2348029161107&text=Hello!%0AI%20would%20like%20to%20know%20more%20about%20Sapa%20TV.%E2%9C%85'
					className='social-link'
					target='_blank'
					rel='noopener noreferrer'
				>
					<FaWhatsapp style={{ color: '#25D366', fontSize: '2em' }} />
				</a>
				<a
					href='https://www.instagram.com/sapatv_app/?igsh=MXNyeTlkOW9jcGMwYw%3D%3D'
					className='social-link'
					target='_blank'
					rel='noopener noreferrer'
				>
					<FaInstagram style={{ color: '#E1306C', fontSize: '2em' }} />
				</a>
			</div>
		</div>
	);
};

export default Footer;
