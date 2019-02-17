"use strict";

const { ServiceBroker } = require("moleculer");
const { ValidationError } = require("moleculer").Errors;
const TestService = require("../../services/greeter.service");

// Here's a great resource on how to use mocks with Jest: https://medium.com/@rickhanlonii/understanding-jest-mocks-f0046c68e53c

describe("Test 'greeter' service", () => {
	let broker = new ServiceBroker();
	broker.createService(TestService);

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

	describe("Test 'greeter.hello' action", () => {

		it("should return with 'Hello Moleculer'", () => {
			expect(broker.call("greeter.hello")).resolves.toBe("Hello Moleculer");
		});

	});

	describe("Test 'greeter.welcome' action", () => {

		it("should return with 'Welcome'", () => {
			expect(broker.call("greeter.welcome", { name: "Adam" })).resolves.toBe("Welcome, Adam");
		});

		it("should reject an ValidationError", () => {
			expect(broker.call("greeter.welcome")).rejects.toBeInstanceOf(ValidationError);
		});

  });
  
  describe("Test that we can mock broker.call", () => {
    it ("Should return a mock value a mock function is used.", () => {
      const mock = jest.fn(() => "bar");

      expect(mock("foo")).toBe("bar");
      expect(mock).toHaveBeenCalledWith("foo");
    });

    it ("Should return mock value when broker.call is called.", () => {
      // Mock the moleculer service under test.
      jest.mock("moleculer");
      broker.start = jest.fn(() => {
        console.log("mock of broker.start()");
      });
      broker.stop = jest.fn(() => {
        console.log("mock of broker.stop()");
      });
      
      broker.call = jest.fn(() => Promise.resolve("Testing Mock works"));

      expect(broker.call("greeter.welcome", { name: "Adam" })).resolves.toBe("Testing Mock works");
      expect(broker.call).toHaveBeenCalledWith("greeter.welcome", { name: "Adam" });
    });
  });

});

