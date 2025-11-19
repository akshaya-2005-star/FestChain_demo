// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint public value;   // One uint variable

    // Function to change the value of the variable
    function setValue(uint _newValue) public {
        value = _newValue;
    }
}
