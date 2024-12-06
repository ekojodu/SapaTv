import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
const generateReference = () => {
	const chars =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let reference = '';
	for (let i = 0; i < 10; i++) {
		reference += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return reference;
};

const loadFlutterwaveScript = () => {
	return new Promise((resolve, reject) => {
		const script = document.createElement('script');
		script.src = 'https://checkout.flutterwave.com/v3.js';
		script.onload = () => resolve(true);
		script.onerror = () => reject(false);
		document.body.appendChild(script);
	});
};

const CompleteTransaction = () => {
	const location = useLocation();
	const { name, email, plan } = location.state || {};
	const reference = generateReference();

	useEffect(() => {
		loadFlutterwaveScript()
			.then(() => {
				console.log('Flutterwave script loaded successfully');
			})
			.catch(() => {
				console.error('Failed to load Flutterwave script');
			});
	}, []);

	const handlePayment = (e) => {
		e.preventDefault();

		if (!window.FlutterwaveCheckout) {
			alert('Flutterwave script is not loaded. Please try again later.');
			return;
		}

		const amount = plan?.price || 0;

		window.FlutterwaveCheckout({
			public_key: 'FLWPUBK_TEST-6307e10c1faf0f32c15ab623ed6a67cc-X', // Replace with your test public key
			tx_ref: reference,
			amount: amount,
			currency: 'NGN',
			payment_options: 'card, mobilemoney, ussd',
			customer: {
				email: email || 'noemail@example.com',
				phonenumber: '', // Optional: Add phone number here
				name: name || 'Unknown User',
			},
			customizations: {
				title: 'Reseller Payment',
				description: `Payment for ${plan?.name || 'selected plan'}`,
				logo: 'https://your-logo-url.com/logo.png', // Optional: Add your logo URL
			},
			callback: (data) => {
				console.log('Payment successful:', data);
				alert('Payment Successful!');
				// Redirect or perform other actions after payment success
			},
			onclose: () => {
				console.log('Payment closed');
				alert('Payment was not completed.');
			},
		});
	};

	return (
		<div className='transaction-details-container'>
			<h1>Transaction Details</h1>

			<form className='subscribe-form'>
				<h1>Get Started</h1>
				<p>
					Please feel free to reach out to us for any complaints{' '}
					<span>support@saptav.ng</span> | <span>+234 802 916 1107</span>
				</p>
				<p>
					Please take note of this reference: <strong>{reference}</strong>. Use
					this to contact us for any issues related to this transaction.
				</p>

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
				<button onClick={handlePayment} type='button' className='button'>
					Pay Now
				</button>
			</form>
		</div>
	);
};

export default CompleteTransaction;
