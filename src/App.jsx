import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './assets/components/NavBar/Navbar';
import './App.css';
import Section from './assets/components/Section/Section';
import Home from './assets/components/Home/Home';
import Plans from './assets/components/Plans/Plans';
import Download from './assets/components/Download/Download';
import Contact from './assets/components/Contact/Contact';
import Subscribe from './assets/components/Subscribe/Subscribe';
import ErrorBoundary from './assets/components/ErrorBoundary/ErrorBoundary'; // Import ErrorBoundary
import Footer from './assets/components/Footer/Footer';
import Faq from './assets/components/Faq/Faq';
import Reseller from './assets/components/Reseller/Reseller';
import ResellerProgram from './assets/components/Reseller Program/Resellerprogram';
import PaymentSummary from './assets/components/CompleteTransaction/PaymentSummary';

const App = () => {
	return (
		// Ensure that your Router wraps the entire app
		<Router>
			<div>
				<Navbar />
				<ErrorBoundary>
					<main>
						<Routes>
							{/* Home Sections */}
							<Route
								path='/'
								element={
									<>
										<Section id='home'>
											<Home />
										</Section>
										<Section id='plans'>
											<Plans />
										</Section>
										<Section id='download'>
											<Download />
										</Section>
										<ResellerProgram />
										<Section id='contact'>
											<Contact />
										</Section>
									</>
								}
							/>

							{/* Subscribe Page */}
							<Route
								path='/subscribe'
								element={
									<ErrorBoundary>
										<Subscribe />
									</ErrorBoundary>
								}
							/>
							<Route
								path='/payment-summary'
								element={
									<ErrorBoundary>
										<PaymentSummary />
									</ErrorBoundary>
								}
							/>
							<Route path='/faq' element={<Faq />} />
							<Route
								path='/reseller'
								element={
									<ErrorBoundary>
										<Reseller />
									</ErrorBoundary>
								}
							/>
						</Routes>
					</main>
				</ErrorBoundary>
				<Footer />
			</div>
		</Router>
	);
};

export default App;
