import { useEffect, useState } from 'react';

function useScript(src) {
	const [isLoaded, setIsLoaded] = useState(false);
	const [hasError, setHasError] = useState(false);

	useEffect(() => {
		const script = document.createElement('script');
		script.src = src;
		script.async = true;
		script.onload = () => setIsLoaded(true);
		script.onerror = () => setHasError(true);

		document.body.appendChild(script);

		// Cleanup the script after component unmounts
		return () => {
			document.body.removeChild(script);
		};
	}, [src]); // Only reload the script if src changes

	return { isLoaded, hasError };
}

export default useScript;
