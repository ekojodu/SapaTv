// import { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';

// const loadFlutterwaveScript = () => {
// 	return new Promise((resolve, reject) => {
// 		const script = document.createElement('script');
// 		script.src = 'https://checkout.flutterwave.com/v3.js';
// 		script.onload = () => resolve(true);
// 		script.onerror = () => reject(false);
// 		document.body.appendChild(script);
// 	});
// };
// const ResellerPayment = () => {
// 	const navigate = useNavigate();
// 	useEffect(() => {
// 		loadFlutterwaveScript()
// 			.then(() => {
// 				console.log('Flutterwave script loaded successfully');
// 			})
// 			.catch(() => {
// 				console.error('Failed to load Flutterwave script');
// 			});
// 	}, []);
// 	const location = useLocation();

// 	// State to manage loading and details
// 	const [isLoaded, setIsLoaded] = useState(false);
// 	const [details, setDetails] = useState(() => {
// 		const savedDetails = sessionStorage.getItem('resellerDetails');
// 		return savedDetails
// 			? JSON.parse(savedDetails)
// 			: { totalCost: 0, plans: [], quantities: {} };
// 	});

// 	const [referenceNumber, setReferenceNumber] = useState('');
// 	const [formData, setFormData] = useState({
// 		name: '',
// 		email: '',
// 	});

// 	useEffect(() => {
// 		// Save location.state to local state and session storage if available
// 		if (location.state) {
// 			const { totalCost = 0, plans = [], quantities = {} } = location.state;
// 			const newDetails = { totalCost, plans, quantities };

// 			setDetails(newDetails); // Update component state
// 			sessionStorage.setItem('resellerDetails', JSON.stringify(newDetails)); // Persist to sessionStorage
// 			setIsLoaded(true); // Mark as loaded
// 		} else if (details.totalCost > 0) {
// 			setIsLoaded(true); // Use session storage data if already loaded
// 		}
// 	}, [location.state]);

// 	// Generate a reference number once
// 	useEffect(() => {
// 		const generateReferenceNumber = () => {
// 			const chars =
// 				'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
// 			let reference = '';
// 			for (let i = 0; i < 10; i++) {
// 				reference += chars.charAt(Math.floor(Math.random() * chars.length));
// 			}
// 			return reference;
// 		};
// 		setReferenceNumber(generateReferenceNumber());
// 	}, []);

// 	// Form change handler
// 	const handleInputChange = (e) => {
// 		const { name, value } = e.target;
// 		setFormData((prev) => ({ ...prev, [name]: value }));
// 	};

// 	// Flutterwave payment function
// 	const handlePayment = (e) => {
// 		e.preventDefault();

// 		const FlutterwaveCheckout = window.FlutterwaveCheckout;

// 		FlutterwaveCheckout({
// 			public_key: 'FLWPUBK_TEST-6307e10c1faf0f32c15ab623ed6a67cc-X', // Replace with your Flutterwave public key
// 			tx_ref: referenceNumber,
// 			amount: details.totalCost,
// 			currency: 'NGN',
// 			payment_options: 'card, mobilemoney, ussd',
// 			customer: {
// 				email: formData.email,
// 				phonenumber: '', // Optional
// 				name: formData.name,
// 			},
// 			customizations: {
// 				title: 'Reseller Payment',
// 				description: 'Payment for purchased plans',
// 				logo: 'https://your-logo-url.com/logo.png', // Optional: Add your logo URL
// 			},
// 			callback: (data) => {
// 				console.log('Payment successful:', data);
// 				alert('Payment Successful!');
// 				// Redirect or perform other actions after payment success
// 				navigate('/thank-you', { state: { paymentData: data } });
// 			},
// 			onclose: () => {
// 				console.log('Payment closed');
// 				alert('Payment was not completed.');
// 			},
// 		});
// 	};

// 	// Ensure loading is shown if data isn't initialized
// 	if (!isLoaded) {
// 		return <div>Loading...</div>;
// 	}

// 	return (
// 		<div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
// 			<h2 style={{ marginBottom: '40px' }}>Reseller Payment Page</h2>
// 			<form
// 				onSubmit={handlePayment}
// 				style={{ marginBottom: '35px' }}
// 				className='subscribe-form'
// 			>
// 				<p>
// 					The total amount to be paid is: <strong>₦{details.totalCost}</strong>
// 				</p>
// 				<p>
// 					Your payment reference number is: <strong>{referenceNumber}</strong>
// 				</p>

// 				<h3>Purchased Plans:</h3>
// 				{details.plans.length > 0 ? (
// 					<ul style={{ paddingLeft: '20px' }}>
// 						{details.plans.map((plan) => (
// 							<li key={plan.id} style={{ marginBottom: '10px', color: '#000' }}>
// 								{plan.name} - Quantity: {details.quantities[plan.id] || 0}
// 								{details.quantities[plan.id] > 0 && (
// 									<span> (₦{plan.price * details.quantities[plan.id]})</span>
// 								)}
// 							</li>
// 						))}
// 					</ul>
// 				) : (
// 					<p>No plans selected</p>
// 				)}

// 				<div style={{ marginTop: '20px' }}>
// 					<label>
// 						Name: <span className='text-danger'>*</span>
// 						<input
// 							type='text'
// 							name='name'
// 							value={formData.name}
// 							onChange={handleInputChange}
// 							style={{ marginLeft: '10px', marginBottom: '10px' }}
// 							required
// 						/>
// 					</label>
// 					<br />
// 					<label>
// 						Email: <span className='text-danger'>*</span>
// 						<input
// 							type='email'
// 							name='email'
// 							value={formData.email}
// 							onChange={handleInputChange}
// 							style={{ marginLeft: '10px', marginBottom: '20px' }}
// 							required
// 						/>
// 					</label>
// 				</div>
// 				<button
// 					type='submit'
// 					onClick={handlePayment}
// 					style={{
// 						padding: '10px 20px',
// 						backgroundColor: 'rgb(13, 197, 13)',
// 						color: 'white',
// 						width: '50%',
// 						maxWidth: '300px',
// 						margin: '0 auto',
// 						display: 'block',
// 					}}
// 				>
// 					Pay Now
// 				</button>
// 			</form>
// 		</div>
// 	);
// };

// export default ResellerPayment;

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const loadFlutterwaveScript = () => {
	return new Promise((resolve, reject) => {
		const script = document.createElement('script');
		script.src = 'https://checkout.flutterwave.com/v3.js';
		script.onload = () => resolve(true);
		script.onerror = () => reject(false);
		document.body.appendChild(script);
	});
};

const ResellerPayment = () => {
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		loadFlutterwaveScript()
			.then(() => {
				console.log('Flutterwave script loaded successfully');
			})
			.catch(() => {
				console.error('Failed to load Flutterwave script');
			});
	}, []);

	// State to manage loading and details
	const [isLoaded, setIsLoaded] = useState(false);
	const [details, setDetails] = useState(() => {
		const savedDetails = sessionStorage.getItem('resellerDetails');
		return savedDetails
			? JSON.parse(savedDetails)
			: { totalCost: 0, plans: [], quantities: {} };
	});

	const [referenceNumber, setReferenceNumber] = useState('');

	// Use the location.state data to update the details
	useEffect(() => {
		// Save location.state to local state and session storage if available
		if (location.state) {
			const {
				totalCost = 0,
				plans = [],
				quantities = {},
				name,
				email,
			} = location.state;
			const newDetails = { totalCost, plans, quantities, name, email };

			setDetails(newDetails); // Update component state
			sessionStorage.setItem('resellerDetails', JSON.stringify(newDetails)); // Persist to sessionStorage
			setIsLoaded(true); // Mark as loaded
		} else if (details.totalCost > 0) {
			setIsLoaded(true); // Use session storage data if already loaded
		}
	}, [location.state]);

	// Generate a reference number once
	useEffect(() => {
		const generateReferenceNumber = () => {
			const chars =
				'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			let reference = '';
			for (let i = 0; i < 10; i++) {
				reference += chars.charAt(Math.floor(Math.random() * chars.length));
			}
			return reference;
		};
		setReferenceNumber(generateReferenceNumber());
	}, []);

	// Flutterwave payment function
	const handlePayment = (e) => {
		e.preventDefault();

		const FlutterwaveCheckout = window.FlutterwaveCheckout;

		// Construct the dynamic payload
		const payload = {
			tx_ref: referenceNumber,
			customerEmail: details.email,
			customerName: details.name,
			plans: details.plans.map((plan) => ({
				id: plan.id,
				quantity: details.quantities[plan.id] || 0,
			})),
			type: 'reseller', // Always 'reseller' for reseller payments
			status: 'successful', // Example status, replace with actual dynamic value if available
		};

		// Payment integration with Flutterwave
		FlutterwaveCheckout({
			public_key: 'FLWPUBK_TEST-6307e10c1faf0f32c15ab623ed6a67cc-X', // Replace with your Flutterwave public key
			tx_ref: referenceNumber,
			amount: details.totalCost,
			currency: 'NGN',
			payment_options: 'card, mobilemoney, ussd',
			customer: {
				email: details.email,
				phonenumber: '', // Optional
				name: details.name,
			},
			customizations: {
				title: 'Reseller Payment',
				description: 'Payment for purchased plans',
				logo: 'https://your-logo-url.com/logo.png', // Optional: Add your logo URL
			},
			callback: (data) => {
				console.log('Payment successful:', data);
				alert('Payment Successful!');
				// Redirect or perform other actions after payment success
				navigate('/', { state: { paymentData: data, payload } });
			},
			onclose: () => {
				console.log('Payment closed');
				alert('Check your mailbox');
				navigate('/'); // Navigate to the home page
			},
		});
	};

	// Ensure loading is shown if data isn't initialized
	if (!isLoaded) {
		return <div>Loading...</div>;
	}

	return (
		<div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
			<h2 style={{ marginBottom: '40px' }}>Reseller Payment Page</h2>
			<form
				onSubmit={handlePayment}
				style={{ marginBottom: '35px' }}
				className='subscribe-form'
			>
				<p>
					The total amount to be paid is: <strong>₦{details.totalCost}</strong>
				</p>
				<p>
					Your payment reference number is: <strong>{referenceNumber}</strong>
				</p>

				<h3>Purchased Plans:</h3>
				{details.plans.length > 0 ? (
					<ul style={{ paddingLeft: '20px' }}>
						{details.plans.map((plan) => (
							<li key={plan.id} style={{ marginBottom: '10px', color: '#000' }}>
								{plan.name} - Quantity: {details.quantities[plan.id] || 0}
								{details.quantities[plan.id] > 0 && (
									<span> (₦{plan.price * details.quantities[plan.id]})</span>
								)}
							</li>
						))}
					</ul>
				) : (
					<p>No plans selected</p>
				)}

				<div style={{ marginTop: '20px' }}>
					<p>
						<strong>Name:</strong> {details.name}
					</p>
					<p>
						<strong>Email:</strong> {details.email}
					</p>
				</div>

				<button
					type='submit'
					onClick={handlePayment}
					style={{
						padding: '10px 20px',
						backgroundColor: 'rgb(13, 197, 13)',
						color: 'white',
						width: '50%',
						maxWidth: '300px',
						margin: '0 auto',
						display: 'block',
					}}
				>
					Pay Now
				</button>
			</form>
		</div>
	);
};

export default ResellerPayment;
