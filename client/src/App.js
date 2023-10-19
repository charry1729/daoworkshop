import React, { useEffect, useState } from 'react';
import DAO from './contracts/DAO.json';
import { getWeb3 } from './utils.js';

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [admin, setAdmin] = useState(undefined);
  const [shares, setShares] = useState(undefined);
  const [proposals, setProposals] = useState([]);

  const [balances, setBalances] = useState([]);
  const [totalShares, setTotalShares] = useState();
  const [availableFunds, setAvailableFunds] = useState();
  const [contributionEnd, setContributionEnd] = useState();
  const [nextProposalId, setNextProposalId] = useState();
  const [voteTime, setVoteTime] = useState();
  const [quorum, setQuorum] = useState();


  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = DAO.networks[networkId];
      const contract = new web3.eth.Contract(
        DAO.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const admin = await contract.methods.admin().call();
      const totalShares = await contract.methods.totalShares().call();
      const availableFunds = await contract.methods.availableFunds().call();
      const contributionEnd = await contract.methods.contributionEnd().call();
      const nextProposalId = await contract.methods.nextProposalId().call();
      const voteTime = await contract.methods.voteTime().call();
      const quorum = await contract.methods.quorum().call();

      setWeb3(web3);
      setAccounts(accounts);
      setContract(contract);
      setAdmin(admin);
      setTotalShares(totalShares);
      setAvailableFunds(availableFunds);
      setContributionEnd(contributionEnd);
      setNextProposalId(nextProposalId);
      setVoteTime(voteTime);
      setQuorum(quorum);
    };

    init();
    window.ethereum.on('accountsChanged', accounts => {
      setAccounts(accounts);
    });
  }, []);

  const isReady = () => {
    return (
      typeof contract !== 'undefined' &&
      typeof web3 !== 'undefined' &&
      typeof accounts !== 'undefined' &&
      typeof admin !== 'undefined'
    );
  }


  useEffect(() => {
    if (isReady()) {
      updateShares();
      updateProposals();
    }
  }, [accounts, contract, web3, admin]);

  async function updateShares() {
    const shares = await contract.methods
      .shares(accounts[0])
      .call();
    setShares(shares);
  }

  async function updateProposals() {
    const nextProposalId = parseInt(await contract.methods
      .nextProposalId()
      .call());

    const proposals = [];
    for (let i = 0; i < nextProposalId; i++) {
      const [proposal, hasVoted] = await Promise.all([
        contract.methods.proposals(i).call(),
        contract.methods.votes(accounts[0], i).call()
      ]);
      proposals.push({ ...proposal, hasVoted });
    }
    setProposals(proposals);
  }

  async function executeProposal(proposalId) {
    await contract.methods
      .executeProposal(proposalId)
      .send({ from: accounts[0], gas: 2000000 });
    await updateProposals();
  };

  async function withdrawEther(e) {
    e.preventDefault();
    const amount = e.target.elements[0].value;
    const to = e.target.elements[1].value;
    await contract.methods
      .withdraw(amount, to)
      .send({ from: accounts[0], gas: 2000000 });
  };

  async function contribute(e) {
    e.preventDefault();
    const amount = e.target.elements[0].value;
    await contract.methods
      .contribute()
      .send({ from: accounts[0], value: amount , gas: 2000000});
      // await contract.methods.myFunction().send({ from: accounts[0], gas: 2000000 });


    await updateShares();
  };

  async function redeemShares(e) {
    e.preventDefault();
    const amount = e.target.elements[0].value;
    await contract.methods
      .redeemShares(amount)
      .send({ from: accounts[0], gas: 2000000 });
    await updateShares();
  };

  async function transferShares(e) {
    e.preventDefault();
    const amount = e.target.elements[0].value;
    await contract.methods
      .redeemShares(amount)
      .send({ from: accounts[0], gas: 2000000 });
    await updateShares();
  };

  async function vote(ballotId) {
    await contract.methods
      .vote(ballotId)
      .send({ from: accounts[0], gas: 2000000 });
    await updateProposals();
  };

  async function createProposal(e) {
    e.preventDefault();
    const name = e.target.elements[0].value;
    const amount = e.target.elements[1].value;
    const recipient = e.target.elements[2].value;
    await contract.methods
      .createProposal(name, amount, recipient)
      .send({ from: accounts[0], gas: 2000000 });
    await updateProposals();
  };

  function isFinished(proposal) {
    const now = new Date().getTime();
    const proposalEnd = new Date(parseInt(proposal.end) * 1000);
    return (proposalEnd > now) > 0 ? false : true;
  }

  if (!isReady()) {
    return <div>Loading...</div>;
  }

  return (

    <div className="container">
      <h1 className="text-center">DAO</h1>

      <p>Shares: {shares}</p>

      <p>Total Shares: {totalShares}</p>
      <p>Available Funds: {availableFunds}</p>
      <p>Contribution End: {new Date(parseInt(contributionEnd) * 1000).toLocaleString()}</p>
      <p>Next Proposal ID: {nextProposalId}</p>
      <p>Vote Time: {voteTime} seconds</p>
      <p>Quorum: {quorum}%</p>
      <p>Admin: {admin}</p>



      <div className="row">
        <div className="col-sm-12">
          <h2>Contribute</h2>
          <form onSubmit={e => contribute(e)}>
            <div className="form-group">
              <label htmlFor="amount">Amount</label>
              <input type="text" className="form-control" id="amount" />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>

      <hr />


      <div className="row">
        <div className="col-sm-12">
          <h2>Create proposal</h2>
          <form onSubmit={e => createProposal(e)}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" className="form-control" id="name" />
            </div>
            <div className="form-group">
              <label htmlFor="amount">Amount</label>
              <input type="text" className="form-control" id="amount" />
            </div>
            <div className="form-group">
              <label htmlFor="recipient">Recipient</label>
              <input type="text" className="form-control" id="recipient" />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>

      <hr />

      <div className="row">
        <div className="col-sm-12">
          <h2>Proposals</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Amount</th>
                <th>Recipient</th>
                <th>Votes</th>
                <th>Vote</th>
                <th>Ends on</th>
                <th>Executed</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map(proposal => (
                <tr key={proposal.id}>
                  <td>{proposal.id}</td>
                  <td>{proposal.name}</td>
                  <td>{proposal.amount}</td>
                  <td>{proposal.recipient}</td>
                  <td>{proposal.votes}</td>
                  <td>
                    {isFinished(proposal) ? 'Vote finished' : (
                      proposal.hasVoted ? 'You already voted' : (
                        <button
                          onClick={e => vote(proposal.id)}
                          type="submit"
                          className="btn btn-primary">
                          Vote
                        </button>
                      ))}
                  </td>
                  <td>
                    {(new Date(parseInt(proposal.end) * 1000)).toLocaleString()}
                  </td>
                  <td>
                    {proposal.executed ? 'Yes' : (
                      admin.toLowerCase() === accounts[0].toLowerCase() ? (
                        <button
                          onClick={e => executeProposal(proposal.id)}
                          type="submit"
                          className="btn btn-primary">
                          Execute
                        </button>
                      ) : 'No'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {accounts[0].toLowerCase() === admin.toLowerCase() ? (
        <>
          <div className="row">
            <div className="col-sm-12">
              <h2>Withdraw Ether</h2>
              <form onSubmit={e => withdrawEther(e)}>
                <div className="form-group">
                  <label htmlFor="amount">Amount</label>
                  <input type="text" className="form-control" id="amount" />
                </div>
                <div className="form-group">
                  <label htmlFor="to">To</label>
                  <input type="text" className="form-control" id="to" />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
              </form>
            </div>
          </div>
          <hr />
        </>
      ) : null}

      <div className="row">
        <div className="col-sm-12">
          <h2>Redeem shares</h2>
          <form onSubmit={e => redeemShares(e)}>
            <div className="form-group">
              <label htmlFor="amount">Amount</label>
              <input type="text" className="form-control" id="amount" />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>

      <hr />

      <div className="row">
        <div className="col-sm-12">
          <h2>Transfer shares</h2>
          <form onSubmit={e => transferShares(e)}>
            <div className="form-group">
              <label htmlFor="amount">Amount</label>
              <input type="text" className="form-control" id="amount" />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>

      <hr />

    </div>
  );
}

export default App;
