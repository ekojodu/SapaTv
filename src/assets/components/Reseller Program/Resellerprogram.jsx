import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing

const ResellerProgram = () => {
	return (
		<div
			style={{
				padding: '20px',
				textAlign: 'center',
				fontFamily: 'Arial, sans-serif',
			}}
		>
			<h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#fff' }}>
				Reseller Program
			</h1>
			<p
				style={{
					fontSize: 'clamp(1rem, 3vw, 1.2rem)',
					color: '#fff',
					marginBottom: '20px',
				}}
			>
				Join our reseller program and boost your earnings today! <br /> <br />
				<Link
					to='/reseller'
					style={{
						color: 'rgb(13, 197, 13)',
						textDecoration: 'none',
						fontWeight: 'bold',
					}}
				>
					Learn more
				</Link>
			</p>
		</div>
	);
};

export default ResellerProgram;
