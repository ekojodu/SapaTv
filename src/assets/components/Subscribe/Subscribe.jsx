import { useLocation } from 'react-router-dom';

const Subscribe = () => {
	const location = useLocation();
	const plan = location.state?.plan;
	const type = location.state?.type; // Assuming the type ('subscribe' or 'reseller') is passed via location state

	// Handles form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const name = formData.get('name');
		const email = formData.get('email');

		// Add the type (subscribe or reseller) to the request data
		const data = {
			name,
			email,
			plan,
			type, // Pass type to backend
		};
		// console.log(data);
		try {
			// API call to initiate payment
			const response = await fetch(
				'https://sapatv.onrender.com/api/initiate-payment',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data),
				}
			);

			const result = await response.json();

			if (response.ok && result.paymentLink) {
				// Redirect to Flutterwave payment link
				window.location.href = result.paymentLink;
			} else {
				alert('Failed to initiate payment. Please try again.');
			}
		} catch (error) {
			console.error('Error initiating payment:', error);
			alert('An error occurred. Please try again later.');
		}
	};

	return (
		<div className='subscribe-form-container'>
			<h1>Subscribe</h1>
			<form className='subscribe-form' onSubmit={handleSubmit}>
				<h2>Get Started</h2>
				{plan && (
					<p>
						You have selected the <strong>{plan.name}</strong> plan for ₦
						{plan.price}.
					</p>
				)}

				<div className='form-row'>
					<label>
						Name: <span className='text-danger'>*</span>
						<input
							type='text'
							name='name'
							placeholder='Enter your name'
							required
						/>
					</label>
					<label>
						Email: <span className='text-danger'>*</span>
						<input
							type='email'
							name='email'
							placeholder='Enter your email'
							required
						/>
					</label>
				</div>

				<label>
					Plan: <span className='text-danger'>*</span>
					<select disabled>
						<option value={plan?.id}>{plan?.name || 'Select a plan'}</option>
					</select>
				</label>

				{/* Hidden input to pass the type */}
				{/* <input type='hidden' name='type' value={type || 'subscribe'} /> */}

				<button type='submit' className='button'>
					Make Payment
				</button>
				<p>
					For any complaints, contact us at{' '}
					<a href='mailto:support@saptav.ng' className='span'>
						support@saptatv.ng
					</a>{' '}
					| <span className='span'>+234 802 916 1107</span>
				</p>
			</form>
		</div>
	);
};

export default Subscribe;
