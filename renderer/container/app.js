// @flow
import React, {Component} from 'react';
import type {Dispatch, State} from 'redux';
import {connect} from 'react-redux';
import cssModules from 'react-css-modules';
import type {Manage, WorkType, WorksType, ColumnType, UserType} from '../actions/type';
import {openModal, closeModal, closeImageView} from '../actions/manage';
import {currentWork} from '../actions';
import {addColumn, nextPage} from '../actions/column';
import {openImageView} from '../actions/manage';
import ImageModal from '../components/image-modal';
import Modal from '../components/modal';
import SelectColumnModal from '../components/modal/select-column-modal';
import Header from '../components/header';
import Column from './column';
import styles from './app.css';

type Props = {
	children: any,
	work: WorkType,
	works: WorksType,
	users: UserType,
	columns: Array<ColumnType>,
	manage: Manage,
	dispatch: Dispatch
};

class App extends Component {
	props: Props;

	componentWillMount() {
		this.props.dispatch(addColumn(1, {type: 'ranking', opts: {mode: 'daily', page: 1}}, 'ranking/daily'));
		this.props.dispatch(addColumn(2, {type: 'ranking', opts: {mode: 'weekly', page: 1}}, 'ranking/weekly'));
		this.props.dispatch(addColumn(3, {type: 'ranking', opts: {mode: 'monthly', page: 1}}, 'ranking/monthly'));
		this.props.dispatch(addColumn(4, {type: 'favoriteWorks', opts: {publicity: 'public', page: 1}}, 'お気に入り'));
	}

	handleAddColumn = (
		query: {type: string, opts: Object},
		title : string = ''
	) => {
		const id = this.props.columns.length;
		this.props.dispatch(addColumn(id + 1, query, title));
	};

	handleCloseModal = () => {
		this.props.dispatch(closeImageView());
	};

	handleOpenModal = () => {
		this.props.dispatch(openModal());
	}

	handleOnClickWork = (id: number) => {
		this.props.dispatch(currentWork(id));
		this.props.dispatch(openImageView());
	}

	handleOnNextPage = (id: number) => {
		this.props.dispatch(nextPage(id));
	}

	isImageModal(): bool {
		const {currentWorkId, isImageView} = this.props.manage;
		if (isImageView && currentWorkId && this.props.works[currentWorkId]) {
			return true;
		}
		return false;
	}

	handleOnCloseModal = () => {
		this.props.dispatch(closeModal());
	};

	renderImageView() {
		const {works, manage} = this.props;
		const {currentWorkId, isImageView} = manage;
		if (isImageView && currentWorkId && this.props.works[currentWorkId]) {
			return (
				<ImageModal
					show={isImageView}
					img={works[currentWorkId].imageUrls.large}
					onClose={this.handleCloseModal}
					/>
			);
		}
		return null;
	}

	renderColumns() {
		const {columns, works, users} = this.props;
		return columns.map(column => {
			const workList = column.works && column.works.length > 0 ? column.works.map(i => works[i]) : [];
			return (
				<Column
					key={column.id}
					id={column.id}
					column={column}
					users={users}
					works={workList}
					onNextPage={this.handleOnNextPage}
					onClickWork={this.handleOnClickWork}
					/>
			);
		});
	}

	renderModal() {
		if (!this.props.manage.isModal) {
			return;
		}
		return (
			<Modal
				title={'カラムの追加'}
				onClose={this.handleOnCloseModal}
				>
				<SelectColumnModal
					onSelect={this.handleAddColumn}
					/>
			</Modal>
		);
	}

	render() {
		return (
			<div styleName="wrap">
				<Header
					onOpenModal={this.handleOpenModal}
					/>
				<div styleName="content">
					{this.renderColumns()}
				</div>
				{this.renderImageView()}
				{this.renderModal()}
			</div>
		);
	}
}

function mapStateToProps(state: State) {
	const {entities, manage, columns} = state;
	const {works, users} = entities;
	const work = works[manage.currentWorkId] || null;

	return {
		work,
		works,
		users,
		manage,
		columns
	};
}

export default connect(mapStateToProps)(cssModules(styles)(App));
