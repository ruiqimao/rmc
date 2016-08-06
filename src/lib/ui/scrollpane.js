import React from 'react';
import classNames from 'classnames';

import Scrollbars from 'react-custom-scrollbars';

import styles from './css/scrollpane.css';

export default class ScrollPane extends React.Component {

	render() {
		const classes = classNames(
			styles.scrollpane,
			this.props.className
		);

		return (
			<Scrollbars
				renderTrackHorizontal={ props => <div { ...props } className={ styles.trackHorizontal }/> }
				renderTrackVertical={ props => <div { ...props } className={ styles.trackVertical }/> }
				renderThumbHorizontal={ props => <div { ...props } className={ styles.thumbHorizontal }/> }
				renderThumbVertical={ props => <div { ...props } className={ styles.thumbVertical }/> }
				renderView={ props => <div { ...props } className={ styles.view }/> }
				autoHide={ this.props.autoHide }
				className={ classes }
				style={ this.props.style }>
				{ this.props.children }
			</Scrollbars>
		);
	}

}
