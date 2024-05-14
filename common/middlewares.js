const validates = require("./validations.js");
// class for middleware functions
const middlewares = class {
	/**
	 * constructor
	 */
	constructor() {}
	/**
	 * Function to validate user inputs
	 * @param {string} modelName , name of model to validate
	 * @returns
	 */
	validations(modelName) {
		return function(req, res, next) {
			// Here validates is variable that we defined in top of the page, which has the validations rules of each model
			const model = validates[modelName];
			req.checkBody(model);
			const errors = req.validationErrors();
			const validationErrors = {};
			if (errors) {
				for (const inx in errors) {
					if (validationErrors[errors[inx].param] == undefined) {
						validationErrors[errors[inx].param] = errors[inx].msg;
					}
				}
			}
			// Check if validation error then return with error, otherwise go for next
			if (Object.keys(validationErrors).length > 0) {
				return res.status(400).send({
					type: "error",
					message:"Validations Errors" ,
					status: 400,
					validationErrors: validationErrors
				});
			} else {
				next();
			}
		};
	}
};

module.exports = middlewares;
