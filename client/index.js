var web3 = new Web3(Web3.givenProvider);

var instance;
var user;
// var contractAddress = "0x1753C9f8bFd56c0A21D9a6552bDC7A5cbE0a3E5b";//Truffle develop
var contractAddress = "0xD7321D5a196CF15e5a85390bDB0aC946092720f5";  //Ganache


$(document).ready(() => {


})


// Button handlers

$("#createkitty").click(async () => {

  if (!connected()){
    notify("Not connected");
    return;
  }

  var currentDna = getDna();

  notify("Creating a new kitty...");

  console.log("Calling createKittyGen0...");

  instance.methods.createKittyGen0(currentDna).send({})
  .on('transactionhash', (txhash) => {
    console.log(txhash);
    notify(txhash);
  })
  .on('confirmation', (confnum, receipt)=>{
    console.log('Confirmation number: '+ confnum);
    notify(confnum +' confirmation');
  })
  .on('receipt', (receipt)=>{
    console.log('Received a transaction receipt');
    console.log('createKittyGen0 called');      
  })
  .on('error', (error)=>{
    console.log('error');
    notify(error.message);
  });

})


$("#loginbutton").click(async()=>{
  console.log('Calling provider.request()...');

  notify("Connecting to Metamask...")

  window.ethereum.request({ method: 'eth_requestAccounts' })
    .then((accounts) => {
      if (accounts.length == 0){
        notify("Please connect using Metamask");
        return;
      }
      
      user = accounts[0];
      notify("Welcome, you are logged in as " + user +"\n KittyContract address: " + contractAddress);

      instance = new web3.eth.Contract(abi, contractAddress, { from: user });

      // Register with the event

      console.log('instance: ');
      console.log(instance);

      console.log('Registering with Birth event...');

      instance.events.Birth({})
      .on('connected', (subscriptionId) => {
        console.log('Registed with event with subscription id' + subscriptionId);
      })
      .on('data', (event) => {
        console.log('Birth event emitted ');
        var dna = event.returnValues.genes;
        notify("New kitty with dna " + dna + " was added to your wallet");

      })
      .on('error', (error) => {
        console.log(error);
        notify(error.message);
      })
      .on('changed', (event) => {
        console.log('Event removed');
      });

    })
    .catch(error =>{
      console.log(error)
      notify(error);
    });

})



// Helper functions

function notify(message){
    $('#notifications').html(message);
}

function connected()
{
    if (typeof instance === "undefined")
      return false;


    if (typeof user === "undefined")
      return false;

    return true;
}




