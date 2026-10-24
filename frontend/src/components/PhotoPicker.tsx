import { useEffect, useRef, useState } from "react";
import { Button, FileButton, Group, Image, Input } from "@mantine/core";
import { ALLOWED_PHOTO_TYPES } from "../utils/photo";

interface PhotoPickerProps {
    file: File | null;
    error: string | null;
    onSelect: (file: File) => void;
    onRemove: () => void;
}

const PhotoPicker = ({ file, error, onSelect, onRemove }: PhotoPickerProps) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const resetRef = useRef<() => void>(null);

    // Object URLs hold memory until revoked, so create and revoke them together
    useEffect(() => {
        if (!file) {
            setPreviewUrl(null);
            return;
        }
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    const handleChange = (selected: File | null) => {
        resetRef.current?.(); // lets the user pick the same file again later
        if (selected) onSelect(selected);
    };

    return (
        <Input.Wrapper label="Photo" description="Optional. JPEG, PNG or WebP, up to 2 MB." error={error}>
            <Group mt="xs" align="center">
                {previewUrl && <Image src={previewUrl} alt="Photo preview" w={96} h={96} radius="md" fit="cover" />}
                <FileButton resetRef={resetRef} onChange={handleChange} accept={ALLOWED_PHOTO_TYPES.join(",")}>
                    {(props) => (
                        <Button {...props} variant="default">
                            {file ? "Change photo" : "Choose photo"}
                        </Button>
                    )}
                </FileButton>
                {file && (
                    <Button variant="subtle" color="red" onClick={onRemove}>
                        Remove
                    </Button>
                )}
            </Group>
        </Input.Wrapper>
    );
};

export default PhotoPicker;