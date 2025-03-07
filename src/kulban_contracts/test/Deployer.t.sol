// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import {Test, console} from "forge-std/Test.sol";
import {Deployer} from "../src/Deployer.sol";
import {KanbanProject} from "../src/KanbanProject.sol";

contract DeployerTest is Test {
    Deployer public deployer;
    address user1 = address(0xD1);
    address user2 = address(0xD2);
    address relayer = address(0xD3);
    string[] emptyCategories;

    function setUp() public {
        deployer = new Deployer();
    }

    function test_DeployChildrenWithID() public {
        address projectAddress = deployer.deployNew(
            user1,
            relayer,
            "Test project",
            "ABC",
            emptyCategories
        );

        address projectAddressFromDeployer = deployer
            .getProjectsWhereIDIsViewer("ABC")[0];

        (string memory projectName, , , ) = KanbanProject(projectAddress)
            .getProjectInfo();

        bool isOwner = KanbanProject(projectAddress).hasRole(
            keccak256("OWNER_ROLE"),
            address(this)
        );
        assertTrue(isOwner);
        assertEq(projectName, "Test project");
        assertEq(projectAddressFromDeployer, projectAddress);
    }

    function test_DeployChildrenManually() public {
        vm.startPrank(user1);
        address projectAddress = deployer.deployNew(
            user1,
            address(0),
            "User test project",
            "",
            emptyCategories
        );

        (string memory projectName, , , ) = KanbanProject(projectAddress)
            .getProjectInfo();
        vm.stopPrank();

        bool isOwner = KanbanProject(projectAddress).hasRole(
            keccak256("OWNER_ROLE"),
            user1
        );
        assertTrue(isOwner);
        assertEq(projectName, "User test project");
        // assertEq(projectInfo.projectAddress, projectAddress);
    }

    function testFuzz_DeployWithCategories(
        string[] calldata categories
    ) public {
        vm.assume(categories.length > 0 && categories.length <= 10);
        for (uint256 i = 0; i < categories.length; i++) {
            vm.assume(bytes(categories[i]).length > 0);
        }
        vm.startPrank(user1);
        address projectAddress = deployer.deployNew(
            user1,
            address(0),
            "User test project",
            "",
            categories
        );

        (, string[] memory _categories, , ) = KanbanProject(projectAddress)
            .getProjectInfo();
        vm.stopPrank();

        bool isOwner = KanbanProject(projectAddress).hasRole(
            keccak256("OWNER_ROLE"),
            address(user1)
        );
        assertTrue(isOwner);
        assertEq(
            _categories.length,
            categories.length,
            "Arrays length mismatch"
        );

        for (uint256 i = 0; i < _categories.length; i++) {
            assertEq(_categories[i], categories[i], "Category mismatch");
        }
    }

    // function testFuzz_SetNumber(uint256 x) public {
    //     counter.setNumber(x);
    //     assertEq(counter.number(), x);
    // }
}
