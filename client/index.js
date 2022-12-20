var web3 = new Web3(Web3.givenProvider);

var instance;
var user;
// var contractAddress = "0x1753C9f8bFd56c0A21D9a6552bDC7A5cbE0a3E5b";//Truffle develop
var contractAddress = "0xcCBF509F24647cC356947F572BD6DA594E790D54";  //Ganache

function notify(message)
{
    $('#notifications').html(message);
}

$(document).ready(() => {

  console.log('Calling provider.request()...');

  window.ethereum.request({ method: 'eth_requestAccounts' }).
    then((accounts) => {
      user = accounts[0];
      notify("Welcome, you are logged in as " + user);

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

    });
})


$("#createkitty").click(async () => {

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

