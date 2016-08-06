import React from 'react';
import classNames from 'classnames';

export default class Space extends React.Component {

	render() {
		const classes = classNames(
			this.props.className
		);

		return (
			<div
				className={ classes }
				style={{
					display: (this.props.width ? 'inline-block' : 'block'),
					width: (this.props.width ? this.props.width : 1) + 'rem',
					height: (this.props.height ? this.props.height : 1) + 'rem'
				}}></div>
		);
	}

}
