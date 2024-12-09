import PropTypes from 'prop-types';

const Section = ({ id = '', children = null }) => {
	return <section id={id}>{children}</section>;
};

Section.propTypes = {
	id: PropTypes.string.isRequired, // Ensure 'id' is a string and required
	children: PropTypes.node, // 'children' can be any renderable content
};

export default Section;
