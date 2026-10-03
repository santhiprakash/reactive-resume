import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@reactive-resume/utils/monorepo.node", () => ({ findWorkspaceRoot: () => undefined }));

afterEach(() => {
	vi.unstubAllEnvs();
	vi.restoreAllMocks();
	vi.resetModules();
});

describe("root resume configuration", () => {
	it.each([
		[undefined, undefined],
		["", undefined],
		["   ", undefined],
		[" root-id ", "root-id"],
	])("normalizes %s to %s", async (value, expected) => {
		vi.stubEnv("APP_URL", "https://resume.example");
		vi.stubEnv("DATABASE_URL", "postgresql://localhost/disposable");
		vi.stubEnv("AUTH_SECRET", "disposable");
		vi.stubEnv("ROOT_RESUME_ID", value);
		const { env } = await import("./server");
		expect(env.ROOT_RESUME_ID).toBe(expected);
	});
});

describe("redis url userinfo", () => {
	it.each([
		"redis://localhost:6379",
		"rediss://localhost:6379/0",
		"redis://:password@localhost:6379",
		"redis://default:password@localhost:6379/0",
		"redis://acl-user:password@localhost:6379",
	])("accepts %s", async (url) => {
		vi.stubEnv("APP_URL", "https://resume.example");
		vi.stubEnv("DATABASE_URL", "postgresql://localhost/disposable");
		vi.stubEnv("AUTH_SECRET", "disposable");
		vi.stubEnv("REDIS_URL", url);
		const { env } = await import("./server");
		expect(env.REDIS_URL).toBe(url);
	});

	it.each([
		"redis://password@localhost:6379", // password in the username slot (no colon in userinfo)
		"redis://user:@localhost:6379", // named user with an explicitly empty password
	])("rejects %s", async (url) => {
		vi.stubEnv("APP_URL", "https://resume.example");
		vi.stubEnv("DATABASE_URL", "postgresql://localhost/disposable");
		vi.stubEnv("AUTH_SECRET", "disposable");
		vi.stubEnv("REDIS_URL", url);
		const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
		await expect(import("./server")).rejects.toThrow("Invalid environment variables");
		expect(consoleError).toHaveBeenCalledWith(
			expect.any(String),
			expect.arrayContaining([
				expect.objectContaining({ message: expect.stringContaining("username but no password") }),
			]),
		);
	});
});
