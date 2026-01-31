import { useFileUpload } from "@/hooks/useFileUpload";
import DropzoneIdle from "./DropzoneIdle";
import DropzoneUpload from "./Dropzoneupload";
import DropzoneSuccess from "./Dropzonesuccess";
import DropzoneError from "./Dropzoneerror";

export function FileDropzone() {
    const { state, progress, error, result, setState, processFile, reset } =
        useFileUpload();

    if (state === "success" && result) {
        return <DropzoneSuccess handleReset={reset} result={result} />;
    }

    if (state === "error") {
        return <DropzoneError error={error} handleReset={reset} />;
    }

    if (state === "uploading") {
        return <DropzoneUpload progress={progress} handleReset={reset} />;
    }

    return (
        <DropzoneIdle
            state={state}
            setState={setState}
            processFile={processFile}
        />
    );
}
