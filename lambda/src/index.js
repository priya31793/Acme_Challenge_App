const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'ap-southeast-2' });
const s3 = new AWS.S3();

exports.handler = function(event, context, callback){
  if(event.context['http-method'] == 'GET'){
  	if(event.params.querystring.from == 'customer'){
  		getCustomer(callback);
  	}else if(event.params.querystring.from == 'details'){
  		let cust_id = event.params.querystring.cust_id
  		getCustomerDocument(cust_id,callback);
  	}else if(event.params.querystring.from == 'download'){
  		downloadFile(event,callback);
  	}

  }else if (event.context['http-method'] == 'POST'){
  	uploadDocument(event,context,callback);
  }else if (event.context['http-method'] == 'DELETE'){
  	deleteItem(event,callback);
  }
}

/* Generating Random Unique Id */
function uniqueID () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};

/* Fetching list of customers from the Dynamo DB - customers table */
function getCustomer(callback){
  var params = {
		TableName : 'customer'
	};
	docClient.scan(params, function(err, data){
		if(err){
		    callback(err, null);
		}else{
			const response = {
			  statusCode: 200,
			  hits: data.Items
			};
		  callback(null, response);
		}
	});
}

/* Fetching list of customer documents from the Dynamo DB - customers doc */
function getCustomerDocument(cust_id,callback){
  var params = {
		TableName : 'cust_doc',
		FilterExpression: "#cust_id = :id",
    ExpressionAttributeNames: {
      "#cust_id": "cust_id",
    },
    ExpressionAttributeValues: {
      ":id": cust_id,
    }
	};
	docClient.scan(params, function(err, data){
		if(err){
		    callback(err, null);
		}else{
			const response = {
			  statusCode: 200,
			  hits: data.Items
			};
		  callback(null, response);
		}
	});
}

/* Insert Document details (File name, file path ) and the corresponding information in DB - customers_doc */
function uploadDocument(event,context,callback) {
	let request = event['body-json']
	let upload_file = request.blob;
	let buffer = new Buffer(upload_file,'base64');

	let file = writeFile(buffer,request.file_name,request.file_type);

	var params = {
		Item : {
			"doc_id" : uniqueID(),
			"cust_id" : request.cust_id,
			"doc_name" : request.doc_name,
			"doc_path" : file,
			"created_date" : request.created_date
		},
		TableName : 'cust_doc'
	};
	docClient.put(params, function(err, data){
		callback(err, data);
	});
}

/* Upload Documents into S3 - acmecustomer */
function writeFile(buffer,file_name,file_type){
	let upload_file_name = Date.now().toString() + file_name;
	let params = {
    Bucket: 'acmecustomer',
    Key: 'documents/' + upload_file_name,
    Body: buffer,
  };
  s3.putObject(params, function (err, url) {
    if (err) {
      console.log(err)
    }
  });
  return upload_file_name;
}

/* Download the documents using Presigned URL */
function downloadFile(event,callback){
  let file_name = event.params.querystring.file_name;

  let params = {
    Bucket: 'acmecustomer',
    Key: 'documents/' + file_name
  }

  s3.getSignedUrl('getObject', params, function (err, url) {
    if (err) {
      console.log('Download Failed :',err);
    }else{
    console.log('Download Success :', url);
	    callback(null, {
	      "statusCode": 200,
	      "body": url,
	    });
    }
  });
}

/* Delete the S3 Files  - customers doc */
 const deleteS3File = async (file_name, callback) => {

   let params = {
    Bucket: 'acmecustomer',
    Key: 'documents/' + file_name
  }
    
   try {
        await s3.headObject(params).promise();
        console.log("File Found in S3");
      try{
        await s3.deleteObject(params).promise();
        console.log("File Has been deleted Successfully");
        
        const response = {

            "isBase64Encoded": false,
            "statusCode": 200,
            "body": JSON.stringify({"result" : "File Has been deleted Successfully"})
        };
        callback(null, response);
      }
      catch(err){
          const response = {
            "isBase64Encoded": false,
            "statusCode": err.statusCode,
            "body": JSON.stringify(err)
        };
        
        callback (response,null);

      }
    } catch (err) {
        console.log("File not Found ERROR : " + err.code);
        const response = {
            "isBase64Encoded": false,
            "statusCode": err.statusCode,
            "body": JSON.stringify(err)
        };
        callback (response,null);
    }
}


function  deleteItem(event,callback) {
	let doc_id = event.params.querystring.doc_id;
	let doc_path = event.params.querystring.doc_path;
	var params = {
		Key : {
			"doc_id" : doc_id,
		},
		TableName : 'cust_doc'
	};
	docClient.delete(params, function(err, data){
		if(err){
		    callback(err, null);
		}else{
			
			deleteS3File(doc_path, callback);
			
			// const response = {
			//   statusCode: 200,
			//   hits: data
			// };
		 // callback(null, response);
		}
	});
}
