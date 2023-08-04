import {forwardRef, useEffect, useRef} from 'react';

export default forwardRef(function FileUpload({type = 'file', label="Click to upload image", subLabel="SVG, PNG, JPG (MAX. 800x400px)", isFocused = false, id="dropzone-file", ...props}, ref) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, [input, isFocused]);

    return (
        <>
            <div className="flex items-center justify-center w-full mt-1">
                <label htmlFor={id}
                       className="flex flex-col items-center justify-center border-01xl border-c3 border-dashed rounded-full cursor-pointer bg-blue-900 dark:hover:bg-orange-700 dark:bg-blue-900 hover:bg-orange-700 text-white">
                    <div className="flex flex-col items-center justify-center py-4 px-6">
                        <p className="text-sm text-white dark:text-white"><span
                            className="font-semibold">{label}</span></p>

                    </div>
                    <input id={id} type="file" className="hidden" {...props} multiple/>
                </label>

            </div>
            <div className="flex items-center justify-center w-full mt-1">
            <p className="text-xs font-semibold text-orange-500">{subLabel}</p>
            </div>
        </>



    );
});