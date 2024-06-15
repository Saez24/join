function renderEditTask() {
return `
<div class="taskBoxBackground hidden" id="editTaskOverlay">
        <div class="EditTaskDetails" id="editTaskCont"> <!-- ID and class updated -->
            <img class="closePopup" src="./assets/img/close.png" onclick="editTaskSlideOutToRight()" alt="Close">
            <div class="main-edittask"><!-- übertragen -->
                <div class="left-container-edit-task"><!-- übertragen -->
                    <div class="inputfields"><!-- übertragen -->
                        <span class="required">Title</span><!-- übertragen -->
                        <input id="HeadlineBox" required type="text" placeholder="Enter a title">
                        <div id="error-message-placeholder"><span id="error-message-title" class="error-message">Please
                                enter a title</span><!-- übertragen -->
                        </div>
                    </div>
                    <div class="description"><!-- übertragen -->
                        <span>Description</span>
                        <textarea class="textarea" name="Description" id="description"
                            placeholder="Enter a Description"></textarea><!-- übertragen -->
                    </div>
                    <div class="inputfields"><!-- übertragen -->
                        <span>Assigned to</span>
                        <div class="dropdown_container"><!-- übertragen -->
                            <input oninput="handleAssignToInput()" onclick="selectAssignTo(), closeOnBackground(event)"
                                id="assignedtoinput" class="dropdown-content-edit-task" name="assignedto"
                                placeholder="Select contacts to assign"><!-- übertragen -->
                            <div onclick="closeOnBackground(event)" id="assignedto" class="dropdown_box">
                            </div><!-- übertragen -->
                        </div>
                        <div class="button-container" id="selectedAssignTo"><!-- übertragen -->
                        </div>
                    </div>
                </div>
                <div class="separator"></div><!-- übertragen -->
                <div class="right-container"></div>
                    <div class="inputfields"><!-- übertragen -->
                        <span class="required">Due Date</span>
                        <input onfocus="setDateRestriction()" id="duedate" name="duedate" class="datefield" required
                            type="date" placeholder="dd/mm/yyyy">
                        <div id="error-message-placeholder"><span id="error-message-date" class="error-message">Please
                                enter
                                a Date</span>
                        </div>
                    </div>
                    <div class="prio"><!-- übertragen -->
                        <span>Prio</span>
                        <div id="priobuttons" class="prio-buttons"><!-- übertragen -->
                            <button onclick="urgentButton()" id="urgent">Urgent <img src="./assets/img/prio_alta.png"
                                    alt=""></button>
                            <button onclick="mediumButton()" id="medium">Medium <img src="./assets/img/prio_media.png"
                                    alt=""></button>
                            <button onclick="lowButton()" id="low">Low <img src="./assets/img/prio_baja.png"
                                    alt=""></button>
                        </div>
                    </div>
                    <div class="inputfields"><!-- übertragen -->
                        <span class="required">Category</span><!-- übertragen -->
                        <div class="dropdown_container"><!-- übertragen -->
                            <input oninput="handleCategoryInput()" onclick="selectCategory(), closeOnBackground(event)"
                                id="taskcategoryinput" class="dropdown-category-content-edit-task" name="taskcategory"
                                placeholder="Select task category"><!-- übertragen -->
                            <div onclick="closeOnBackground(event)" id="taskcategory" class="category_dropdown_box"><!-- übertragen -->

                            </div>
                        </div>
                        <div id="error-message-placeholder"><span id="error-message-category"
                                class="error-message"><!-- übertragen -->Please
                                select
                                category</span>
                        </div>
                    </div>
                    <div class="inputfields"><!-- übertragen -->
                        <span>Subtasks</span>
                        <input onclick="openAddSubtaskField()" id="addsubtask" class="subtask" type="text"
                            placeholder="Add new subtask"><!-- übertragen -->
                        <input onclick="handleSubtaskClick(event), addSubtask(event)" id="subtask"
                            class="aktive-subtask" type="text"><!-- übertragen -->
                    </div>
                    <div class="subtask-container"><!-- übertragen -->
                        <div id="addsubtasks">

                        </div>
                    </div>
                    <div class="bottom-container-mobile-edit-task submit-buttons"><!-- übertragen -->
                        <span class="required-2">This field is required</span><!-- übertragen -->
                        <button onclick="editTask()" class="create-button">Ok<img src="./assets/img/check.png"
                                alt=""></button><!-- übertragen -->
                    </div>
                </div>
            </div>

            <div class="task-created task-cont" id="task-created"><!-- übertragen -->
                <p class="#">Task successfully edited</p>
            </div>
        </div>
`
}