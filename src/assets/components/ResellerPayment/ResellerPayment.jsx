import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import useScript from '../../hooks/useScript';

const ResellerPayment = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { isLoaded, hasError } = useScript(
		'https://checkout.flutterwave.com/v3.js'
	);

	// State to manage loading and details
	const [hasLoaded, setHasLoaded] = useState(false);
	const [details, setDetails] = useState(() => {
		const savedDetails = sessionStorage.getItem('resellerDetails');
		return savedDetails
			? JSON.parse(savedDetails)
			: { totalCost: 0, plans: [], quantities: {} };
	});
	const [referenceNumber, setReferenceNumber] = useState('');
	const [isProcessing, setIsProcessing] = useState(false); // To manage processing state
	const [errorMessage, setErrorMessage] = useState('');
	const [csrfToken, setCsrfToken] = useState(''); // State to store CSRF token
	const [subaccountId, setSubaccountId] = useState(
		'RS_F5BBF9CD9041035FDAC48B466C0215C2'
	);

	// Fetch CSRF token from backend
	useEffect(() => {
		// Fetch CSRF token on component mount
		axios
			.get('/csrf-token') // Make sure your backend has this endpoint
			.then((response) => {
				setCsrfToken(response.data.csrfToken); // Store the token in the state
			})
			.catch((error) => {
				console.error('Error fetching CSRF token:', error);
			});
	}, []);
	useEffect(() => {
		if (isLoaded) {
			setIsLoading(false);
			// console.log('Flutterwave script has loaded');
		} else if (hasError) {
			setIsLoading(false);
			setErrorMessage(
				'Error loading Flutterwave script. Please try again later.'
			);
			// console.log('Error loading Flutterwave script');
		}
	}, [isLoaded, hasError]);
	// Use the location.state data to update the details
	useEffect(() => {
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
			setHasLoaded(true); // Mark as loaded
		} else if (details.totalCost > 0) {
			setHasLoaded(true); // Use session storage data if already loaded
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

	// Backend API call to confirm the payment
	const handleBackendAPI = (transactionData) => {
		if (!csrfToken) {
			// If CSRF token is not yet available, exit the function
			console.error('CSRF Token is missing!');
			return;
		}

		axios
			.post('http://localhost:3000/payment-confirmation', transactionData, {
				headers: {
					'CSRF-Token': csrfToken, // Add CSRF token to the header
				},
			})
			.then((response) => {
				console.log('Transaction processed successfully:', response.data);
				setIsProcessing(false); // Reset processing state
			})
			.catch((error) => {
				console.error('Error processing transaction:', error);
				setErrorMessage('Transaction failed. Please try again later.');
				setIsProcessing(false); // Reset processing state
			});
	};

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
			status: 'pending', // Adjust this as necessary based on the payment flow
		};

		// Payment integration with Flutterwave
		FlutterwaveCheckout({
			public_key: 'FLWPUBK-25e44f726691b9937900e7db11692383-X', // Replace with your Flutterwave public key
			tx_ref: referenceNumber,
			amount: details.totalCost,
			currency: 'NGN',
			payment_options: 'card, mobilemoney, ussd',
			subaccount_id: subaccountId,
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
				// console.log('Payment successful:', data);
				const transactionData = {
					...payload, // Spread the existing payload properties
					status: data.status, // Use the status from the Flutterwave response
					subaccount_id: subaccountId,
				};
				// alert('Payment Successful!');
				handleBackendAPI(transactionData); // Send data to backend
			},
			onclose: () => {
				console.log('Payment closed');
				alert('Check your mailbox');
				navigate('/'); // Navigate to the home page
			},
		});
	};

	// Ensure loading is shown if data isn't initialized
	if (!hasLoaded) {
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
					disabled={isProcessing} // Disable button while processing
				>
					{isProcessing ? 'Processing...' : 'Pay Now'}
				</button>
			</form>
			{errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
		</div>
	);
};

export default ResellerPayment;
