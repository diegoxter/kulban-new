// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import {Test, console} from "forge-std/Test.sol";
import {Deployer} from "../src/Deployer.sol";
import {console} from "forge-std/console.sol";

contract DeployerTest is Test {
    Deployer public deployer;
    address user1 = address(0xD1);
    address user2 = address(0xD2);
    string[] emptyCategories;

    function setUp() public {
        deployer = new Deployer();
    }

    function test_DeployChildrenWithID() public {
        address projectAddress = deployer.deployNew(
            "Test project",
            "ABC",
            emptyCategories
        );

        // TO DO
        // Deployer.ProjectInfo memory projectInfo = deployer
        //     .getProjectsWhereIDIsViewer("ABC")[0];
        //
        // assertEq(projectInfo.owner, address(this));
        // assertEq(projectInfo.projectName, "Test project");
        // assertEq(projectInfo.projectAddress, projectAddress);
    }

    function test_DeployChildrenManually() public {
        vm.startPrank(user1);
        address projectAddress = deployer.deployNew(
            "User test project",
            "",
            emptyCategories
        );

        // TO DO
        // Deployer.ProjectInfo memory projectInfo = deployer
        //     .getProjectsPerAddress()[0];
        // vm.stopPrank();
        //
        // assertEq(projectInfo.owner, user1);
        // assertEq(projectInfo.projectName, "User test project");
        // assertEq(projectInfo.projectAddress, projectAddress);
    }

    function testFuzz_DeployWithCategories(
        string[] calldata categories
    ) public {
        vm.startPrank(user1);
        address projectAddress = deployer.deployNew(
            "User test project",
            "",
            categories
        );

        // TO DO
        // Deployer.ProjectInfo memory projectInfo = deployer
        //     .getProjectsPerAddress()[0];
        // vm.stopPrank();
        //
        // assertEq(projectInfo.owner, user1);
        // assertEq(projectInfo.projectName, "User test project");
        // assertEq(projectInfo.projectAddress, projectAddress);
    }

    // function testFuzz_SetNumber(uint256 x) public {
    //     counter.setNumber(x);
    //     assertEq(counter.number(), x);
    // }
}
