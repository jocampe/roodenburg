import assert from "node:assert/strict";
import {
  assertSameOrigin,
  emailField,
  optionalTextField,
  PublicAPIError,
  textField,
} from "../lib/public-api";

const valid = { email: " Member@Example.nl ", message: " A useful message ", phone: "" };
assert.equal(emailField(valid), "member@example.nl");
assert.equal(textField(valid, "message", { min: 10, max: 100 }), "A useful message");
assert.equal(optionalTextField(valid, "phone", 40), "");

assert.throws(
  () => emailField({ email: "not-an-email" }),
  (error) => error instanceof PublicAPIError && error.code === "invalid_email",
);
assert.throws(
  () => textField({ message: "short" }, "message", { min: 10, max: 100 }),
  (error) => error instanceof PublicAPIError && error.code === "invalid_message",
);

assert.doesNotThrow(() => assertSameOrigin(new Request("https://club.example/api/contact", {
  headers: { origin: "https://club.example" },
})));
assert.throws(
  () => assertSameOrigin(new Request("https://club.example/api/contact", {
    headers: { origin: "https://attacker.example" },
  })),
  (error) => error instanceof PublicAPIError && error.code === "invalid_origin",
);

console.log("Verified public form validation and same-origin boundaries.");
