pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minContribution) public {
        address newCampaign = new Campaign(minContribution, msg.sender);
        deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns(address[]) {
        return deployedCampaigns;
    }
    
} 

contract Campaign {
    
    address public manager;
    uint public minContribution;
    mapping(address => bool) public approvers;
    address[] public approverAddresses;
    Request[] public requests;
    uint public totalFunds;
    
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    function Campaign(uint minCon, address contractCreator) public {
        manager = contractCreator;
        minContribution = minCon;
    }
    
    function contribute() public payable {
        require(msg.value >= minContribution);
        totalFunds += msg.value;
        if (!approvers[msg.sender]) {
            approvers[msg.sender] = true;
            approverAddresses.push(msg.sender);
        }
    }
    
    function createRequest(string desc, uint val, address rec) public restricted {
        Request memory newRequest = Request({
            description: desc,
            value: val,
            recipient: rec,
            complete: false,
            approvalCount: 0
        });
        requests.push(newRequest);
    }
    
    function approveRequest(uint requestIndex) public {
        Request storage toApprove = requests[requestIndex];
        require(approvers[msg.sender]);
        require(!toApprove.approvals[msg.sender]);
        
        toApprove.approvals[msg.sender] = true;
        toApprove.approvalCount ++;
    }
    
    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        require(!request.complete);
        require(request.approvalCount > (approverAddresses.length / 2));
        
        request.recipient.transfer(request.value);
        totalFunds -= request.value;
        request.complete = true;
    }
    
    function getApproverAddresses() public view returns(address[]) {
        return approverAddresses;
    }

    function getSummary() public view returns (uint, uint, uint, uint, address){
        return (
            minContribution,
            totalFunds,
            requests.length,
            approverAddresses.length,
            manager
        );
    }
    
    function getRequestCount() public view returns (uint){
        return requests.length;
    }
}