// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

contract UserAuthentication {
    struct User {
        bytes32 userID;
        bytes32 passwordHash;
        address userAddress;
    }

    mapping(bytes32 => User) private users;

    // Events
    event UserRegistered(bytes32 userID, address userAddress);
    event UserLoggedIn(bytes32 userID, address userAddress);
    event UserAddressUpdated(bytes32 userID, address newAddress);

    function registerUser(
        bytes32 _userID,
        bytes32 _passwordHash,
        address _userAddress
    ) public {
        require(_userID != bytes32(0), "registerUser: UserID can't be empty");
        require(
            users[_userID].userID == bytes32(0),
            "registerUser: User already exists"
        );

        users[_userID] = User({
            userID: _userID,
            passwordHash: _passwordHash,
            userAddress: _userAddress
        });

        emit UserRegistered(_userID, _userAddress);
    }

    function loginUser(
        bytes32 _userID,
        bytes32 _passwordHash
    ) public view returns (bool) {
        User memory user = users[_userID];
        require(user.userAddress != address(0), "loginUser: Not registered");

        return user.passwordHash == _passwordHash;
    }

    function getUserAddress(bytes32 _userID) public view returns (address) {
        require(
            users[_userID].userAddress != address(0),
            "getUserAddress: User doesn't exist"
        );
        return users[_userID].userAddress;
    }

    function updateUserAddress(
        bytes32 _userID,
        bytes32 _passwordHash,
        address _newAddress
    ) public returns (bool) {
        require(
            loginUser(_userID, _passwordHash),
            "updateUserAddress: Invalid credentials"
        );
        User storage user = users[_userID];

        user.userAddress = _newAddress;

        emit UserAddressUpdated(_userID, _newAddress);
        return true;
    }
}
