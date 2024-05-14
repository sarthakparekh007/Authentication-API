/**
 * authService is used for create function related to authorization
 */
module.exports = {
    
	/**
     * verifyAuthToken middleware is used for verify authorization token
     * and decrypt token data from AES cipher
     */
	verifyAuthToken: async function(req, res, next) {
		try{
			// get token from header
			const token = req.headers["authorization"];
			if (token) {
				const jwt = require("jsonwebtoken");
				// verify token
				jwt.verify(token, config.authTokenKey, async function(err, decoded) {
					const data = decoded.data;
					// check verification details
					if (err == null && decoded != undefined) {
						const users = require('../model/users.js');
						const userDetail = await users.findOne({_id:data._id,token:token},{email:1,role:1});
						console.log(userDetail,"userDetail")
						if(!userDetail){
							return res.sendLogin("Your session is expired, Please login");
						}
						req["loggedUser"] = userDetail;
							return next();
					} else {
						// if token verification failed send 401 response
						return res.sendLogin("Your session is expired, Please login");
					}
				});
			} else {
				next();
			}
		}
		catch(error){
			console.log(error);
		}
	},

	// Function to check the user authentication
	checkAuth: function(req, res, next) {
		if (req.loggedUser != undefined && req.loggedUser != null && req.loggedUser != "" && Object.keys(req.loggedUser).length > 0) {
			return next();
		} else {
			// if token verification failed send 401 response
			return res.sendLogin();
		}
	}
};
