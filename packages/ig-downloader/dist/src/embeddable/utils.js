export async function downloadFile(videoUrl, filename) {
    try {
        const response = await fetch(videoUrl);
        if (!response.ok) {
            throw new Error("Failed to fetch the video for download.");
        }
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
    }
    catch (error) {
        console.error("Error during file download:", error);
    }
}
