// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import "./KanbanProject.sol";
import {Ownable} from "@openzeppelin-contracts-5.0.2/access/Ownable.sol";

contract Deployer is Ownable {
    bytes32 public constant VIEWER_ROLE = keccak256("VIEWER_ROLE");
    uint256 private projectIndex;

    struct ProjectInfo {
        address owner;
        address projectAddress;
        string ownerID;
        string projectName;
    }

    mapping(uint256 => address) private projectsAddressPerIndex;

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
            address(this),
            _projectName,
            _ownerID,
            categories
        );

        projectsAddressPerIndex[projectIndex] = address(newInstance);
        projectIndex++;

        return address(newInstance);
    }

    function getProjectsWhereIDIsViewer(
        string calldata memberID
    ) public view returns (address[] memory) {
        address[] memory projectsAddresses = new address[](projectIndex);
        uint256 count = 0;

        for (uint256 index = 0; index < projectIndex; index++) {
            bool idIsViewer = KanbanProject(projectsAddressPerIndex[index])
                .idIsProjectMember(memberID);
            if (idIsViewer) {
                projectsAddresses[count] = projectsAddressPerIndex[index];
                count++;
            }
        }

        address[] memory result = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = projectsAddresses[i];
        }

        return result;
    }
}
