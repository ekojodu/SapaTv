import { useLocation } from 'react-router-dom';

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
	// const plan = location.state?.plan;
	const { name, email, plan } = location.state || {};
	const reference = generateReference();
	const handleSubmit = (e) => {
		e.preventDefault(); // Prevent default form submission behavior
		alert('Transaction details submitted successfully!');
	};
	return (
		<div className='transaction-details-container'>
			<h1>Transaction Details</h1>

			<form className='subscribe-form' onSubmit={handleSubmit}>
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
						<u>Transanction Details</u>
					</h3>
					<div className='transaction-row'>
						<p className='transaction-key'>Name: {name || 'N/A'}</p>
					</div>
					<div className='transaction-row'>
						<p className='transaction-key'>Email: {email || 'N/A'}</p>
					</div>

					<div className='transaction-row'>
						<p className='transaction-key'>Reference: {reference} </p>
					</div>
					{plan && (
						<p>
							You subscribed to the <strong>{plan.name}</strong> plan for ₦
							<strong>{plan.price}</strong>.
						</p>
					)}
				</div>
				<button type='submit' className='button'>Pay Now</button>
			</form>
		</div>
	);
};

export default CompleteTransaction;
