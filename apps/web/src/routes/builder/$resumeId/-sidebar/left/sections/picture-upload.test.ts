import { describe, expect, it } from "vitest";
import { formatFileSize, isPictureUploadTooLarge, MAX_PICTURE_UPLOAD_BYTES } from "./picture-upload";

describe("isPictureUploadTooLarge", () => {
	it("accepts files at the storage route's 10MB cap", () => {
		expect(isPictureUploadTooLarge(MAX_PICTURE_UPLOAD_BYTES)).toBe(false);
	});

	it("rejects files one byte over the cap", () => {
		expect(isPictureUploadTooLarge(MAX_PICTURE_UPLOAD_BYTES + 1)).toBe(true);
	});

	it("rejects the oversized PNG reported in #3305", () => {
		expect(isPictureUploadTooLarge(32_635_688)).toBe(true);
	});
});

describe("formatFileSize", () => {
	it("formats bytes, KB, and the 10MB cap", () => {
		expect(formatFileSize(512)).toBe("512 B");
		expect(formatFileSize(2048)).toBe("2.0 KB");
		expect(formatFileSize(MAX_PICTURE_UPLOAD_BYTES)).toBe("10.0 MB");
	});

	it("clamps at GB instead of reporting a made-up unit", () => {
		expect(formatFileSize(5 * 1024 ** 4)).toBe("5120.0 GB");
	});
});
