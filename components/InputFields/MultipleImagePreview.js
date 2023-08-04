import Image from 'next/image'
export default function ImagePreview({previewUrl, className = '', ...props}) {

    console.log("previewUrl")
    console.log(previewUrl)
    return previewUrl ? (
        <div className="flex items-center justify-center  w-full p-4">
            <div className="flex flex-col items-center justify-center rounded-full md:w-40 md:h-40 bg-gray-300">
                <div className="grid grid-cols-12 gap-2 my-2">
                {previewUrl.map((image) => {
                    const reader = new FileReader();
                    let src = "";
                    reader.onload = () => {
                        src = reader.result
                    };
                    reader.readAsDataURL(image);

                    return (
                        <div className="relative aspect-video col-span-4" key={image.name}>
                            <Image src={src} alt="Preview"  width={250} height={250}
                                   className="shadow-lg rounded-full md:w-40 md:h-40 align-middle "/>
                        </div>
                    );
                })}
                <Image src={previewUrl} alt="Preview"  width={250} height={250}
                     className="shadow-lg rounded-full md:w-40 md:h-40 align-middle "/>
                </div>
            </div>
        </div>

    ) : <div className="flex items-center justify-center  w-full p-4">
        <div className="flex flex-col items-center justify-center rounded-full md:w-40 md:h-40 bg-gray-300">
            Preview Image
        </div>
    </div>
        ;
}