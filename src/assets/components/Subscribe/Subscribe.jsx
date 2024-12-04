import { useLocation, useNavigate } from 'react-router-dom';

const Subscribe = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const plan = location.state?.plan;

	const handleSubmit = (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const name = formData.get('name');
		const email = formData.get('email');

		navigate('/complete-transaction', {
			state: {
				name,
				email,
				plan,
				reference: null, // Reference can be generated in the CompleteTransaction page
			},
		});
	};

	return (
		<div className='subscribe-form-container'>
			<h1>Subscribe</h1>
			<br />
			<br />
			<form className='subscribe-form' onSubmit={handleSubmit}>
				<h1>Get Started</h1>
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
				<button type='submit' className='button'>
					Make Payment
				</button>
				<p>
					Please feel free to reach out to us for any complaints{' '}
					<span className='span'>support@saptav.ng</span> |{' '}
					<span className='span'>+234 802 916 1107</span>
				</p>
			</form>
		</div>
	);
};

export default Subscribe;
