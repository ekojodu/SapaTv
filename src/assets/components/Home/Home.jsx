import React from 'react'; // Ensure you create and use this CSS file

const Home = () => {
	return (
		<div className='home-content'>
			<div className='background-container'>
				<div className='home-images'>
					<img
						src='../src/assets/images/getwayMb.png'
						alt='Image 1'
						className='home-img'
					/>
					<img
						src='../src/assets/images/get7Days.png'
						alt='Image 2'
						className='home-img'
					/>
				</div>
			</div>
		</div>
	);
};

export default Home;
