import KanbanAPI from "./kanbanAPI.js";
import Item from "./item.js";
import DropZone from "./dropZone.js";
const kanban_column = `
<div class="kanban__column">
	<div class="kanban__column-title"></div>
	<div class="kanban__column-items"></div>
</div>
`

export default class Column {
	constructor(id, title) {
		this.elements = {};
		this.elements.root = Column.createTag(kanban_column);
		this.elements.title = this.elements.root.querySelector(".kanban__column-title");
		this.elements.items = this.elements.root.querySelector(".kanban__column-items");
		this.elements.root.dataset.id = id;
		const topDropZone = DropZone.createDropZone();
		this.elements.root.appendChild(topDropZone);

		// 칸반보드 각 제목의 title_icon class의 태그 생성
		this.elements.icon = Column.createTag(`<span class="title_icon"></span>`);
		this.elements.title.appendChild(this.elements.icon);
		// 칸반보드 각 제목의 title_name class의 태그 생성
		this.elements.title_name = Column.createTag(`<span class="title_name"></span>`);
		this.elements.title.appendChild(this.elements.title_name);
		this.elements.title_name.textContent = title;

		// 환자 직접 등록 시 대기 환자 목록으로 들어가도록 지정
		document.querySelector('.add-item').addEventListener("click", () => {
			if (id === 2){
				let regWin = window.open('regpatient','환자 등록', 'width=600px,height=800px')
				setTimeout(() => {
					let form = regWin.document.querySelector('form')
					form.addEventListener("submit", () => {
						const data = new FormData(form);
						let gender
						if (data.has('male') == true){
							gender = '남';
						}
						else{
							gender = '여';
						}
						const info = {
							name :  data.get('name'),
							age : data.get('age'),
							blood_type : data.get('blood_type'),
							allergy : data.get('allergy'),
							gender : gender
						}
						let content = JSON.stringify(info);
						const newItem = KanbanAPI.insertItem(id, content);
						this.renderItem(newItem);
						regWin.close();
					});
				}, 100)
			}
		});
		KanbanAPI.getItems(id).forEach(item => {
			this.renderItem(item);
		});
	}
	static createTag(tag) {
		const range = document.createRange();
		range.selectNode(document.body);
		return range.createContextualFragment(`
			${tag}
		`).children[0];
	}
	renderItem(data) {
		const item = new Item(data.id, data.content);
		this.elements.items.appendChild(item.elements.root);
	}
}
