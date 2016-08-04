import React from 'react';
import classNames from 'classnames';

import ElasticTextarea from 'react-textarea-autosize';

import styles from './css/textarea.css';

export default class Textarea extends React.Component {

	render() {
		const Tag = this.props.elastic ? ElasticTextarea : 'textarea';

		const classes = classNames(
			styles.textarea,
			this.props.className
		);

		return (
			<Tag
				className={ classes }
				style={ this.props.style }
				value={ this.props.value }
				onChange={ this.props.onChange } />
		);
	}

}
