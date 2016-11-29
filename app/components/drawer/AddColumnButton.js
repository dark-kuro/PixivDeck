// @flow
import React from 'react';
import {connect} from 'react-redux';
import type {Dispatch, User} from '../../types';
import {addColumn} from '../../actions';
import Button from '../common/button';

type Props = {
	user: User,
	dispatch: Dispatch
};

function AddColumnButton({user, dispatch}: Props) {
	const onClick = () => {
		dispatch(
			addColumn({type: 'userIllusts', id: user.id},
			`${user.name}(${user.account})`)
		);
	};

	return (
		<a style={{margin: '0 10px'}} onClick={onClick}>
			<Button text="カラムに追加"/>
		</a>
	);
}

export default connect()(AddColumnButton);