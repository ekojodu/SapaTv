import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import plan81 from '/src/assets/images/plan-81.png';
import plan82 from '/src/assets/images/plan-82.png';
import plan83 from '/src/assets/images/plan-83.png';
import plan84 from '/src/assets/images/plan-84.png';

const Plans = () => {
	const [plans, setPlans] = useState([]);

	// useEffect(() => {
	// 	fetch('/api/plans')
	// 		.then((response) => response.json())
	// 		.then((data) =>
	// 			setPlans(
	// 				data.map((plan) => ({
	// 					...plan,
	// 					image:
	// 						plan.id === 81
	// 							? plan81
	// 							: plan.id === 82
	// 							? plan82
	// 							: plan.id === 83
	// 							? plan83
	// 							: plan84,
	// 				}))
	// 			)
	// 		)
	// 		.catch((error) => console.error('Error fetching plans:', error));
	// }, []);
	useEffect(() => {
		// Mock data with associated images
		const mockPlans = [
			{ id: 81, name: 'Mobile Weekly', price: 1500, image: plan81 },
			{ id: 82, name: 'Mobile Monthly', price: 3500, image: plan82 },
			{ id: 83, name: 'Standard Weekly', price: 2000, image: plan83 },
			{ id: 84, name: 'Standard Monthly', price: 7000, image: plan84 },
		];
		setPlans(mockPlans);
	}, []);

	return (
		<div className='plans-section'>
			<h1 className='heading plans'>
				<b>Choose Your Plans</b>
			</h1>
			<p className='heading-paragraph plans'>
				Premium Live Streaming Experience
			</p>
			<div className='plans-grid'>
				{plans.map((plan) => (
					<Link
						to='/subscribe'
						state={{ plan }}
						key={plan.id}
						className='plan-card'
					>
						<img src={plan.image} alt={plan.name} className='plan-image' />
					</Link>
				))}
			</div>
		</div>
	);
};

export default Plans;