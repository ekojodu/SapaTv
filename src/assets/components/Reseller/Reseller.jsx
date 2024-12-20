import { useState } from 'react';
const Reseller = () => {
	const plans = [
		{ id: 81, name: 'Mobile Weekly', price: 1200 },
		{ id: 82, name: 'Mobile Monthly', price: 3300 },
		{ id: 83, name: 'Standard Weekly', price: 2100 },
		{ id: 84, name: 'Standard Monthly', price: 6800 },
	];

	const [quantities, setQuantities] = useState({});
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [error, setError] = useState('');

	const totalCost = plans.reduce(
		(total, plan) => total + (quantities[plan.id] || 0) * plan.price,
		0
	);
	const handleQuantityChange = (id, value) => {
		// Check if value is a valid number or empty string
		const isValid = value === '' || /^[0-9]+$/.test(value); // Allow empty or numbers only
		const errorMessage =
			isValid && parseInt(value, 10) % 10 === 0
				? ''
				: 'Quantity must be a non-negative multiple of 10.';

		// Update the state based on the value (allowing empty input and valid numbers)
		setQuantities((prev) => ({
			...prev,
			[id]: isValid ? value : prev[id], // Update only if valid
		}));

		// Set the error message if invalid
		setError(errorMessage);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Check if name or email is missing
		if (!name || !email) {
			setError('Please provide both your name and email.');
			return;
		}

		// Ensure that the total cost is greater than 0
		if (totalCost <= 0) {
			setError('Please select at least one plan.');
			return;
		}

		// Filter plans with quantity greater than 0
		const selectedPlans = plans
			.filter((plan) => quantities[plan.id] > 0)
			.map((plan) => ({
				id: plan.id,
				name: plan.name,
				quantity: quantities[plan.id], // Send only selected plans
				price: plan.price,
			}));

		// Log the selected plans and other data before sending

		const data = {
			name,
			email,
			// amount: totalCost,
			plan: { plans: selectedPlans }, // Ensure this matches the backend expectations
			type: 'reseller',
		};

		try {
			const response = await fetch(
				'https://sapatv.onrender.com/api/initiate-payment',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data),
				}
			);

			const result = await response.json();

			// console.log('Payment response:', result);

			if (response.ok && result.paymentLink) {
				window.location.href = result.paymentLink; // Redirecting to payment link
			} else {
				setError('Failed to initiate payment. Please try again.');
			}
		} catch (err) {
			console.error('Error initiating payment:', err);
			setError('An unexpected error occurred. Please try again later.');
		}
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
				onSubmit={handleSubmit}
			>
				{/* Name and Email Fields */}
				<div style={{ marginBottom: '20px' }}>
					<label
						htmlFor='name'
						style={{
							display: 'block',
							marginBottom: '5px',
							fontSize: 'clamp(0.9rem, 2vw, 1rem)',
							color: '#000',
						}}
					>
						Name:
					</label>
					<input
						id='name'
						type='text'
						value={name}
						onChange={(e) => setName(e.target.value)}
						style={{
							width: '100%',
							padding: '8px',
							borderRadius: '4px',
							border: '1px solid #ccc',
						}}
						required
					/>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<label
						htmlFor='email'
						style={{
							display: 'block',
							marginBottom: '5px',
							fontSize: 'clamp(0.9rem, 2vw, 1rem)',
							color: '#000',
						}}
					>
						Email:
					</label>
					<input
						id='email'
						type='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						style={{
							width: '100%',
							padding: '8px',
							borderRadius: '4px',
							border: '1px solid #ccc',
						}}
						required
					/>
				</div>

				{/* Plans and Quantities */}
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
								value={quantities[plan.id] || ''}
								placeholder='0'
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

				{/* Total Cost */}
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

				{/* Proceed to Payment Button */}
				<div style={{ textAlign: 'center', marginTop: '20px' }}>
					<button
						type='submit'
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
						onMouseEnter={(e) =>
							(e.target.style.backgroundColor = 'rgb(9, 145, 9)')
						}
						onMouseLeave={(e) =>
							(e.target.style.backgroundColor = 'rgb(13, 197, 13)')
						}
					>
						Proceed to Payment
					</button>
				</div>

				{/* Error Handling */}
				{error && (
					<div style={{ color: 'red', marginTop: '10px', fontSize: '1rem' }}>
						{error}
					</div>
				)}
			</form>
		</div>
	);
};

export default Reseller;
