import assert from "node:assert/strict";
import { hasAnyRole, type Role } from "../access";

const user = (...roles: Role[]) => ({ roles });

assert.equal(hasAnyRole(user("administrator"), ["administrator"]), true);
assert.equal(hasAnyRole(user("editor"), ["administrator"]), false);
assert.equal(hasAnyRole(user("editor"), ["administrator", "editor"]), true);
assert.equal(hasAnyRole(user("team-editor"), ["administrator", "editor", "team-editor"]), true);
assert.equal(hasAnyRole(user("team-editor"), ["administrator", "editor"]), false);
assert.equal(hasAnyRole(user("sponsor-editor"), ["administrator", "editor", "sponsor-editor"]), true);
assert.equal(hasAnyRole(user("sponsor-editor"), ["administrator", "editor", "team-editor"]), false);
assert.equal(hasAnyRole(undefined, ["administrator"]), false);

console.log("Verified CMS role boundaries for administrator, editor, team editor and sponsor editor.");
