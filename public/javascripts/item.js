import DropZone from "./dropZone.js";
import DropZoneBefore from "./dropZoneBefore.js";

import KanbanAPI from "./kanbanAPI.js";

const kanban_item = `
<div class="kanban__item" draggable="true">
	<div class="kanban__item-input" contenteditable></div>
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
			const check = confirm("Are you sure you want to delete this item?");

			if (check) {
				KanbanAPI.deleteItem(id);

				this.elements.input.removeEventListener("blur", onBlur);
				this.elements.root.parentElement.removeChild(this.elements.root);
			}
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
