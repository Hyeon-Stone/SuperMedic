import KanbanAPI from "./kanbanAPI.js";

export default class DropZone {
	static createDropZone() {
		const range = document.createRange();

		range.selectNode(document.body);

		const dropZone = range.createContextualFragment(`
			<div class="kanban__dropzone2"></div>
		`).children[0];

		dropZone.addEventListener("dragover", e => {
			e.preventDefault();
			dropZone.classList.add("kanban__dropzone2--active");
		});

		dropZone.addEventListener("dragleave", () => {
			dropZone.classList.remove("kanban__dropzone2--active");
		});

		dropZone.addEventListener("drop", e => {
			e.preventDefault();
			dropZone.classList.remove("kanban__dropzone2--active");

			const columnElement = dropZone.closest(".kanban__column");
			const columnId = Number(columnElement.dataset.id);
			const dropZonesInColumn = Array.from(columnElement.querySelectorAll(".kanban__dropzone2"));
			let droppedIndex = dropZonesInColumn.indexOf(dropZone);
			const itemId = Number(e.dataTransfer.getData("text/plain"));
			const droppedItemElement = document.querySelector(`[data-id="${itemId}"]`);
			const insertAfter = dropZone.parentElement.classList.contains("kanban__item") ? dropZone.parentElement : dropZone;
			if (droppedItemElement.contains(dropZone)) {
				return;
			}
			let originalPosition = KanbanAPI.getposition(columnId, itemId)
			if (originalPosition < droppedIndex)
				droppedIndex -= 1
			insertAfter.before(droppedItemElement);
			KanbanAPI.updateItem(itemId, {
				columnId,
				position: droppedIndex
			});
		});

		return dropZone;
	}
}
