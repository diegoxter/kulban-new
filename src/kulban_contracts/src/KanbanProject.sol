// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin-contracts-5.0.2/access/AccessControl.sol";

contract KanbanProject is AccessControl {
    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");
    bytes32 public constant EDITOR_ROLE = keccak256("EDITOR_ROLE");
    bytes32 public constant VIEWER_ROLE = keccak256("VIEWER_ROLE");

    string private ownerID;
    string private projectName;
    string[] private categories;
    uint256 private taskIndex;

    enum TaskState {
        Pending,
        InProcess,
        Done
    }

    struct Task {
        string description;
        string assigneeID;
        string category;
        address assigneeAddress;
        TaskState state;
    }

    mapping(uint256 => Task) private tasks;

    constructor(
        address owner,
        string memory _projectName,
        string memory _ownerID,
        string[] memory _categories
    ) {
        projectName = _projectName;
        ownerID = _ownerID;
        categories = _categories;

        _grantRole(OWNER_ROLE, owner);
        _grantRole(EDITOR_ROLE, owner);
        _grantRole(VIEWER_ROLE, owner);
    }

    // Content management
    function addCategory(
        string calldata newCategoryName
    ) public onlyRole(EDITOR_ROLE) {
        categories.push(newCategoryName);
    }

    function batchAddTask(
        string[] calldata newDescriptions,
        string[] calldata newCategories,
        string[] calldata newAssigneesIDs,
        address[] calldata newAssignees
    ) public onlyRole(EDITOR_ROLE) returns (uint256[] memory) {
        require(
            newDescriptions.length == newCategories.length &&
                newDescriptions.length == newAssignees.length &&
                newDescriptions.length == newAssigneesIDs.length,
            "batchAddTasks: Arrays must have the same length"
        );

        uint256[] memory taskIndexes = new uint256[](newDescriptions.length);

        for (uint256 index = 0; index < newDescriptions.length; index++) {
            taskIndexes[index] = _addTask(
                newDescriptions[index],
                newCategories[index],
                newAssigneesIDs[index],
                newAssignees[index]
            );
        }
        return taskIndexes;
    }

    function batchEditTasks(
        uint256[] calldata taskIDs,
        Task[] calldata tasksInfo
    ) public onlyRole(EDITOR_ROLE) {
        require(
            taskIDs.length == tasksInfo.length,
            "batchEditTasks: Arrays must have the same length"
        );

        for (uint256 i = 0; i < taskIDs.length; i++) {
            require(taskIDs[i] <= taskIndex, "batchEditTasks: out of array");

            _editTask(
                taskIDs[i],
                tasksInfo[i].description,
                tasksInfo[i].category,
                tasksInfo[i].assigneeID,
                tasksInfo[i].assigneeAddress,
                tasksInfo[i].state
            );
        }
    }

    function editCategory(
        uint256 _categoryIndex,
        string calldata _newCategoryName
    ) public onlyRole(EDITOR_ROLE) {
        require(
            _categoryIndex <= categories.length - 1,
            "_editCategory: out of array"
        );

        _editCategory(_categoryIndex, _newCategoryName);
    }

    function removeCategory(
        uint256 _categoryIndex
    ) public onlyRole(EDITOR_ROLE) {
        require(
            _categoryIndex < categories.length,
            "removeCategory: out of array"
        );

        for (uint256 i = _categoryIndex; i < categories.length - 1; i++) {
            categories[i] = categories[i + 1];
        }

        categories.pop();
    }

    // Content views
    function getProjectInfo()
        public
        view
        onlyRole(VIEWER_ROLE)
        returns (string[] memory, uint256)
    {
        return (categories, taskIndex);
    }

    function batchGetTasksInfo(
        uint256[] calldata tasksIds
    ) public view onlyRole(VIEWER_ROLE) returns (Task[] memory) {
        Task[] memory _tasks = new Task[](tasksIds.length);

        for (uint256 index = 0; index < tasksIds.length; index++) {
            _tasks[index] = tasks[tasksIds[index]];
        }

        return _tasks;
    }

    function _getTaskInfo(uint256 taskId) internal view returns (Task memory) {
        require(taskId <= taskIndex, "_getTaskInfo: out of array");

        return tasks[taskId];
    }

    // User management
    function grantRoles(
        address user,
        bytes32[] calldata roles
    ) public onlyRole(OWNER_ROLE) {
        _grantRoles(roles, user);
    }

    function revokeRoles(
        address user,
        bytes32[] calldata roles
    ) public onlyRole(OWNER_ROLE) {
        _revokeRoles(roles, user);
    }

    // Internal content management
    function _addTask(
        string calldata _description,
        string calldata _category,
        string calldata _assigneeID,
        address _assignee
    ) internal returns (uint256) {
        require(
            _checkIfValidCategory(_category, false),
            "_addTask: Category not valid"
        );

        tasks[taskIndex] = Task({
            description: _description,
            assigneeID: _assigneeID,
            category: _category,
            assigneeAddress: _assignee,
            state: TaskState.Pending
        });

        ++taskIndex;

        return taskIndex;
    }

    function _editCategory(
        uint256 _categoryIndex,
        string calldata _categoryName
    ) internal {
        categories[_categoryIndex] = _categoryName;
    }

    function _editTask(
        uint256 _taskID,
        string calldata _newDescription,
        string calldata _newCategory,
        string calldata _newAssigneeID,
        address _newAssignee,
        TaskState _newState
    ) internal {
        Task storage task = tasks[_taskID];
        require(
            _checkIfValidCategory(_newCategory, true),
            "_editTask: Category not valid"
        );
        if (bytes(_newDescription).length > 0) {
            task.description = _newDescription;
        }
        if (bytes(_newCategory).length > 0) {
            task.category = _newCategory;
        }
        if (bytes(_newAssigneeID).length > 0) {
            task.assigneeID = _newAssigneeID;
        }
        if (_newAssignee != address(0)) {
            task.assigneeAddress = _newAssignee;
        }
        if (_newState != task.state) {
            task.state = _newState;
        }
    }

    function _checkIfValidCategory(
        string calldata category,
        bool allowEmpty
    ) internal view returns (bool) {
        if (allowEmpty && bytes(category).length == 0) {
            return true;
        }

        for (uint256 index = 0; index < categories.length; index++) {
            if (
                keccak256(bytes(categories[index])) ==
                keccak256(bytes(category))
            ) {
                return true;
            }
        }

        return false;
    }

    function _grantRoles(bytes32[] calldata _roles, address _grantee) internal {
        for (uint256 index = 0; index < _roles.length; index++) {
            _grantRole(_roles[index], _grantee);
        }
    }

    function _revokeRoles(
        bytes32[] calldata _roles,
        address _grantee
    ) internal {
        for (uint256 index = 0; index < _roles.length; index++) {
            _revokeRole(_roles[index], _grantee);
        }
    }
}
