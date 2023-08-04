import React from 'react';

function Toggle({ className, lable = '', ...props }) {
    return (
        <div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" {...props}/>
                    <div
                        class="w-11 h-6 bg-orange-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-700 dark:peer-focus:ring-orange-700  rounded-full peer dark:bg-orange-700  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-lue-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-blue-950 peer-checked:bg-blue-950"></div>
                    <span class="ml-3 text-sm font-medium text-blue-950 dark:text-blue-950">{lable}</span>
            </label>
        </div>
    );
}

export default Toggle;