addEventListener('fetch', event => {

	event.respondWith(slackWebhookHandler(event.request));
});

let jsonHeaders = new Headers([['Content-Type', 'application/json']]);


/**
 * simpleResponse generates a simple JSON response
 * with the given status code and message.
 *
 * @param {Number} statusCode
 * @param {String} message
 */
function simpleResponse(statusCode, message) {
	let resp = {
		message: message,
		status: statusCode,
	};

	return new Response(JSON.stringify(resp), {
		headers: jsonHeaders,
		status: statusCode,
	});
}


/**
 * parses order data
 *
 */
function parseMessage(message) {
	return message;
}


async function slackRequest(msg) {
	let endpoint = 'https://hooks.slack.com/services/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'; // the endpoint of order-bot channel
	// let endpoint = 'https://hooks.slack.com/services/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'; // the endpoint of api_alert channel

	try {

		const init = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				text: "New order created->"+ JSON.stringify(msg, null, 2),
			}),
		};

		let resp = await fetch(endpoint, init);


		if (resp.status !== 200) {
			throw new Error(`bad status code from Slack: HTTP ${resp.status}`);
		}

	} catch (e) {
		throw new Error(`could not request slack: ${e}`);
	}
}



/**
 * slackWebhookHandler handles an incoming Slack
 * webhook and generates a response.
 * @param {Request} request
 */
async function slackWebhookHandler(request) {
	let orderData;

	try {
		orderData = await request.json();
		await slackRequest(orderData);
		return simpleResponse(200, orderData);
	} catch (e) {
		return simpleResponse(200, `There is an issue: ${e}`);
	}
}