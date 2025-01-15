import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

const FOLDER_ICONS = [
	"bi-folder",
	"bi-folder-fill",
	"bi-folder-check",
	"bi-folder-plus",
	"bi-folder-symlink",
	"bi-folder-x",
];

const FILE_ICONS = [
	"bi-file-earmark",
	"bi-file-earmark-text",
	"bi-file-earmark-richtext",
	"bi-file-earmark-pdf",
	"bi-file-earmark-word",
	"bi-file-earmark-excel",
	"bi-file-earmark-ppt",
	"bi-file-earmark-image",
	"bi-file-earmark-music",
	"bi-file-earmark-video",
	"bi-file-earmark-zip",
];

interface IconPickerProps {
	onSelect: (iconName: string) => void;
	isFolder: boolean;
	currentIcon?: string;
}

export function IconPicker({
	onSelect,
	isFolder,
	currentIcon,
}: IconPickerProps) {
	const icons = isFolder ? FOLDER_ICONS : FILE_ICONS;

	return (
		<div className="bg-white rounded-lg shadow-lg p-4 w-64">
			<div className="grid grid-cols-4 gap-2">
				{icons.map((iconName) => (
					<button
						key={iconName}
						onClick={() => onSelect(iconName)}
						className={`p-2 rounded hover:bg-gray-100 ${
							currentIcon === iconName ? "bg-blue-100" : ""
						}`}
					>
						<i className={iconName} style={{ fontSize: "1.25rem" }} />
					</button>
				))}
			</div>
		</div>
	);
}
