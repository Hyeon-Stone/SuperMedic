import Column from "./column.js";

export default class Kanban {
	constructor(root) {
		this.root = root;

		Kanban.columns().forEach(column => {
			const columnView = new Column(column.id, column.title);
			this.root.appendChild(columnView.elements.root);
		});
	}

	static columns() {
		return [
			{
				id: 1,
				title: "예약 환자 목록"
			},
			{
				id: 2,
				title: "대기 환자 목록"
			},
			{
				id: 3,
				title: "진료완료"
			}
		];
	}
}
