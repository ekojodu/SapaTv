import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		console.error('Error caught in boundary:', error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return <h2>Something went wrong. Please try again later.</h2>;
		}

		return this.props.children;
	}
}
ErrorBoundary.propTypes = {
	children: PropTypes.node.isRequired,
};

export default ErrorBoundary;