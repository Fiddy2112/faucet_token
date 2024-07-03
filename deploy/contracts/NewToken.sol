// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract NewToken is ERC20Capped,ERC20Burnable{
    // set owner 
    address payable public owner;
    // set block
    uint256 public blockReward;

    bool public isActive;

    constructor(uint256 cap, uint256 reward) ERC20("SenpaiToken", "ST") ERC20Capped(cap * (10 ** 18)){
        owner = payable(msg.sender);
        _mint(owner, 50000000 * 10 ** 18);
        blockReward = reward * 10 ** 18;
        isActive = true;
    }

    modifier onlyOwner{
        require(msg.sender == owner, "You don't have permission, only owner can perform this action");
        _;
    }

    modifier onlyWhenActive{
        require(isActive,"Contract is not active");
        _;
    }

    function _minerReward() internal {
        _mint(block.coinbase, blockReward);
    }

    // function _beforeTokenTransfer(address from, address to, uint256 value) internal virtual override(ERC20, ERC20Capped) {
    //     if (from != address(0) && to != block.coinbase && block.coinbase != address(0)) {
    //         _minerReward();
    //     }
    //     super._beforeTokenTransfer(from, to, value);
    // }


    function destroy() public onlyOwner{
        // selfdestruct(owner);
        owner.transfer(address(this).balance);
        isActive = false;
    }

    function setBlockReward(uint256 reward) public onlyOwner  onlyWhenActive{
        blockReward = reward * 10 ** 18;
    }

    //ERC20Capped and ERC20Burnable both have a function named "_update"
        // should we override it
        function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Capped)
    {
        super._update(from, to, value); 
    }


}