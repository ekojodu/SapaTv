import React from 'react'; // Ensure you create and use this CSS file
import getwayMb from '/src/assets/images/getwayMb.png';
import get7Days from '/src/assets/images/get7Days.png';
const Home = () => {
	return (
		<div className='home-content'>
			<div className='background-container'>
				<div className='home-images'>
					<img src={getwayMb} alt='Image 1' className='home-img' />
					<img src={get7Days} alt='Image 2' className='home-img' />
				</div>
			</div>
		</div>
	);
};

export default Home;
