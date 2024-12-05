import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ResellerPayment = () => {
	const location = useLocation();
	const navigate = useNavigate();

	// Retrieve the totalCost passed via state from Reseller page
	const { totalCost } = location.state || { totalCost: 0 };

	// Generate the reference number when the page loads
	const [referenceNumber, setReferenceNumber] = useState('');

	useEffect(() => {
		// Generate a reference number on page load
		const generatedReferenceNumber = Math.random()
			.toString(36)
			.substr(2, 9)
			.toUpperCase();
		setReferenceNumber(generatedReferenceNumber);
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

		// Prepare data to send to the backend
		const requestData = {
			name: formData.name,
			email: formData.email,
			totalCost,
			referenceNumber,
		};

		try {
			// Send request to backend to generate purchase code
			const response = await fetch(
				'https://your-backend-api.com/generate-code',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(requestData),
				}
			);

			const data = await response.json();

			if (response.ok) {
				// Successful response, show the code to the user
				alert(`Payment initiated with reference: ${referenceNumber}`);

				// Navigate to a success page with the response data
				navigate('/payment-success', {
					state: {
						reference: referenceNumber,
						totalCost,
						...formData,
						purchaseCode: data.purchaseCode,
					},
				});
			} else {
				// Handle backend errors (e.g., failed payment, backend issues)
				alert(`Error: ${data.message || 'Payment failed'}`);
			}
		} catch {
			alert(
				'An error occurred while processing your payment. Please try again.'
			);
		}
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
