// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Reseller = () => {
// 	const plans = [
// 		{ id: 81, name: 'Mobile Weekly', price: 1500 },
// 		{ id: 82, name: 'Mobile Monthly', price: 3500 },
// 		{ id: 83, name: 'Standard Weekly', price: 2300 },
// 		{ id: 84, name: 'Standard Monthly', price: 7000 },
// 	];

// 	const [quantities, setQuantities] = useState({});
// 	const navigate = useNavigate(); // Use the navigate hook

// 	// Calculate the total cost based on selected quantities
// 	const totalCost = plans.reduce(
// 		(total, plan) => total + (quantities[plan.id] || 0) * plan.price,
// 		0
// 	);

// 	const handleQuantityChange = (id, value) => {
// 		const quantity = Number.isNaN(parseInt(value)) ? 0 : Math.max(0, parseInt(value));
// 		setQuantities((prevQuantities) => ({
// 			...prevQuantities,
// 			[id]: quantity,
// 		}));
// 	};

// 	const handleProceedToPayment = (e) => {
// 		e.preventDefault(); // Prevent form submission
// 		if (totalCost <= 0) {
// 			alert('Please select at least one plan.');
// 			return;
// 		}
// 		// Navigate to '/resellerPayment' and pass state
// 		navigate('/resellerPayment', {
// 			state: {
// 				totalCost: totalCost,
// 				plans: plans.filter((plan) => quantities[plan.id] > 0),
// 				quantities: quantities,
// 			},
// 		});
// 	};

// 	console.log(totalCost, plans, quantities);

// 	return (
// 		<div
// 			style={{
// 				padding: '20px',
// 				maxWidth: '800px',
// 				margin: '0 auto',
// 				fontFamily: 'Arial, sans-serif',
// 			}}
// 		>
// 			<h2 style={{ textAlign: 'center', color: '#fff' }}>Choose Your Plans</h2>

// 			<form
// 				style={{
// 					backgroundColor: '#f9f9f9',
// 					padding: '2rem',
// 					borderRadius: '10px',
// 					boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
// 				}}
// 			>
// 				{plans.map((plan) => (
// 					<div
// 						key={plan.id}
// 						style={{
// 							display: 'flex',
// 							justifyContent: 'space-between',
// 							alignItems: 'center',
// 							marginBottom: '20px',
// 							borderBottom: '1px solid #ddd',
// 							paddingBottom: '10px',
// 							color: '#000',
// 						}}
// 					>
// 						<div style={{ flex: 1 }}>
// 							<h4 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>
// 								{plan.name}
// 							</h4>
// 							<p style={{ margin: '0', fontSize: '16px' }}>₦{plan.price}</p>
// 						</div>
// 						<div style={{ flex: 0.3 }}>
// 							<label
// 								htmlFor={`quantity-${plan.id}`}
// 								style={{
// 									fontSize: '14px',
// 									color: '#000',
// 									marginRight: '10px',
// 								}}
// 							>
// 								Quantity:
// 							</label>
// 							<input
// 								id={`quantity-${plan.id}`}
// 								type='number'
// 								value={quantities[plan.id] || 0}
// 								onChange={(e) => handleQuantityChange(plan.id, e.target.value)}
// 								style={{
// 									width: '60px',
// 									padding: '5px',
// 									borderRadius: '4px',
// 									border: '1px solid #ccc',
// 								}}
// 							/>
// 						</div>
// 					</div>
// 				))}
// 				<div
// 					style={{
// 						borderTop: '2px solid #ddd',
// 						paddingTop: '15px',
// 						marginTop: '15px',
// 						textAlign: 'right',
// 					}}
// 				>
// 					<h3 style={{ color: '#333' }}>
// 						Total Cost: <span style={{ color: 'green' }}>₦{totalCost}</span>
// 					</h3>
// 				</div>
// 				{/* Make Payment Button */}
// 				<div style={{ textAlign: 'center', marginTop: '20px' }}>
// 					<button
// 						onClick={handleProceedToPayment} // Trigger navigation here
// 						style={{
// 							backgroundColor: 'rgb(13, 197, 13)',
// 							color: '#fff',
// 							border: 'none',
// 							padding: '12px 30px',
// 							borderRadius: '5px',
// 							cursor: 'pointer',
// 							fontSize: '18px',
// 							transition: 'background-color 0.3s',
// 						}}
// 						onMouseEnter={(e) => (e.target.style.backgroundColor = 'green')}
// 						onMouseLeave={(e) =>
// 							(e.target.style.backgroundColor = 'rgb(13, 197, 13)')
// 						}
// 					>
// 						Proceed to Payment
// 					</button>
// 				</div>
// 			</form>
// 		</div>
// 	);
// };

// export default Reseller;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Reseller = () => {
	const plans = [
		{ id: 81, name: 'Mobile Weekly', price: 1500 },
		{ id: 82, name: 'Mobile Monthly', price: 3500 },
		{ id: 83, name: 'Standard Weekly', price: 2300 },
		{ id: 84, name: 'Standard Monthly', price: 7000 },
	];

	const [quantities, setQuantities] = useState({});
	const navigate = useNavigate();

	// Calculate the total cost based on selected quantities
	const totalCost = plans.reduce(
		(total, plan) => total + (quantities[plan.id] || 0) * plan.price,
		0
	);

	const handleQuantityChange = (id, value) => {
		const quantity = Number.isNaN(parseInt(value))
			? 0
			: Math.max(0, parseInt(value));
		setQuantities((prevQuantities) => ({
			...prevQuantities,
			[id]: quantity,
		}));
	};

	const handleProceedToPayment = (e) => {
		e.preventDefault();
		if (totalCost <= 0) {
			alert('Please select at least one plan.');
			return;
		}
		navigate('/resellerPayment', {
			state: {
				totalCost: totalCost,
				plans: plans.filter((plan) => quantities[plan.id] > 0),
				quantities: quantities,
			},
		});
	};

	return (
		<div
			style={{
				padding: '20px',
				maxWidth: '800px',
				margin: '0 auto',
				fontFamily: 'Arial, sans-serif',
			}}
		>
			<h2
				style={{
					textAlign: 'center',
					color: '#fff',
					fontSize: 'clamp(1.5rem, 3vw, 2rem)',
				}}
			>
				Choose Your Plans
			</h2>

			<form
				style={{
					backgroundColor: '#f9f9f9',
					padding: '2rem',
					borderRadius: '10px',
					boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
				}}
			>
				{plans.map((plan) => (
					<div
						key={plan.id}
						style={{
							display: 'flex',
							flexWrap: 'wrap',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginBottom: '20px',
							borderBottom: '1px solid #ddd',
							paddingBottom: '10px',
							color: '#000',
						}}
					>
						<div style={{ flex: 1, minWidth: '200px' }}>
							<h4
								style={{
									margin: '0 0 5px 0',
									fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
								}}
							>
								{plan.name}
							</h4>
							<p style={{ margin: '0', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
								₦{plan.price}
							</p>
						</div>
						<div style={{ flex: 0.3, minWidth: '120px', marginTop: '10px' }}>
							<label
								htmlFor={`quantity-${plan.id}`}
								style={{
									fontSize: 'clamp(0.8rem, 2vw, 1rem)',
									color: '#000',
									marginRight: '10px',
								}}
							>
								Quantity:
							</label>
							<input
								id={`quantity-${plan.id}`}
								type='number'
								value={quantities[plan.id] || 0}
								onChange={(e) => handleQuantityChange(plan.id, e.target.value)}
								style={{
									width: '60px',
									padding: '5px',
									borderRadius: '4px',
									border: '1px solid #ccc',
								}}
							/>
						</div>
					</div>
				))}
				<div
					style={{
						borderTop: '2px solid #ddd',
						paddingTop: '15px',
						marginTop: '15px',
						textAlign: 'right',
					}}
				>
					<h3 style={{ color: '#333', fontSize: 'clamp(1rem, 2.5vw, 1.5rem)' }}>
						Total Cost: <span style={{ color: 'green' }}>₦{totalCost}</span>
					</h3>
				</div>
				<div style={{ textAlign: 'center', marginTop: '20px' }}>
					<button
						onClick={handleProceedToPayment}
						style={{
							backgroundColor: 'rgb(13, 197, 13)',
							color: '#fff',
							border: 'none',
							padding: '12px 30px',
							borderRadius: '5px',
							cursor: 'pointer',
							fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
							transition: 'background-color 0.3s',
						}}
						onMouseEnter={(e) => (e.target.style.backgroundColor = 'green')}
						onMouseLeave={(e) =>
							(e.target.style.backgroundColor = 'rgb(13, 197, 13)')
						}
					>
						Proceed to Payment
					</button>
				</div>
			</form>
		</div>
	);
};

export default Reseller;
