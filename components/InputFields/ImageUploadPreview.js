import Image from 'next/image'
export default function ImagePreview({previewUrl, className = '', ...props}) {
    return previewUrl ? (
        <div className="flex items-center justify-center w-full">
            <div className="flex flex-col  rounded-full md:w-40 md:h-40 bg-gray-300">
                <Image src={previewUrl} alt="Preview"
                       className="shadow-lg rounded-full rounded-full md:w-40 md:h-40 align-middle "/>
            </div>
        </div>

    ) : <div className="flex items-center justify-center  w-full">
            <div className="flex flex-col rounded-full md:w-40 md:h-40 bg-gray-300">
                Preview Image
            </div>
        </div>
        ;
}