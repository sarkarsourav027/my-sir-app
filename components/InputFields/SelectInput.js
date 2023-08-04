import {forwardRef, useEffect, useRef} from 'react';

export default forwardRef(function SelectInput({
                                                   option = [],
                                                   label = "",
                                                   className = '',
                                                   defaultSelectedValue = '',
                                                   required = false,
                                                   isFocused = false,
                                                   ...props
                                               }, ref) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, [input, isFocused]);
    let labelName = label;

    if (required === true){
        labelName = <span>{label} <span className="text-red-600"> *</span></span>
    }


    return (
        <div className="relative h-10 w-full min-w-[200px]">
            <select
                className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-orange-500 focus:border-t-transparent focus:outline-0 disabled:border-2 disabled:border-blue-gray-200" {...props}>
                <option value="">{label}</option>
                {
                    option.map((item) => {
                        if (defaultSelectedValue === item.value){
                            return (
                                <option key={item.value} value={item.value} selected="selected">{item.label}</option>
                            )
                        }else{
                            return (
                                <option key={item.value} value={item.value}>{item.label}</option>
                            )
                        }
                    })
                }
            </select>
            <label
                className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-orange-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-orange-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-orange-500 peer-disabled:before:border-1 peer-disabled:after:border-1 peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                {labelName}
            </label>
        </div>
    );
});