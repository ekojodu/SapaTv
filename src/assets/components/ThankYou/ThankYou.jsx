import { useLocation } from 'react-router-dom';

const ThankYou = () => {
	const location = useLocation();
	const paymentData = location.state?.paymentData;

	return (
		<div>
			<h1>Thank You!</h1>
			<p>Payment was successful. Here are your details:</p>
			<pre>{JSON.stringify(paymentData, null, 2)}</pre>
		</div>
	);
};

export default ThankYou;
