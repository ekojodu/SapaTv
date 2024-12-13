import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useEffect, useState } from 'react';
import useScript from '../../hooks/useScript';
import axios from 'axios';

const generateReference = () => {
	const chars =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let reference = '';
	for (let i = 0; i < 10; i++) {
		reference += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return reference;
};

const CompleteTransaction = () => {
	const location = useLocation();
	const navigate = useNavigate(); // Initialize the navigate hook
	const { isLoaded, hasError } = useScript(
		'https://checkout.flutterwave.com/v3.js'
	);
	const [isProcessing, setIsProcessing] = useState(false); // State for tracking payment processing status
	const [errorMessage, setErrorMessage] = useState(''); // State for error handling
	const [isLoading, setIsLoading] = useState(true); // State to handle script loading state
	const [reference] = useState(generateReference()); // Generate reference once and store it in state
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

	const { name, email, plan } = location.state || {};
	// const reference = generateReference();

	const validatePlan = () => {
		if (!plan || !plan.name || !plan.price) {
			setErrorMessage('Invalid plan data. Please try again.');
			return false;
		}
		return true;
	};

	const handlePayment = (e) => {
		e.preventDefault();

		if (!window.FlutterwaveCheckout) {
			alert('Flutterwave script is not loaded. Please try again later.');
			return;
		}

		// Validate plan data
		if (!validatePlan()) return;

		const amount = plan.price || 0;

		setIsProcessing(true); // Mark as processing
		window.FlutterwaveCheckout({
			public_key: 'FLWPUBK-25e44f726691b9937900e7db11692383-X', // Replace with your test public key
			tx_ref: reference,
			amount: amount,
			currency: 'NGN',
			payment_options: 'card, mobilemoney, ussd',
			subaccount_id: subaccountId,
			customer: {
				email: email,
				// Optional: Add phone number here
				name: name,
			},
			customizations: {
				title: 'Reseller Payment',
				description: `Payment for ${plan?.name || 'selected plan'}`,
				logo: 'https://your-logo-url.com/logo.png', // Optional: Add your logo URL
			},

			callback: (data) => {
				// console.log('Payment successful:', data);
				alert('Payment Successful!: ', data);

				// Send type 'subscribe' to the backend when the payment is successful
				const transactionData = {
					tx_ref: reference,
					customerEmail: email,
					plans: [plan],
					type: 'subscribe', // Add the type here
					amount: amount,
					customerName: name,
					subaccount_id: subaccountId,
				};

				// Make the backend API call
				handleBackendAPI(transactionData);

				// Navigate to homepage after successful payment
				navigate('/'); // Redirect to homepage
			},
			onclose: () => {
				console.log('Payment closed');
				alert('Check your mailbox');
				navigate('/'); // Navigate to the home page
			},
		});
	};

	// Separate function to handle backend API call

	const handleBackendAPI = (transactionData) => {
		if (!csrfToken) {
			// If CSRF token is not yet available, exit the function
			// console.error('CSRF Token is missing!');
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

	return (
		<div className='transaction-details-container'>
			<h1>Transaction Details</h1>

			<form className='subscribe-form' onSubmit={handlePayment}>
				<h1>Get Started</h1>
				<p>
					Please feel free to reach out to us for any complaints{' '}
					<span>support@saptav.ng</span> | <span>+234 802 916 1107</span>
				</p>
				<p>
					Please take note of this reference: <strong>{reference}</strong>. Use
					this to contact us for any issues related to this transaction.
				</p>

				{isLoading && <p>Loading payment system...</p>}
				{errorMessage && <p className='error-message'>{errorMessage}</p>}

				<div className='transaction-details'>
					<h3>
						<u>Transaction Details</u>
					</h3>
					<div className='transaction-row'>
						<p className='transaction-key'>Name: {name || 'N/A'}</p>
					</div>
					<div className='transaction-row'>
						<p className='transaction-key'>Email: {email || 'N/A'}</p>
					</div>
					<div className='transaction-row'>
						<p className='transaction-key'>Reference: {reference}</p>
					</div>
					{plan && (
						<p>
							You subscribed to the <strong>{plan.name}</strong> plan for ₦
							<strong>{plan.price}</strong>.
						</p>
					)}
				</div>
				<button
					type='submit'
					className='button'
					disabled={isProcessing} // Disable the button during payment processing
				>
					{isProcessing ? 'Processing...' : 'Pay Now'}
				</button>
			</form>
		</div>
	);
};

export default CompleteTransaction;
