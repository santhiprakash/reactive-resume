// Upload guard for the picture section. Mirrors the 10MB input cap enforced by
// the storage router's file schema (packages/api/src/features/storage/router.ts).
// Exceeding it server-side surfaces as a bare "Input validation failed", which
// is why the guard runs client-side on the final crop artifact (#3305).

export const MAX_PICTURE_UPLOAD_BYTES = 10 * 1024 * 1024;

export function isPictureUploadTooLarge(fileSize: number): boolean {
	return fileSize > MAX_PICTURE_UPLOAD_BYTES;
}

export function formatFileSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;

	const units = ["KB", "MB", "GB"];
	let size = bytes / 1024;
	let unitIndex = 0;

	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024;
		unitIndex += 1;
	}

	return `${size.toFixed(1)} ${units[unitIndex]}`;
}
