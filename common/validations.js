// Define validations rules for required models
module.exports = {
	"login": {
		email: {
			trim: true,
			isEmail: {
				errorMessage: "Please enter valid email address"
			},
			notEmpty: true,
			errorMessage: "Please enter email address"
		},
		password: {
			trim: true,
			notEmpty: true,
			errorMessage: "Please enter password",
			isLength: {
				options: {
					min: 6,
					max: 20
				},
				errorMessage: "Password must be between 6-20 characters long"
			}
		}
	},
	"register": {
		name: {
			trim: true,
			notEmpty: true,
			errorMessage: "Please enter a name"
		},
		email: {
			trim: true,
			isEmail: {
				errorMessage: "Please enter valid email address"
			},
			notEmpty: true,
			errorMessage: "Please enter email address"
		},
		password: {
			trim: true,
			notEmpty: true,
			errorMessage: "Please enter password",
			isLength: {
				options: {
					min: 6,
					max: 20
				},
				errorMessage: "Password must be between 6-20 characters long"
			}
		},
		phone: {
			trim: true,
			notEmpty: true,
			errorMessage: "Please enter a phone number",
			matches: {
				options: (/^\+?[0-9]+$/),
				errorMessage: "Please enter valid phone number"
			},
			isLength: {
				options: {
					min: 10,
					max: 10
				},
				errorMessage: "PhoneNumber must be 10 digit long"
			}
		}
	},
};
