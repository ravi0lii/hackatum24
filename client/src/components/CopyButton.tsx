import { useState } from 'react';
import {ClipboardDocumentIcon} from "@heroicons/react/16/solid";

export function CopyButton({ valueToCopy }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(valueToCopy);
            setCopied(true);

            // Reset "Copied" message after 2 seconds
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="flex items-start px-4 py-2">
            <button
                onClick={handleCopy}
                className=" text-white"
            >
                {copied ? <ClipboardDocumentIcon className="size-6 text-blue-300"/> :
                    <ClipboardDocumentIcon className="size-6 text-gray-300" />}
            </button>
            <span className="pl-2 text-gray-400">{copied? "Scenario ID copied!" : ""}</span>
        </div>
    );
}

export default CopyButton;
