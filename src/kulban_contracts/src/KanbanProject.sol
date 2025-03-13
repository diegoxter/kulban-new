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
    string[] private membersIDs;

    uint256 private taskIndex;

    enum TaskState {
        Pending,
        InProcess,
        Done
    }

    struct Member {
        string memberID;
        address memberAddress;
        bool isActive;
    }

    struct Task {
        string title;
        string description;
        string category;
        Member[] members;
        TaskState state;
        bool isActive;
    }

    event NewTasksCreated(uint256[] newTasksID);

    mapping(uint256 => Task) private tasks;
    mapping(string => Member) private members;

    constructor(
        address owner,
        address relayer,
        string memory _projectName,
        string memory _ownerID,
        string[] memory _categories
    ) {
        projectName = _projectName;
        ownerID = _ownerID;
        categories = _categories;
        members[_ownerID] = Member({
            memberAddress: owner,
            isActive: true,
            memberID: _ownerID
        });
        membersIDs.push(_ownerID);

        _grantRole(OWNER_ROLE, owner);
        _grantRole(EDITOR_ROLE, owner);
        _grantRole(VIEWER_ROLE, owner);

        if (owner != msg.sender) {
            // In theory, Deployer contract does this
            _grantRole(VIEWER_ROLE, msg.sender);
            // Relayer needs access
            _grantRole(OWNER_ROLE, relayer);
            _grantRole(EDITOR_ROLE, relayer);
            _grantRole(VIEWER_ROLE, relayer);
        }
    }

    // TO DO these should check the user as handled by the relayer
    // Content management
    function addCategory(
        string calldata newCategoryName
    ) public onlyRole(EDITOR_ROLE) {
        categories.push(newCategoryName);
    }

    function batchAddTask(
        string[] calldata newTitles,
        string[] calldata newDescriptions,
        string[] calldata newCategories,
        Member[][] calldata newMembers
    ) public onlyRole(EDITOR_ROLE) returns (uint256[] memory) {
        require(
            newDescriptions.length == newTitles.length &&
                newDescriptions.length == newCategories.length &&
                newDescriptions.length == newMembers.length,
            "batchAddTasks: Arrays must have the same length"
        );

        uint256[] memory taskIndexes = new uint256[](newDescriptions.length);

        for (uint256 index = 0; index < newDescriptions.length; index++) {
            for (uint256 i = 0; i < newMembers[index].length; i++) {
                require(
                    hasRole(EDITOR_ROLE, newMembers[index][i].memberAddress)
                );
            }

            taskIndexes[index] = _addTask(
                newTitles[index],
                newDescriptions[index],
                newCategories[index],
                newMembers[index]
            );
        }

        emit NewTasksCreated(taskIndexes);
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
                tasksInfo[i].title,
                tasksInfo[i].description,
                tasksInfo[i].category,
                tasksInfo[i].members,
                tasksInfo[i].state,
                tasksInfo[i].isActive
            );
        }
    }

    function deleteTask(uint256 taskID) public onlyRole(EDITOR_ROLE) {
        require(taskID <= taskIndex, "deleteTask: Invalid Task ID");
        require(tasks[taskID].isActive, "deleteTask: Task inactive");

        tasks[taskID].isActive = false;
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

    function deleteCategory(
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
    function batchGetTasksInfo(
        uint256[] calldata tasksIds
    ) public view onlyRole(VIEWER_ROLE) returns (Task[] memory) {
        Task[] memory _tasks = new Task[](tasksIds.length);

        for (uint256 index = 0; index < tasksIds.length; index++) {
            _tasks[index] = tasks[tasksIds[index]];
        }

        return _tasks;
    }

    function getActiveTasks()
        public
        view
        onlyRole(VIEWER_ROLE)
        returns (uint256, uint256[] memory, Task[] memory)
    {
        uint256 activeCount = 0;
        for (uint256 index = 0; index < taskIndex; index++) {
            if (tasks[index].isActive) {
                activeCount++;
            }
        }

        Task[] memory activeTasks = new Task[](activeCount);
        uint256[] memory activeTasksID = new uint256[](activeCount);

        uint256 iterator = 0;

        for (uint256 index = 0; index < taskIndex; index++) {
            if (tasks[index].isActive) {
                activeTasks[iterator] = tasks[index];
                activeTasksID[iterator] = index;

                iterator++;
            }
        }

        return (activeCount, activeTasksID, activeTasks);
    }

    function getProjectInfo()
        public
        view
        onlyRole(VIEWER_ROLE)
        returns (string memory, string[] memory, uint256, Member[] memory)
    {
        uint256 activeMemberCount = 0;

        for (uint256 index = 0; index < membersIDs.length; index++) {
            if (members[membersIDs[index]].isActive) {
                activeMemberCount++;
            }
        }

        Member[] memory activeMembers = new Member[](activeMemberCount);
        uint256 counter = 0;

        for (uint256 index = 0; index < membersIDs.length; index++) {
            if (members[membersIDs[index]].isActive) {
                activeMembers[counter] = members[membersIDs[index]];
                counter++;
            }
        }

        (uint256 activeTasks, , ) = getActiveTasks();

        return (projectName, categories, activeTasks, activeMembers);
    }

    function idIsProjectMember(
        string calldata memberID
    ) public view onlyRole(VIEWER_ROLE) returns (bool) {
        return members[memberID].isActive;
    }

    // User management
    function grantRoles(
        string calldata memberID,
        address user,
        bytes32[] calldata roles
    ) public onlyRole(OWNER_ROLE) {
        members[memberID] = Member({
            memberAddress: user,
            isActive: true,
            memberID: memberID
        });
        membersIDs.push(memberID);

        _grantRoles(roles, user);
    }

    function revokeRoles(
        string calldata memberID,
        address user,
        bytes32[] calldata roles
    ) public onlyRole(OWNER_ROLE) {
        members[memberID].isActive = false;
        _revokeRoles(roles, user);
    }

    // Internal content management
    function _addTask(
        string calldata _title,
        string calldata _description,
        string calldata _category,
        Member[] calldata _members
    ) internal returns (uint256) {
        require(
            _checkIfValidCategory(_category, false),
            "_addTask: Category not valid"
        );

        tasks[taskIndex] = Task({
            title: _title,
            description: _description,
            category: _category,
            members: _members,
            state: TaskState.Pending,
            isActive: true
        });

        ++taskIndex;

        return taskIndex;
    }

    function _editCategory(
        uint256 _categoryIndex,
        string calldata _categoryName
    ) internal {
        // TO DO this should edit all active tasks category
        categories[_categoryIndex] = _categoryName;
    }

    function _editTask(
        uint256 _taskID,
        string calldata _newTitle,
        string calldata _newDescription,
        string calldata _newCategory,
        Member[] calldata _newMembers,
        TaskState _newState,
        bool _isActive
    ) internal {
        Task storage task = tasks[_taskID];
        require(
            _checkIfValidCategory(_newCategory, true),
            "_editTask: Category not valid"
        );
        require(
            tasks[_taskID].isActive,
            "_editTask: cannot edit inactive task"
        );
        require(_taskID < taskIndex, "Task ID out of range");
        if (bytes(_newTitle).length > 0) {
            task.title = _newTitle;
        }
        if (bytes(_newDescription).length > 0) {
            task.description = _newDescription;
        }
        if (bytes(_newCategory).length > 0) {
            task.category = _newCategory;
        }

        if (_newMembers[0].memberAddress != address(0)) {
            task.members = _newMembers;
        }
        if (_newState != task.state) {
            task.state = _newState;
        }
        if (_isActive != task.isActive) {
            task.isActive = _isActive;
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
