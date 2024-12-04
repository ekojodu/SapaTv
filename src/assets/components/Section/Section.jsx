import PropTypes from 'prop-types';

const Section = ({ id = '', children }) => {
	return (
	  <section id={id}>
		{children}
	  </section>
	);
  };
  

Section.propTypes = {
	id: PropTypes.string.isRequired, // Ensure 'id' is a string and required
	children: PropTypes.node, // 'children' can be any renderable content
};

Section.defaultProps = {
	children: null, // Provide a default value for 'children' in case it's not passed
};

export default Section;
