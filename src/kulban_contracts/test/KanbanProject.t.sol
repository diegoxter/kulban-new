// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import {Test, console} from "forge-std/Test.sol";
import {KanbanProject} from "../src/Deployer.sol";

contract KanbanProjectTest is Test {
    KanbanProject public project;
    address user1 = address(0xD1);
    address user2 = address(0xD2);
    address user3 = address(0xD3);
    address relayer = address(0xD4);

    function beforeTestSetup(
        bytes4 testSelector
    ) public pure returns (bytes[] memory beforeTestCalldata) {
        if (
            testSelector == this.test_BatchAddTasks.selector ||
            testSelector == this.test_BatchEditTasks.selector ||
            testSelector == this.test_DeleteTasks.selector
        ) {
            beforeTestCalldata = new bytes[](1);
            beforeTestCalldata[0] = abi.encodeWithSignature(
                "setBatchAddAndEditTasks()"
            );
        }
    }

    function setUp() public {
        string[] memory categories = new string[](5);
        categories[0] = "First";
        categories[1] = "Second";
        categories[2] = "Third";
        categories[3] = "Fourth";
        categories[4] = "Fifth";

        project = new KanbanProject(
            address(this),
            relayer,
            "Test project",
            "ABC",
            categories
        );
    }

    function test_AddsCategories() public {
        project.addCategory("Sixth");
        (, string[] memory _prevCategories, , ) = project.getProjectInfo();
        assertEq(_prevCategories[_prevCategories.length - 1], "Sixth");

        project.addCategory("Seventh");
        (, string[] memory _nextCategories, , ) = project.getProjectInfo();

        assertEq(_nextCategories[_nextCategories.length - 1], "Seventh");
    }

    function testFuzz_AddCategory(string memory category) public {
        project.addCategory(category);
        (, string[] memory _prevCategories, , ) = project.getProjectInfo();
        assertEq(_prevCategories[_prevCategories.length - 1], category);
    }

    function test_BatchAddTasks() public view {
        uint256[] memory tasksIds = new uint256[](3);
        tasksIds[0] = 0;
        tasksIds[1] = 1;
        tasksIds[2] = 2;

        KanbanProject.Task[] memory tasks = project.batchGetTasksInfo(tasksIds);

        assertEq(tasks[0].description, "Task 1 description");
        assertEq(tasks[1].category, "Second");
        assertEq(tasks[2].assigneesAddys[0], address(user3));
    }

    function test_BatchEditTasks() public {
        string[] memory _assignees = new string[](1);
        address[] memory _assigneesAddys = new address[](1);
        _assigneesAddys[0] = address(0);

        address[] memory _assigneesAddys1 = new address[](1);
        _assigneesAddys1[0] = address(user3);

        KanbanProject.Task memory task1 = KanbanProject.Task({
            description: "Task 1 modified",
            assigneesIDs: _assignees,
            category: "",
            assigneesAddys: _assigneesAddys1,
            state: KanbanProject.TaskState.InProcess,
            isActive: true
        });

        KanbanProject.Task memory task2 = KanbanProject.Task({
            description: "",
            assigneesIDs: _assignees,
            category: "Third",
            assigneesAddys: _assigneesAddys,
            state: KanbanProject.TaskState.InProcess,
            isActive: false
        });

        _assignees[0] = "3rd Assignee";

        KanbanProject.Task memory task3 = KanbanProject.Task({
            description: "",
            assigneesIDs: _assignees,
            category: "",
            assigneesAddys: _assigneesAddys,
            state: KanbanProject.TaskState.Done,
            isActive: true
        });
        KanbanProject.Task[] memory tasks = new KanbanProject.Task[](3);
        tasks[0] = task1;
        tasks[1] = task2;
        tasks[2] = task3;

        uint256[] memory tasksIds = new uint256[](3);
        tasksIds[0] = 0;
        tasksIds[1] = 1;
        tasksIds[2] = 2;

        project.batchEditTasks(tasksIds, tasks);

        KanbanProject.Task[] memory savedTasks = project.batchGetTasksInfo(
            tasksIds
        );

        assertEq(savedTasks[0].description, "Task 1 modified");
        assertEq(savedTasks[0].assigneesAddys[0], address(user3));
        assertEq(savedTasks[1].category, "Third");
        assertEq(savedTasks[1].isActive, false);
        assertEq(savedTasks[2].assigneesIDs[0], "3rd Assignee");
        assertEq(
            uint8(savedTasks[2].state),
            uint8(KanbanProject.TaskState.Done)
        );
    }

    function test_DeleteTasks() public {
        project.deleteTask(1);
        (, KanbanProject.Task[] memory activeTasks) = project.getActiveTasks();

        assertEq(activeTasks.length, 2);

        project.deleteTask(2);
        (, KanbanProject.Task[] memory newActiveTasks) = project
            .getActiveTasks();

        assertEq(newActiveTasks.length, 1);
    }

    function setBatchAddAndEditTasks() public {
        string[] memory descriptions = new string[](3);
        descriptions[0] = "Task 1 description";
        descriptions[1] = "Task 2 description";
        descriptions[2] = "Task 3 description";

        string[] memory categories = new string[](3);
        categories[0] = "First";
        categories[1] = "Second";
        categories[2] = "Third";

        string[][] memory assigneesIDs = new string[][](3);
        address[][] memory assignees = new address[][](3);
        for (uint i = 0; i < 3; i++) {
            assigneesIDs[i] = new string[](1);
            assignees[i] = new address[](1);
        }

        assigneesIDs[0][0] = "Assignee 1";
        assigneesIDs[1][0] = "Assignee 2";
        assigneesIDs[2][0] = "Assignee 3";

        assignees[0][0] = user1;
        assignees[1][0] = user2;
        assignees[2][0] = user3;

        bytes32[] memory _roles = new bytes32[](2);
        _roles[0] = project.VIEWER_ROLE();
        _roles[1] = project.EDITOR_ROLE();

        project.grantRoles("user1", user1, _roles);
        project.grantRoles("user2", user2, _roles);
        project.grantRoles("user3", user3, _roles);

        project.batchAddTask(descriptions, categories, assigneesIDs, assignees);
    }

    function test_EditCategory() public {
        project.editCategory(4, "Number five");
        (, string[] memory _prevCategories, , ) = project.getProjectInfo();
        assertEq(_prevCategories[_prevCategories.length - 1], "Number five");
    }

    function testFuzz_EditCategory(string calldata newName) public {
        project.editCategory(4, newName);
        (, string[] memory _prevCategories, , ) = project.getProjectInfo();
        assertEq(_prevCategories[_prevCategories.length - 1], newName);
    }

    function test_DeleteCategory() public {
        project.deleteCategory(3);

        (, string[] memory _prevCategories, , ) = project.getProjectInfo();
        assertEq(_prevCategories[2], "Third");
        assertEq(_prevCategories[3], "Fifth");
    }

    function test_RespectsOwnership() public {
        bytes32[] memory _roles = new bytes32[](2);
        _roles[0] = project.VIEWER_ROLE();
        _roles[1] = project.EDITOR_ROLE();

        project.grantRoles("user1", user1, _roles);

        vm.startPrank(user1);
        project.addCategory("Sixth");
        (, string[] memory _categories, , ) = project.getProjectInfo();
        vm.stopPrank();
        assertEq(_categories[5], "Sixth");

        project.revokeRoles("user1", user1, _roles);
        vm.expectRevert();
        vm.startPrank(user1);
        project.addCategory("Failed");
        vm.stopPrank();

        vm.expectRevert();
        vm.startPrank(user2);
        project.getProjectInfo();
        vm.expectRevert();
        project.addCategory("Failed");
        vm.stopPrank();
    }

    // function testFuzz_SetNumber(uint256 x) public {
    //     counter.setNumber(x);
    //     assertEq(counter.number(), x);
    // }
}
