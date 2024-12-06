// import { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';

// const ResellerPayment = () => {
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

// 	// Submit handler
// 	const handleSubmit = (e) => {
// 		e.preventDefault();
// 		console.log('Payment initiated with data:', {
// 			...formData,
// 			details,
// 			referenceNumber,
// 		});
// 		alert('Payment initiated! Check console for details.');
// 	};

// 	// Ensure loading is shown if data isn't initialized
// 	if (!isLoaded) {
// 		return <div>Loading...</div>;
// 	}

// 	return (
// 		<div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
// 			<h2 style={{ marginBottom: '40px' }}>Reseller Payment Page</h2>
// 			<form
// 				onSubmit={handleSubmit}
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
// 							<li
// 								key={plan.id}
// 								style={{ marginBottom: '10px', color: '#000' }}
// 								required
// 							>
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
// 					style={{
// 						padding: '10px 20px',
// 						backgroundColor: 'rgb(13, 197, 13)',
// 						color: 'white',
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
import { useLocation } from 'react-router-dom';

const ResellerPayment = () => {
	const location = useLocation();

	// State to manage loading and details
	const [isLoaded, setIsLoaded] = useState(false);
	const [details, setDetails] = useState(() => {
		const savedDetails = sessionStorage.getItem('resellerDetails');
		return savedDetails
			? JSON.parse(savedDetails)
			: { totalCost: 0, plans: [], quantities: {} };
	});

	const [referenceNumber, setReferenceNumber] = useState('');
	const [formData, setFormData] = useState({
		name: '',
		email: '',
	});

	useEffect(() => {
		// Save location.state to local state and session storage if available
		if (location.state) {
			const { totalCost = 0, plans = [], quantities = {} } = location.state;
			const newDetails = { totalCost, plans, quantities };

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

	// Form change handler
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// Submit handler
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log('Payment initiated with data:', {
			...formData,
			details,
			referenceNumber,
		});
		alert('Payment initiated! Check console for details.');
	};

	// Ensure loading is shown if data isn't initialized
	if (!isLoaded) {
		return <div>Loading...</div>;
	}

	return (
		<div style={styles.container}>
			<h2 style={styles.heading}>Reseller Payment Page</h2>
			<form
				onSubmit={handleSubmit}
				style={styles.form}
				className='subscribe-form'
			>
				<p style={styles.infoText}>
					The total amount to be paid is: <strong>₦{details.totalCost}</strong>
				</p>
				<p style={styles.infoText}>
					Your payment reference number is: <strong>{referenceNumber}</strong>
				</p>

				<h3>Purchased Plans:</h3>
				{details.plans.length > 0 ? (
					<ul style={styles.planList}>
						{details.plans.map((plan) => (
							<li key={plan.id} style={styles.planItem}>
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

				<div style={styles.inputGroup}>
					<label>
						Name: <span style={styles.required}>*</span>
						<input
							type='text'
							name='name'
							value={formData.name}
							onChange={handleInputChange}
							style={styles.input}
							required
						/>
					</label>
					<label>
						Email: <span style={styles.required}>*</span>
						<input
							type='email'
							name='email'
							value={formData.email}
							onChange={handleInputChange}
							style={styles.input}
							required
						/>
					</label>
				</div>
				<button
					type='submit'
					style={{
						padding: '10px 20px',
						backgroundColor: 'rgb(13, 197, 13)',
						color: 'white',
						width: '50%',
						maxWidth: '300px', // Optional for setting an upper limit
						margin: '0 auto',
						display: 'block', // Center align for better appearance
					}}
				>
					Pay Now
				</button>
			</form>
		</div>
	);
};

const styles = {
	container: {
		padding: '20px',
		maxWidth: '600px',
		margin: '0 auto',
		width: '90%',
	},
	heading: {
		marginBottom: '40px',
		fontSize: '1.8rem',
		textAlign: 'center',
	},
	infoText: {
		fontSize: '1rem',
		marginBottom: '10px',
	},
	planList: {
		paddingLeft: '20px',
		fontSize: '1rem',
	},
	planItem: {
		marginBottom: '10px',
		color: '#000',
	},
	inputGroup: {
		marginTop: '20px',
		display: 'flex',
		flexDirection: 'column',
		gap: '15px',
	},
	input: {
		marginLeft: '10px',
		marginBottom: '10px',
		padding: '10px',
		fontSize: '1rem',
		width: '100%',
		boxSizing: 'border-box',
	},
	required: {
		color: 'red',
	},
	button: {
		padding: '10px 20px',
		backgroundColor: 'rgb(13, 197, 13)',
		color: 'white',
		width: '100%',
		fontSize: '1rem',
	},
	form: {
		marginBottom: '35px',
	},
};

export default ResellerPayment;
