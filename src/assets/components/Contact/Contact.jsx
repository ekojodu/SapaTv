const Contact = () => {
	return (
		<div className='contact-section'>
			<h1 className='heading'>Contact Us</h1>
			<p className='heading-paragraph'>
				For more information or inquiries, you can reach us using the form
				below.
			</p>
			<p className='heading-paragraph support'>
				support@sapatv.ng - +234 802 916 1107
			</p>
			<form className='contact-form'>
				<div className='form-group'>
					<label htmlFor='email'>Email</label>
					<input
						type='email'
						id='email'
						name='email'
						placeholder='Enter your email'
						required
					/>
				</div>
				<div className='form-group'>
					<label htmlFor='phone'>Phone</label>
					<input
						type='tel'
						id='phone'
						name='phone'
						placeholder='Enter your phone number'
						required
					/>
				</div>
				<div className='form-group'>
					<label htmlFor='message'>Message</label>
					<textarea
						id='message'
						name='message'
						placeholder='Enter your message'
						rows='5'
						required
					></textarea>
				</div>
				<button type='submit' className='button'>
					Submit
				</button>
			</form>
		</div>
	);
};

export default Contact;
