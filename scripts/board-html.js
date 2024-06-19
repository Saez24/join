function renderEditTask(task) {
    return `
        <div class="EditTaskDetails" id="editTaskCont">
            <img class="closePopup" src="./assets/img/close.png" onclick="editTaskSlideOutToRight()" alt="Close">
            <div class="main-edittask">
                <div class="left-container-edit-task">
                    <div class="inputfields">
                        <span class="required">Title</span>
                        <input id="HeadlineBox" required type="text" placeholder="Enter a title" value="${task.title}">
                        <div id="error-message-placeholder">
                            <span id="error-message-title" class="error-message">Please enter a title</span>
                        </div>
                    </div>
                    <div class="description">
                        <span>Description</span>
                        <textarea class="textarea" name="Description" id="description" placeholder="Enter a Description">${task.description}</textarea>
                    </div>
                    <div class="inputfields">
                        <span>Assigned to</span>
                        <div class="dropdown_container">
                            <input oninput="handleAssignToInput()" onclick="selectAssignTo(), closeOnBackground(event)"
                                id="assignedtoinput" class="dropdown-content-edit-task" name="assignedto"
                                placeholder="Select contacts to assign" value="${(task.assignto || []).join(', ')}">
                            <div onclick="closeOnBackground(event)" id="assignedto" class="dropdown_box"></div>
                        </div>
                        <div class="button-container" id="selectedAssignTo"></div>
                    </div>
                </div>
                <div class="separator-1px"></div>
                <div class="right-container">
                    <div class="inputfields">
                        <span class="required">Due Date</span>
                        <input onfocus="setDateRestriction()" id="duedate" name="duedate" class="datefield" required
                            type="date" placeholder="dd/mm/yyyy" value="${task.duedate}">
                        <div id="error-message-placeholder">
                            <span id="error-message-date" class="error-message">Please enter a Date</span>
                        </div>
                    </div>
                    <div class="prio">
                        <span>Prio</span>
                            <div class="prio-buttons" id="priobuttons">
                                <button id="urgent" onclick="setPrio('urgent')">Urgent</button>
                                <button id="medium" onclick="setPrio('medium')">Medium</button>
                                <button id="low" onclick="setPrio('low')">Low</button>
                            </div>
                    </div>
                    <div class="inputfields">
                        <span class="required">Category</span>
                        <div class="dropdown_container">
                            <input oninput="handleCategoryInput()" onclick="selectCategory(), closeOnBackground(event)"
                                id="taskcategoryinput" class="dropdown-category-content-edit-task" name="taskcategory"
                                placeholder="Select task category" value="${task.category}">
                            <div onclick="closeOnBackground(event)" id="taskcategory" class="category_dropdown_box"></div>
                        </div>
                        <div id="error-message-placeholder">
                            <span id="error-message-category" class="error-message">Please select category</span>
                        </div>
                    </div>
                    <div class="inputfields">
                        <span>Subtasks</span>
                        <input onclick="openAddSubtaskField()" id="addsubtask" class="subtask" type="text" placeholder="Add new subtask">
                        <input onclick="handleSubtaskClick(event), addSubtask(event)" id="subtask" class="aktive-subtask" type="text">
                    </div>
                    <div class="subtask-container">
                        <div id="addsubtasks">${(task.subtask || []).map(subtask => `<div>${subtask}</div>`).join('')}</div>
                    </div>
                    <div class="bottom-container-mobile-edit-task submit-buttons">
                        <span class="required-2">This field is required</span>
                        <button onclick="editTask()" class="create-button">Ok<img src="./assets/img/check.png" alt=""></button>
                    </div>
                </div>
            </div>
            <div class="task-created task-cont" id="task-created">
                <p class="#">Task successfully edited</p>
            </div>
        </div>
    `;
}
