// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');

// Read command line arguments
const args = process.argv.slice(2);

// Check for the key pair name argument
if (args.length < 1) {
  console.error('Usage: node index.js <keyPairName>');
  process.exit(1);
}

// Set the region 
AWS.config.update({region: 'ap-northeast-1'}); 

// Create EC2 service object
const ec2 = new AWS.EC2({apiVersion: '2016-11-15'});

// Set the name of the key pair
const keyPairName = args[0];

// Parameters for the key pair
const params = {
  KeyName: keyPairName
};

// Create the key pair
ec2.createKeyPair(params, function(err, data) {
  if (err) {
    console.error("Error creating key pair: ", err);
  } else {
    console.log('Success: ', data);
    
    // Save the private key
    const fs = require('fs');
    fs.writeFileSync(keyPairName + '.pem', data.KeyMaterial);
    console.log(keyPairName + '.pem を作成しました。');
  }
});
