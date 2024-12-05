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
import CompleteTransaction from './assets/components/CompleteTransaction/CompleteTransaction';
import Footer from './assets/components/Footer/Footer';
import Faq from './assets/components/Faq/Faq';
import Reseller from './assets/components/Reseller/Reseller';
import ResellerPayment from './assets/components/ResellerPayment/ResellerPayment';

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
								path='/complete-transaction'
								element={
									<ErrorBoundary>
										<CompleteTransaction />
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
							<Route
								path='/resellerPayment'
								element={
									<ErrorBoundary>
										<ResellerPayment />
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
