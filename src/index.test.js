const { unstable_dev } = require("wrangler");

describe("Worker", () => {
	let worker;

	beforeAll(async () => {
		worker = await unstable_dev(
			"src/index.js",
			{},
			{ disableExperimentalWarning: true }
		);
	});

	afterAll(async () => {
		await worker.stop();
	});

	it("should return a 200", async () => {
		const response = await worker.fetch("/");

		expect(response.status).toEqual(200);
	});
});
