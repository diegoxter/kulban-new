// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import "./KanbanProject.sol";
import {Ownable} from "@openzeppelin-contracts-5.0.2/access/Ownable.sol";

contract Deployer is Ownable {
    struct ProjectInfo {
        address owner;
        address projectAddress;
        string ownerID;
        string projectName;
    }

    mapping(string => ProjectInfo[]) private projectsPerOwnerID;
    mapping(address => ProjectInfo[]) private projectsPerOwnerAddress;

    constructor() Ownable(msg.sender) {}

    function deployNew(
        string calldata _projectName,
        string memory _ownerID,
        string[] calldata _initialCategories
    ) public payable returns (address) {
        if (msg.sender == owner()) {
            require(
                bytes(_ownerID).length > 0,
                "deployNew: Deploying requires an ID"
            );
        }

        string[] memory categories = _initialCategories.length > 0
            ? _initialCategories
            : new string[](5);

        KanbanProject newInstance = new KanbanProject(
            msg.sender,
            _projectName,
            _ownerID,
            categories
        );

        ProjectInfo memory newProject = ProjectInfo({
            owner: msg.sender,
            projectAddress: address(newInstance),
            ownerID: _ownerID,
            projectName: _projectName
        });

        if (msg.sender == owner()) {
            projectsPerOwnerID[_ownerID].push(newProject);
        } else {
            projectsPerOwnerAddress[msg.sender].push(newProject);
        }

        return address(newInstance);
    }

    function getProjectsPerID(
        string calldata _ownerID
    ) public view returns (ProjectInfo[] memory) {
        return projectsPerOwnerID[_ownerID];
    }

    function getProjectsPerAddress()
        public
        view
        returns (ProjectInfo[] memory)
    {
        return projectsPerOwnerAddress[msg.sender];
    }
}
