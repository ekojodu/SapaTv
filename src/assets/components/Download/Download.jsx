const Download = () => {
	return (
		<div>
			<div className='tv'>
				<img src='/src/assets/images/All-Sports-Showdown-button.png' alt='' />
				<img src='/src/assets/images/Live-Channel-button.png' alt='' />
				<img src='/src/assets/images/Movies&Series-button.png' alt='' />
			</div>
			<div className='download'>
				<div>
					<h1 className='heading'>Support Devices</h1>
					<p className='heading-paragraph'>
						Stream smoothly across Andriod TV, Tablets, and Smartphones
					</p>
				</div>
				<div>
					<a
						href='https://sapatv.xyz/sapatv/mobile/MobileSapa_TV_mob_r_0002_1.0.0_20240719_mobile.apk'
						download
					>
						<img src='/src/assets/images/Mobile_download.png' alt='' />
					</a>
					<a
						href='https://sapatv.xyz/sapatv/stb/SapaTV_stb_r_0002_1.0.0_20240719_stb.apk'
						download
					>
						<img src='/src/assets/images/TVBox_download.png' alt='' />
					</a>
					<a
						href='https://sapatv.xyz/sapatv/stb/SapaTV_stb_r_0002_1.0.0_20240719_stb.apk'
						download=''
					>
						<img src='/src/assets/images/smartTV_download.png' alt='' />
					</a>
					<a
						href='https://sapatv.xyz/sapatv/stb/SapaTV_stb_r_0002_1.0.0_20240719_stb.apk'
						download=''
					>
						<img src='/src/assets/images/TVStick_download.png' alt='' />
					</a>
				</div>
			</div>
			<p className='heading-paragraph'>
				If your TV supports <span>USB flash drive</span> just download the APK
				and use the flash drive to install it. For more installation related
				questions, please consult <span>support@sapatv.ng</span>
			</p>
		</div>
	);
};

export default Download;
