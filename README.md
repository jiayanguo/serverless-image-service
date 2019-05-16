== cloud agnostic serverless

This is serverless service, which could pull images from aws s3 or azure blob. And it is a cloud agnostic, which could support azure function and aws lambda.
When run on aws lambda, copy index.js in the aws foler to root folder.

Note: this application also support hybrid cloud, choose different service js in the service folder to connect to different cloud (s3 or blob).

Update your credential for s3 or blob in the constant/index.js file.



== Note
If you are runing on auzre. make below changes in the azure-function-express lib.
chnages in the lib of azure-function-express

OutgoingMessage.js (node_modules/azure-function-express/lib/OutgoingMessage.js) end method
Original: context.res.body = convertToBody(data, encoding);
changes context.res.body = data;

