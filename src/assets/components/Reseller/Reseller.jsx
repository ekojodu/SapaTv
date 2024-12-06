import { useState } from 'react';
import { Link } from 'react-router-dom';

const Reseller = () => {
	const plans = [
		{ id: 81, name: 'Mobile Weekly', price: 1500 },
		{ id: 82, name: 'Mobile Monthly', price: 3500 },
		{ id: 83, name: 'Standard Weekly', price: 2300 },
		{ id: 84, name: 'Standard Monthly', price: 7000 },
	];

	const [quantities, setQuantities] = useState({});

	const totalCost = plans.reduce(
		(total, plan) => total + (quantities[plan.id] || 0) * plan.price,
		0
	);

	const handleQuantityChange = (id, value) => {
		const quantity = Math.max(0, parseInt(value) || 0);
		setQuantities({ ...quantities, [id]: quantity });
	};

	// Passing totalCost, plans, and quantities via Link's state
	return (
		<div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
			<h2>Reseller Plans</h2>
			<form
				action=''
				style={{
					backgroundColor: '#f9f9f9',
					padding: '2rem',
					borderRadius: '8px',
					boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
					color: '#000',
				}}
			>
				{plans.map((plan) => (
					<div
						key={plan.id}
						style={{
							marginBottom: '15px',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<div>
							<h4>{plan.name}</h4>
							<p>Price: ₦{plan.price}</p>
						</div>
						<div>
							<label htmlFor={`quantity-${plan.id}`}>Quantity</label>
							<input
								id={`quantity-${plan.id}`}
								type='number'
								value={quantities[plan.id] || 0}
								onChange={(e) => handleQuantityChange(plan.id, e.target.value)}
								style={{
									width: '60px',
									marginLeft: '10px',
								}}
							/>
						</div>
					</div>
				))}
				<hr />
				<h3 style={{ color: '#000' }}>Total: ₦{totalCost}</h3>
				{/* Using Link to pass data as state */}
				<Link
					to={{
						pathname: '/resellerPayment',
						state: {
							totalCost, // Total cost
							plans, // Plans array
							quantities, // Quantities object
						},
					}}
					style={{
						backgroundColor: 'rgb(13, 197, 13)',
						color: '#fff',
						border: 'none',
						padding: '10px 20px',
						borderRadius: '5px',
						cursor: 'pointer',
						fontSize: '16px',
						textDecoration: 'none',
						display: 'inline-block',
					}}
				>
					Make Payment
				</Link>
			</form>
		</div>
	);
};

export default Reseller;
