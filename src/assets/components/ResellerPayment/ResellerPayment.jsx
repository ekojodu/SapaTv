import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ResellerPayment = () => {
	const location = useLocation();

	// Retrieve the totalCost, plans, and quantities passed via state from Reseller page
	const { totalCost, plans, quantities } = location.state || {
		totalCost: 0,
		plans: [],
		quantities: {},
	};

	// Generate the reference number when the page loads
	const [referenceNumber, setReferenceNumber] = useState('');

	useEffect(() => {
		// Generate a reference number on page load
		const generateReferenceNumber = () => {
			const chars =
				'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			let reference = '';
			for (let i = 0; i < 10; i++) {
				reference += chars.charAt(Math.floor(Math.random() * chars.length));
			}
			return reference;
		};

		// Set the generated reference number
		setReferenceNumber(generateReferenceNumber());
	}, []);

	const [formData, setFormData] = useState({ name: '', email: '' });

	// Handle input changes
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.name || !formData.email) {
			alert('Please fill out all required fields.');
			return;
		}

		// Simulating form submission logic
		alert('Payment processing...');
	};

	return (
		<div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
			<h2 style={{ marginBottom: '40px' }}>Reseller Payment Page</h2>
			<form
				onSubmit={handleSubmit}
				style={{ marginBottom: '35px' }}
				className='subscribe-form'
			>
				{/* Display the totalCost value correctly */}
				<p>
					The total amount to be paid is: <strong>₦{totalCost}</strong>
				</p>
				<p>
					Your payment reference number is: <strong>{referenceNumber}</strong>
				</p>

				{/* Display purchased plans and their quantities */}
				<h3>Purchased Plans:</h3>
				{plans.length > 0 ? (
					<ul style={{ paddingLeft: '20px' }}>
						{plans.map((plan) => (
							<li key={plan.id} style={{ marginBottom: '10px' }}>
								{plan.name} - Quantity: {quantities[plan.id] || 0}
								{quantities[plan.id] > 0 && (
									<span> (₦{plan.price * quantities[plan.id]})</span>
								)}
							</li>
						))}
					</ul>
				) : (
					<p>No plans selected</p>
				)}

				<label>
					Name: <span style={{ color: 'red' }}>*</span>
					<input
						type='text'
						name='name'
						value={formData.name}
						onChange={handleInputChange}
						placeholder='Enter your name'
						required
						style={{
							width: '100%',
							padding: '10px',
							border: '1px solid #ccc',
							borderRadius: '5px',
							boxSizing: 'border-box',
						}}
					/>
				</label>

				<label>
					Email: <span style={{ color: 'red' }}>*</span>
					<input
						type='email'
						name='email'
						value={formData.email}
						onChange={handleInputChange}
						placeholder='Enter your email'
						required
						style={{
							width: '100%',
							padding: '10px',
							border: '1px solid #ccc',
							borderRadius: '5px',
							boxSizing: 'border-box',
						}}
					/>
				</label>

				<button
					type='submit'
					style={{
						padding: '10px 20px',
						backgroundColor: '#28a745',
						color: 'white',
						border: 'none',
						borderRadius: '5px',
						cursor: 'pointer',
						fontSize: '16px',
						width: '25%',
					}}
				>
					Pay Now
				</button>
			</form>
		</div>
	);
};

export default ResellerPayment;
