import React from 'react';
import classNames from 'classnames';

import Button from 'ui/form/button';

import styles from './css/header.css';

export default class Header extends React.Component {

	render() {
		const uis = this.props.uis;
		const selected = this.props.selected;

		return (
			<div className={ styles.header }>
				<h1 className={ styles.title }>
					{ uis[selected].name }
				</h1>
				<div className={ styles.headerRight }>
					<Button
						className={ styles.saveButton }
						onClick={ this.props.onSave }
						disabled={ this.props.saving }
						hollow light >
						{ this.props.saved ? 'Saved!' : 'Save' }
					</Button>
				</div>
			</div>
		);
	}

}
