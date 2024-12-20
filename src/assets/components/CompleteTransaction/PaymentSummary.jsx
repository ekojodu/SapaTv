import { useState, useEffect } from 'react';

import PropTypes from 'prop-types';

const SubscriptionDetails = ({ transaction }) => (
	<div>
		<h3>Subscription Details</h3>
		<p>
			<strong>Plan ID:</strong> {transaction.PlanId || 'Not available'}
		</p>
		<p>
			<strong>Amount:</strong> NGN {transaction.amount}
		</p>
		<p>
			<strong>Transaction Date:</strong>{' '}
			{new Date(transaction.transactionDate).toLocaleString()}
		</p>
	</div>
);

SubscriptionDetails.propTypes = {
	transaction: PropTypes.shape({
		PlanId: PropTypes.string,
		amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
			.isRequired,
		transactionDate: PropTypes.string.isRequired,
	}).isRequired,
};

const ResellerPurchaseBreakdown = ({ resellerPlans }) => (
	<div>
		<h3>Reseller Purchase Breakdown</h3>
		{resellerPlans?.length ? (
			resellerPlans.map((plan, index) => (
				<div key={index}>
					<p>
						<strong>Plan ID:</strong> {plan.planId}
					</p>
					<p>
						<strong>Price:</strong> NGN {plan.price}
					</p>
					<p>
						<strong>Quantity:</strong> {plan.quantity}
					</p>
					<p>
						<strong>Amount:</strong> NGN {plan.price * plan.quantity}
					</p>
				</div>
			))
		) : (
			<p>No reseller plans available.</p>
		)}
	</div>
);

ResellerPurchaseBreakdown.propTypes = {
	resellerPlans: PropTypes.arrayOf(
		PropTypes.shape({
			planId: PropTypes.string.isRequired,
			price: PropTypes.number.isRequired,
			quantity: PropTypes.number.isRequired,
		})
	).isRequired,
};

const PaymentSummary = () => {
	const [transaction, setTransaction] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		const queryParams = new URLSearchParams(window.location.search);
		const encodedData = queryParams.get('data');

		if (encodedData) {
			try {
				const transactionData = JSON.parse(atob(encodedData));
				setTransaction(transactionData); // Set the transaction data in state
			} catch (error) {
				console.error('Failed to decode transaction data:', error);
				setError('Invalid transaction data.');
			}
		} else {
			setError('No transaction data provided.');
		}
	}, []);

	if (error) return <div>Error: {error}</div>;

	if (!transaction) return <div>Loading...</div>;
	// Get the created_at date from the customer object
	const createdAtDate = transaction.customer?.created_at
		? new Date(transaction.customer.created_at).toLocaleString()
		: 'Not available';
	return (
		<div className='subscribe-form-container'>
			<h1>Payment Summary</h1>
			<form className='subscribe-form'>
				<p>
					Please take note of your reference number
					<strong> {transaction.reference}</strong> , as it will be required for
					any inquiries or complaints related to your transaction.
				</p>
				<p>
					<strong>Customer Name:</strong> {transaction.customerName || 'N/A'}
				</p>
				<p>
					<strong>Total:</strong> ₦{transaction.amount || 'N/A'}
				</p>
				<p>
					<strong>Status:</strong>{' '}
					{transaction.transactionStatus === 0 ? 'Pending' : 'Completed'}
				</p>
				<p>
					<strong>Purchase Date:</strong> {createdAtDate}
				</p>
				<p>
					<strong>Reference:</strong> {transaction.reference}
				</p>
			</form>

			{/* {transaction.type === 'subscribe' ? (
				<SubscriptionDetails transaction={transaction} />
			) : transaction.type === 'reseller' ? (
				<ResellerPurchaseBreakdown resellerPlans={transaction.resellerPlans} />
			) : (
				<p>Invalid transaction type.</p>
			)} */}
		</div>
	);
};

export default PaymentSummary;
