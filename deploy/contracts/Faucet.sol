// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns(bool);
    function balanceOf(address account) external view returns(uint256);
    event Transfer(address indexed  from, address indexed to, uint256 value);
}

contract Faucet {
    address payable owner;
    IERC20 public token;

    uint256 public withDrawAmount = 50 * 10 ** 18;

    mapping (address => uint256) nextAccessTime;
    uint256 public lockTime = 1 minutes;

    event Withdraw( address indexed  to, uint256 value);
    event Deposit( address indexed  from, uint256 value);

    constructor(address tokenAddress) payable{
        token = IERC20(tokenAddress);
        owner = payable(msg.sender);
    }

    modifier onlyOwner {
        require(msg.sender == owner, "You don't have permission, only owner can perform this action");
        _;
    }

    function requestToken() public {
        require(msg.sender != address(0), "Request must not originate from a zero account");
        require(token.balanceOf(address(this)) >= withDrawAmount, "Insufficient balance in faucet for withdraw request");
        require(block.timestamp >= nextAccessTime[msg.sender],"Insufficient time elapsed since last withdraw, try again later");

        nextAccessTime[msg.sender] = block.timestamp + lockTime;

        token.transfer(msg.sender, withDrawAmount);
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    function getBalance() external view returns(uint256) {
       return token.balanceOf(address(this));
    }

    function setWithDrawAmount(uint256 amount) public onlyOwner{
        withDrawAmount = amount * 10 ** 18;
    }

    function setLockTime(uint256 _time) public onlyOwner{
        lockTime = _time * 1 minutes;
    }

    function withdraw() external onlyOwner {
        emit Withdraw(msg.sender, token.balanceOf(address(this)));
        token.transfer(msg.sender, token.balanceOf(address(this)));
    }

}