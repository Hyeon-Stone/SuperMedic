import DropZone from "./dropZone.js";
import DropZoneBefore from "./dropZoneBefore.js";
import KanbanAPI from "./kanbanAPI.js";
import {writeIdxedDB} from "./indexDB.js";

const kanban_item = `
<div class="kanban__item" draggable="true">
	<div class="kanban__item-input" contenteditable></div>
	<div class="block">
		<div class="info">
			<div class="first_line">
				<div class="name"></div>
				<div class="gender"></div>
			</div>
			<div class="age_title">나이</div>
			<div class="blood_type_title">혈액형</div>
			<div class="allergy_title">알레르기</div>
			<div class="third_line">
			<div class="age"></div>
			<div class="blood_type"></div>
			<div class="allergy"></div>
			</div>
		</div>
	</div>
</div>
`

export default class Item {
	constructor(id, content) {
		const bottomDropZone = DropZone.createDropZone();
		const frontDropZone = DropZoneBefore.createDropZone()
		this.elements = {};
		this.elements.root = Item.createTag(kanban_item);
		this.elements.input = this.elements.root.querySelector(".kanban__item-input");
		this.elements.root.dataset.id = id;
		this.elements.input.textContent = content;
		this.content = content;
		this.elements.root.prepend(frontDropZone);
		this.elements.root.appendChild(bottomDropZone);

		// 환자 직접 추가로 추가 시 데이터 파싱
		const info = JSON.parse(content)
		this.elements.name = this.elements.root.querySelector('.name')
		this.elements.age = this.elements.root.querySelector('.age')
		this.elements.blood_type = this.elements.root.querySelector('.blood_type')
		this.elements.allergy = this.elements.root.querySelector('.allergy')
		this.elements.gender = this.elements.root.querySelector('.gender')
		this.elements.name.textContent = info['name'];
		this.elements.age.textContent = info['age'];
		this.elements.blood_type.textContent = info['blood_type'];
		this.elements.allergy.textContent = info['allergy'];
		this.elements.gender.textContent = info['gender'];
		if (info['gender'] == '남') {
			this.elements.gender.className += '_male'
		}

		const onBlur = () => {
			const newContent = this.elements.input.textContent.trim();
			if (newContent == this.content) {
				return;
			}
			this.content = newContent;
			KanbanAPI.updateItem(id, {
				content: this.content
			});
		};
		
		this.elements.input.addEventListener("blur", onBlur);
		this.elements.root.addEventListener("dblclick", () => {
			// const check = confirm("Are you sure you want to delete this item?");

			// if (check) {
			// 	KanbanAPI.deleteItem(id);

			// 	this.elements.input.removeEventListener("blur", onBlur);
			// 	this.elements.root.parentElement.removeChild(this.elements.root);
			// }
			const contents = [
				{id: 'name', content: this.elements.name.textContent},
				{id: 'age', content: this.elements.age.textContent}, 
				{id: 'blood_type', content: this.elements.blood_type.textContent},
				{id: 'allergy', content: this.elements.allergy.textContent},
				{id: 'gender', content: this.elements.gender.textContent}
			];
			writeIdxedDB(contents);
			window.open('patientDetail', '환자 상세 정보','width=1100px,height=800px');
		});

		this.elements.root.addEventListener("dragstart", e => {
			e.dataTransfer.setData("text/plain", id);
		});

		this.elements.input.addEventListener("drop", e => {
			e.preventDefault();
		});
	}

	static createTag(tag) {
		const range = document.createRange();
		range.selectNode(document.body);
		return range.createContextualFragment(`
			${tag}
		`).children[0];
	}
}
