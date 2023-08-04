import AppLayout from "@/components/Layouts/AppLayout";
import React, {useRef, useState} from "react";
import {getSession, useSession} from "next-auth/react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import logoIcon from "@/public/assets/img/logo.jpeg";
import Image from "next/image";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import {GiAchievement} from "react-icons/gi";
const EmptySpace = ({ space }) => <div style={{ height: `${space}rem` }}></div>;
let indianCurrency = Intl.NumberFormat('en-IN');
const pageStyle = {
    backgroundColor: '#ffffff',
    width: '210mm',
    minHeight: '297mm',

};
const Signature = () => (
    <svg
        width="99"
        height="41"
        viewBox="0 0 99 41"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ paddingRight: '2rem' }}
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M58.4347 0.166419C58.4061 0.196534 57.7496 0.249468 56.9759 0.284271C54.6494 0.388577 53.1709 0.551862 51.0885 0.934179C48.3392 1.43904 44.07 2.44375 42.4918 2.95736C41.5815 3.25361 39.9813 3.74659 39.47 3.8883C38.9266 4.03888 38.5036 4.18132 38.0633 4.36201C37.8913 4.43255 36.8832 4.8281 35.8229 5.24095C31.4371 6.94872 29.9678 7.55663 29.154 8.00042C28.8181 8.18361 27.9805 8.60063 25.6632 9.73831C24.6316 10.2448 23.4828 10.8321 23.1103 11.0435C22.7378 11.2549 22.2604 11.5254 22.0496 11.6446C20.7667 12.3698 19.7844 12.9759 19.6717 13.1116C19.6004 13.1976 19.4992 13.268 19.447 13.268C19.3603 13.268 17.5917 14.4195 16.6081 15.1163C16.3847 15.2747 15.8388 15.6621 15.395 15.9773C14.9512 16.2925 14.1259 16.8763 13.561 17.2746C12.2505 18.1986 9.71222 20.2289 8.95175 20.9616C8.62945 21.2721 8.17816 21.6806 7.94891 21.8692C7.20741 22.4796 4.97603 24.7515 3.96194 25.9286C2.42465 27.7131 1.78954 28.7099 1.08711 30.4407C0.348529 32.2608 0.237346 32.7988 0.24339 34.5252C0.249433 36.2575 0.36291 36.8782 0.86756 37.9418C1.06575 38.3596 1.22789 38.7362 1.22789 38.779C1.22789 38.8875 2.25605 39.8679 2.63461 40.1202C3.13958 40.4568 4.21671 40.7484 5.60437 40.9238C6.32378 41.0147 9.42222 41.028 10.2414 40.9435C11.4687 40.817 14.1279 40.2669 14.6178 40.0379C14.7325 39.9845 15.3186 39.78 15.9204 39.5838C17.6948 39.0051 19.2875 38.2826 21.5994 37.0077C22.8005 36.3454 22.6432 36.4466 23.5924 35.7257C25.7896 34.0571 26.5689 33.6265 27.7473 33.4298C27.9765 33.3915 28.422 33.2768 28.7372 33.1749C30.1074 32.7317 31.7958 32.25 33.6347 31.7777C34.4084 31.579 35.7682 31.1775 36.6565 30.8857C39.6399 29.9053 41.8573 29.2107 43.1692 28.8455C43.513 28.7498 44.1226 28.5614 44.5238 28.427C44.925 28.2925 45.4173 28.15 45.6179 28.1103C45.8185 28.0707 46.0998 27.9892 46.2431 27.9294C46.3864 27.8694 46.6912 27.7641 46.9204 27.6951C47.1497 27.6261 47.8061 27.399 48.3792 27.1901C48.9524 26.9814 50.1896 26.5483 51.1286 26.2276C52.0677 25.907 53.1643 25.5093 53.5656 25.3438C53.967 25.1782 54.3361 25.0429 54.3858 25.0429C54.4355 25.0429 55.3083 24.6843 56.3252 24.246C57.3422 23.8078 58.5344 23.295 58.9746 23.1064C60.1815 22.5893 64.2159 20.5826 65.1037 20.0578C65.5335 19.8038 66.1665 19.4536 66.5104 19.2798C67.1327 18.9651 68.3552 18.1079 68.8587 17.6332C69.8606 16.6885 70.4689 16.4187 71.1666 16.6097C71.5886 16.7253 72.7566 16.7555 73.7003 16.6752C74.4194 16.6142 76.1807 16.2758 76.6681 16.1051C76.9754 15.9975 77.5632 15.935 78.3874 15.9223C79.7866 15.9006 80.2745 15.7932 82.9222 14.9238C84.4202 14.4319 86.093 13.7073 87.0023 13.1564C87.5686 12.8133 87.7155 12.9243 87.7155 13.6956C87.7155 15.3338 88.3364 16.2143 90.1121 17.0941L90.6852 17.3781L93.9676 17.4558C97.4873 17.5392 97.854 17.519 97.8018 17.2442C97.7505 16.9745 96.64 16.8204 93.4987 16.6471C91.7096 16.5484 90.261 16.0765 89.4598 15.3314C89.1822 15.0733 88.925 14.1532 89.0195 13.7563C89.0494 13.6311 89.0927 13.3879 89.1158 13.2159C89.2504 12.2167 90.105 10.8113 91.623 9.09277C93.1395 7.37594 93.3254 7.08845 93.4196 6.31464C93.5151 5.52917 92.9157 5.05391 92.2932 5.42164C91.881 5.66505 91.1081 6.65747 90.1005 8.23655C89.5965 9.0266 89.0763 9.82239 88.9447 10.0049C88.8131 10.1873 88.5502 10.5859 88.3606 10.8906C88.1516 11.2263 87.7805 11.6127 87.4184 11.8715C86.7619 12.3406 84.9394 13.253 84.1205 13.5225C80.7232 14.6402 80.07 14.8311 79.6424 14.8311C79.0255 14.8311 78.9809 14.7043 79.2755 13.7877C79.6803 12.5292 79.3744 11.0989 78.6132 10.6893C78.0078 10.3634 76.1602 10.5383 75.5238 10.9815C75.3806 11.0814 75.0122 11.1895 74.7053 11.222L74.1473 11.281L74.2132 10.9304C74.2494 10.7375 74.3547 10.4279 74.4472 10.2423C74.5878 9.96057 74.6058 9.66265 74.5566 8.43443C74.4959 6.91683 74.3981 6.45688 74.023 5.92399C73.9029 5.75321 73.7576 5.53824 73.7003 5.44633C73.096 4.47642 72.747 4.08295 72.0018 3.53152C71.2014 2.93934 70.9458 2.77782 69.5322 1.97036C68.4481 1.35119 65.9627 0.648041 63.9574 0.393267C62.7435 0.238944 58.5305 0.0659686 58.4347 0.166419ZM63.2801 1.38152C65.1148 1.56741 66.3636 1.80645 66.9793 2.08978C67.2945 2.23483 67.8572 2.46147 68.2297 2.59359C69.1265 2.91141 69.6732 3.21151 70.7508 3.9774C72.7849 5.42299 73.3356 6.41583 73.3356 8.63689C73.3356 9.78457 72.9472 11.3486 72.4702 12.1218C72.1114 12.7034 70.686 14.4336 70.2514 14.815C69.7523 15.2532 69.459 15.2967 68.244 15.113C66.7995 14.8947 64.4756 14.8846 63.6662 15.0933C62.9635 15.2743 62.4668 15.2304 62.16 14.9597C61.7859 14.6296 61.9408 14.4337 63.3044 13.5131C64.655 12.6014 67.4419 9.80635 68.1724 8.63105C68.2793 8.45912 68.4297 8.28094 68.5066 8.23509C68.5836 8.18924 68.6465 8.08952 68.6465 8.01345C68.6465 7.93728 68.7123 7.82047 68.7927 7.75367C69.0026 7.57955 69.4801 6.56775 69.4801 6.29745C69.4801 5.98391 69.028 5.5571 68.6959 5.5571C68.3675 5.5571 67.629 5.97338 67.3134 6.33632C67.1877 6.48085 67.0097 6.59912 66.9179 6.59912C66.8261 6.59912 66.603 6.70259 66.4222 6.82909C65.7727 7.28352 64.1042 8.77506 63.6447 9.31191C63.3868 9.61326 62.9884 10.069 62.7591 10.3249C62.5299 10.5807 62.2087 10.9841 62.0455 11.2214C61.6805 11.7522 60.9356 13.3359 60.9356 13.5812C60.9356 13.9348 60.5028 14.2986 59.4509 14.829C58.1977 15.4609 58.0493 15.4594 57.2676 14.8067C56.042 13.7834 55.964 13.5135 56.7154 12.8977C57.2177 12.4862 57.2986 12.2125 57.0119 11.8956C56.6241 11.4671 55.8254 11.8354 55.419 12.6299C55.2041 13.0503 54.4034 13.9975 54.263 13.9975C54.1489 13.9975 53.3244 14.5472 52.6709 15.0591C52.0982 15.5077 50.5493 16.2707 49.4734 16.6343C46.9329 17.4927 44.4054 17.7415 42.8837 17.2829C42.6121 17.2011 42.066 16.9417 41.6701 16.7065C40.7066 16.1341 40.5877 15.6756 41.3625 15.5207C41.5412 15.4849 42.2552 15.1779 42.9493 14.8384C43.6433 14.4988 44.8543 13.9618 45.6404 13.645C46.4265 13.3283 47.1768 13.001 47.3076 12.9177C47.4385 12.8345 47.8739 12.6626 48.2751 12.5359C48.6762 12.4092 49.2389 12.2243 49.5255 12.1247C49.862 12.0079 50.2677 11.956 50.6717 11.9779C51.0156 11.9966 51.6017 12.0287 51.9742 12.0493C52.6603 12.0872 52.739 12.0636 53.902 11.4686C54.0739 11.3806 54.3864 11.2364 54.5965 11.1481C54.8064 11.0598 55.0075 10.8952 55.0434 10.7824C55.0791 10.6697 55.2238 10.5018 55.3648 10.4094C55.845 10.0948 55.5785 9.47645 54.9143 9.36422C54.6166 9.314 54.1463 9.40402 53.0121 9.72861C52.1834 9.96567 51.2005 10.198 50.828 10.2449C50.1825 10.3261 48.654 10.7967 47.9485 11.1316C47.7669 11.2177 47.5844 11.2882 47.5429 11.2882C47.5015 11.2882 47.1803 11.4115 46.8292 11.562C45.9934 11.9206 45.6829 12.0517 44.9927 12.3372C44.6775 12.4676 44.3727 12.6089 44.3154 12.6513C44.2581 12.6937 43.9064 12.8072 43.5339 12.9033C43.1613 12.9995 42.8097 13.1163 42.7523 13.1629C42.467 13.3945 40.3665 14.0257 40.2543 13.9135C39.9851 13.6442 40.6631 12.7197 41.5455 12.1529C41.8654 11.9474 42.3733 11.6214 42.6742 11.4285C43.2639 11.0503 43.3084 10.9286 43.1132 10.2262C43.0423 9.97078 42.9287 9.81906 42.7752 9.77498C42.6479 9.73851 42.4662 9.68714 42.3711 9.66078C42.017 9.56283 40.533 11.1092 39.0532 13.1179C38.8526 13.3902 38.4954 13.8167 38.2594 14.0657C37.8634 14.4835 37.7895 14.5185 37.304 14.5185C37.0126 14.5185 36.5649 14.6098 36.3001 14.7233C36.0373 14.836 35.5911 14.9588 35.3086 14.9963C34.7329 15.0727 34.1188 15.3961 34.1817 15.5897C34.2046 15.6596 34.3491 15.7782 34.503 15.8532C34.7489 15.973 34.8894 15.9549 35.6615 15.7034C36.3961 15.4642 36.5839 15.4372 36.8068 15.5387C37.4458 15.8299 36.7975 16.8092 35.5448 17.4451C35.1603 17.6402 34.6674 17.929 34.4495 18.0869C34.2316 18.2447 34.0257 18.3739 33.9919 18.3739C33.9581 18.3739 33.667 18.5489 33.3449 18.7626C33.0228 18.9764 32.5255 19.2598 32.2396 19.3921C31.9538 19.5245 31.4943 19.795 31.2182 19.9933C30.9423 20.1915 30.6944 20.3538 30.6673 20.3538C30.6402 20.3538 30.1211 20.6937 29.5137 21.1092C28.9063 21.5248 28.2604 21.9562 28.0783 22.068C27.8963 22.1799 27.3253 22.5741 26.8095 22.9441C26.2937 23.3141 25.6372 23.7815 25.3506 23.9827C22.2764 26.141 19.2284 28.9566 18.3902 30.4123C17.9895 31.1082 17.8104 31.3099 17.3257 31.6106C15.7805 32.5695 15.6816 32.7101 15.5692 34.1084C15.4885 35.1115 15.557 35.2859 16.1834 35.673C16.5174 35.8795 16.6328 35.8932 17.4598 35.8244C17.9599 35.7828 18.6112 35.737 18.907 35.7224C19.2028 35.7078 19.5881 35.6245 19.7631 35.5371C20.2396 35.2995 20.9009 35.2115 21.082 35.3619C21.5086 35.7159 21.1001 36.2375 20.1926 36.4973C19.9347 36.5711 19.5596 36.7142 19.359 36.8153C18.6738 37.1606 17.2234 37.8684 16.8582 38.0358C16.6576 38.1278 16.4023 38.2491 16.2908 38.3054C15.9928 38.456 13.5902 39.2106 12.7207 39.4267C12.3077 39.5292 11.9326 39.6359 11.8871 39.6637C11.4904 39.9064 7.31641 40.1111 6.17748 39.9437C5.83361 39.8933 5.18194 39.7977 4.72928 39.7315C4.27663 39.6652 3.71394 39.5434 3.47886 39.4607C2.98109 39.2856 2.02556 38.3871 1.84153 37.9209C1.77172 37.7439 1.64293 37.5151 1.55529 37.4124C1.23914 37.0417 1.13723 36.4763 1.13098 35.0563C1.12546 33.8079 1.16047 33.5076 1.42566 32.5296C1.7837 31.2096 2.8625 28.9122 3.5468 28.0126C4.15159 27.2177 5.63688 25.7991 6.21979 25.4597C6.67973 25.192 6.91856 24.9615 7.94756 23.7924C9.9251 21.5459 11.7991 20.004 17.0025 16.342C20.336 13.996 20.7129 13.7547 22.9019 12.5656C23.2744 12.3633 23.7027 12.111 23.8536 12.0051C24.1379 11.8054 27.1112 10.3031 28.8414 9.48489C31.0421 8.44422 31.4135 8.26385 31.8632 8.01751C32.5018 7.6676 33.8656 7.07792 34.6246 6.82357C34.9685 6.70832 35.5077 6.5143 35.8229 6.39228C36.1381 6.27036 36.6539 6.08478 36.9691 5.97995C37.2844 5.87512 37.8939 5.6439 38.3238 5.46613C39.9761 4.78288 42.8078 3.90331 44.5759 3.52412C45.0057 3.4319 45.545 3.31238 45.7742 3.25851C47.1625 2.93225 48.542 2.60141 49.6818 2.32142C50.3982 2.14542 51.336 1.95661 51.7658 1.90169C52.1956 1.84688 52.8521 1.75883 53.2246 1.70611C54.4341 1.5349 56.8016 1.3066 57.5466 1.2892C57.9464 1.27992 58.2877 1.25814 58.305 1.24085C58.3793 1.16655 62.2342 1.27554 63.2801 1.38152ZM66.6107 8.70921C66.4409 9.27836 65.5613 10.3348 64.8952 10.7695C64.6374 10.9378 64.3262 11.1489 64.2039 11.2387C63.9903 11.3954 63.982 11.3902 63.9981 11.1106C64.0181 10.7609 64.8985 9.59628 65.3576 9.31212C65.5332 9.20344 65.8145 8.97065 65.9828 8.79465C66.3563 8.40431 66.7164 8.35534 66.6107 8.70921ZM78.1236 12.0832C78.456 12.2796 78.5795 12.6963 78.5621 13.564C78.5439 14.4622 77.848 14.7172 77.2365 14.0496C76.7596 13.5289 76.5162 13.5677 75.8331 14.2738C75.1804 14.9484 74.5176 15.2952 74.0689 15.1966C73.8572 15.1501 73.6171 15.2088 73.2438 15.3978C72.5761 15.7363 72.2435 15.7399 72.0281 15.4112C71.8911 15.2019 71.8845 15.1154 71.9908 14.9162C72.1916 14.5398 74.0176 12.8188 74.4545 12.5942C74.6701 12.4833 74.9333 12.3201 75.0394 12.2315C75.2344 12.0688 75.8285 11.9826 77.1135 11.9307C77.634 11.9098 77.8972 11.9495 78.1236 12.0832ZM55.6341 14.8057C56.1292 15.1346 56.7958 15.847 56.7214 15.9675C56.6216 16.1291 55.9497 16.4035 55.5582 16.4426C55.3804 16.4603 55.1459 16.5223 55.0372 16.5804C54.9287 16.6386 54.6185 16.7193 54.3481 16.7598C54.0777 16.8004 53.8049 16.8958 53.7418 16.9718C53.6786 17.0479 53.4779 17.1396 53.2956 17.1754C53.1133 17.2114 52.8469 17.2793 52.7036 17.3264C52.5604 17.3734 52.2438 17.4643 52.0003 17.5282C51.7567 17.5922 51.372 17.6982 51.1454 17.7638C50.7967 17.8648 50.6914 17.8556 50.4611 17.7048C50.2415 17.561 50.2128 17.4975 50.3128 17.377C50.381 17.2949 50.513 17.2269 50.6063 17.2257C50.6996 17.2247 51.0981 17.0606 51.4918 16.861C51.8855 16.6616 52.2658 16.4983 52.3368 16.4983C52.4078 16.4983 52.6717 16.3173 52.9234 16.0961C54.5425 14.673 55.0621 14.4256 55.6341 14.8057ZM61.5254 15.7689C62.0397 16.0434 62.2142 16.0812 62.9562 16.079C63.4209 16.0776 63.9887 16.0316 64.2179 15.9767C64.9837 15.7931 67.1119 15.731 67.8521 15.8707C68.46 15.9853 68.5423 16.0289 68.5423 16.2355C68.5423 16.587 68.2039 16.9515 67.4217 17.4423C67.0351 17.6848 66.5547 18.0104 66.3541 18.1657C65.7613 18.6246 60.3415 21.3352 58.8515 21.9178C58.5363 22.0411 58.1143 22.2315 57.9137 22.3408C57.5497 22.5393 56.3436 23.0553 55.5855 23.3368C55.3653 23.4186 54.9918 23.584 54.7556 23.7046C54.5193 23.8251 53.9259 24.0622 53.4367 24.2315C52.9476 24.4008 52.1722 24.6935 51.7137 24.882C51.2552 25.0704 50.7629 25.2592 50.6196 25.3016C50.4763 25.344 50.2184 25.4364 50.0465 25.5072C48.7464 26.0416 46.9977 26.6281 43.3776 27.7437C42.8045 27.9202 41.5618 28.3034 40.6162 28.5953C39.6706 28.8872 38.7258 29.1677 38.5166 29.2186C38.3075 29.2697 37.7448 29.4493 37.2662 29.6178C35.7399 30.1553 33.4035 30.874 32.1188 31.2013C30.4124 31.636 30.326 31.6618 29.675 31.9291C29.3598 32.0586 28.8674 32.1681 28.5809 32.1726C28.1312 32.1795 28.0557 32.1513 28.0292 31.9661C28.0107 31.8369 28.1557 31.5676 28.394 31.2887C28.9799 30.6028 29.4666 29.9626 29.4666 29.8779C29.4666 29.8369 29.6659 29.5451 29.9095 29.2297C30.7985 28.0781 31.9815 26.296 33.2767 24.1571C34.0056 22.9536 34.7594 21.7516 34.9519 21.486C35.1445 21.2204 35.3019 20.9741 35.3019 20.9386C35.3019 20.8642 36.2237 19.4543 36.8842 18.5185C37.1315 18.1681 37.4511 17.8057 37.5944 17.7132C37.7376 17.6206 38.1362 17.3325 38.4801 17.073C39.2883 16.4629 39.5359 16.483 40.7228 17.2553C42.5564 18.4483 43.7659 18.7054 45.6869 18.3101C46.8905 18.0624 47.1652 18.0632 47.4801 18.3154C48.078 18.7943 48.4758 18.8873 50.5938 19.0437C55.0375 19.3717 57.8094 18.7966 58.7696 17.3473C58.8679 17.1991 58.9258 16.9825 58.8985 16.8662C58.8711 16.7498 58.886 16.5209 58.9317 16.3576C59.002 16.1054 59.1208 16.0248 59.7189 15.8235C60.1063 15.6931 60.4526 15.5571 60.4884 15.5213C60.6234 15.3864 60.9583 15.4663 61.5254 15.7689ZM34.2997 20.086C34.2922 20.3186 34.2007 20.5597 34.0652 20.7039C33.943 20.8339 33.8431 20.9721 33.8431 21.011C33.8431 21.0498 33.5546 21.5392 33.202 22.0983C32.8494 22.6576 32.3453 23.4571 32.0819 23.875C30.7567 25.9767 29.3786 27.9938 27.9875 29.8672C27.5854 30.4086 26.3593 31.7778 25.5791 32.5565C25.2024 32.9326 24.43 33.2865 23.3187 33.592C22.8315 33.726 22.3857 33.8699 22.3278 33.9118C22.1536 34.0382 18.9373 34.7719 17.687 34.9705C17.0925 35.0649 16.9686 35.0551 16.7231 34.8942C16.3756 34.6666 16.3731 34.5699 16.7019 34.086C16.8451 33.8752 16.9624 33.6335 16.9624 33.5489C16.9624 33.4642 17.0729 33.2624 17.2081 33.1005C17.5375 32.7057 18.0044 31.8114 18.0044 31.5755C18.0044 31.2397 18.195 31.0121 18.9148 30.4881C19.3024 30.2061 19.84 29.7915 20.1095 29.567C20.3791 29.3425 20.8457 28.9721 21.1466 28.7438C21.4475 28.5155 22.2118 27.8823 22.8449 27.3365C23.478 26.7909 24.6525 25.8796 25.4548 25.3114C26.2572 24.7432 27.2184 24.0338 27.591 23.735C27.9635 23.4364 28.5591 23.0105 28.9145 22.7889C29.2701 22.5671 30.3017 21.8902 31.207 21.2846C33.8843 19.4936 33.8335 19.5231 34.0858 19.6188C34.2648 19.6868 34.3094 19.7841 34.2997 20.086ZM97.1368 20.8847C96.9417 21.1003 96.9429 21.106 97.2307 21.3536C97.5845 21.658 97.8711 21.6694 98.318 21.3969C98.7365 21.1417 98.7426 21.0288 98.3493 20.8254C97.9059 20.5961 97.3745 20.6221 97.1368 20.8847Z"
            fill="#3381FF"
        />
    </svg>
);
const Header = ({name, address, phone_number, email, image}) => (
    <div
        style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '3rem 2rem 2rem 2rem',
        }}
    >
        <div>
            <p style={{ fontWeight: '600' }}>{name}</p>
            <p style={{ color: '#333333' }}>{address}</p>
            <p style={{ color: '#333333' }}>{phone_number}</p>
            <p style={{ color: '#333333' }}>{email}</p>
        </div>
        <Image className="rounded-full mr-3"
               src={image}
               width={120}
               height={120}
               alt="Picture of the author"
        />

    </div>
);
const InvoiceTitle = () => (
    <div
        style={{
            padding: '1rem 2rem 1rem 2rem',textAlign: 'center',
        }}
    >
        <div>
            <h1 style={{ fontSize: '1.25rem' }}>ESTIMATE</h1>
        </div>

    </div>
);
const SubTitle = () => (
    <div
        style={{
            display: 'flex',
            padding: '0rem 0rem 1rem 2rem',
        }}
    >
        <div>
            <h2 style={{ fontSize: '1rem',fontWeight:'600' }}>SUMMARY</h2>
        </div>

    </div>
);
const BillDetails = ({customer_name,address,estimate_no,estimate_date,ref_no}) => (
    <div
        style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingInline: '2rem',
            paddingTop:"2rem",
            paddingBottom:"2rem",
        }}
    >
        <div>
            <p style={{ paddingBottom: '0.2rem', color: '#333333' }}>
                <span style={{ paddingRight: '1rem'}}>Bill To:</span>
                <span style={{ fontWeight: '600' }}>{customer_name}</span>
            </p>
            <p style={{ paddingBottom: '0.2rem', color: '#333333' }}>
                <span style={{ paddingLeft: '4rem', fontWeight: '600', fontSize:'0.8 rem'}}>{address}</span>
            </p>
        </div>
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <p style={{ paddingBottom: '0.2rem', color: '#333333' }}>
                <span>Estimate No:</span>{' '}
                <span style={{ fontWeight: '600' }}>{estimate_no}</span>
            </p>
            <p style={{ paddingBottom: '0.2rem', color: '#333333' }}>
                <span>Estimate Date:</span>
                <span style={{ fontWeight: '600' }}>{estimate_date}</span>
            </p>
            <p style={{ paddingBottom: '0.2rem', color: '#333333' }}>
                <span>Reference No:</span>{' '}
                <span style={{ fontWeight: '600' }}>{ref_no}</span>
            </p>
        </div>
    </div>


);
const lineItemsData = [
    {
        description: 'Software subscription charges for the period 1',
        qty: 2,
        rate: 100.00,
        amount: 200.00,
    },{
        description: 'Software subscription charges for the period 2',
        qty: 2,
        rate: 100.00,
        amount: 200.00,
    },{
        description: 'Software subscription charges for the period 3',
        qty: 2,
        rate: 100.00,
        amount: 200.00,
    },{
        description: 'Software subscription charges for the period 4',
        qty: 2,
        rate: 100.00,
        amount: 200.00,
    },{
        description: 'Software subscription charges for the period 5',
        qty: 2,
        rate: 100.00,
        amount: 200.00,
    },{
        description: 'Software subscription charges for the period 6',
        qty: 2,
        rate: 100.00,
        amount: 200.00,
    },{
        description: 'Software subscription charges for the period 7',
        qty: 2,
        rate: 100.00,
        amount: 200.00,
    },

];
const Item = ({ description, qty, rate, amount, currency_symbol }) => (
    <div
        style={{
            paddingInline: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '2rem 2rem 0rem 2rem',
        }}
    >
        <div>
            <p style={{ width : '50%', fontWeight: '600', color: '#333333' }}>{` ${description} -`}</p>
        </div>
        <div>
            <p style={{ width : '10%',fontWeight: '600', color: '#333333' }}>{` ${qty}`}</p>
        </div>
        <div>
            <p style={{ fontWeight: '600', color: '#333333' }}>{`${currency_symbol} ${rate} `}</p>
        </div>
        <div>
            <p style={{ fontWeight: '600', color: '#333333' }}>{`${currency_symbol} ${amount} `}</p>
        </div>

    </div>
);
const CumSum = ({totals,currency_symbol}) => (
    <>
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                padding: '2rem 2rem 2rem 2rem',
            }}
        >
            <div style={{ textAlign: 'right', paddingRight: '4rem' }}>
                <p style={{ fontWeight: '600', color: '#333333' }}>
                    Gross Amount
                </p>
                <p style={{ fontWeight: '600', color: '#333333',paddingRight: '2.5rem' }}>
                    Discount
                </p>
                <p style={{ fontWeight: '600', color: '#333333',paddingRight: '2.5625rem' }}>
                    SubTotal
                </p>
                <p style={{ fontWeight: '600', color: '#333333',paddingRight: '1.7rem' }}>
                    VAT 5.00%
                </p><p style={{ fontWeight: '600', color: '#333333',paddingRight: '2.42rem' }}>
                    Shipping
                </p>
            </div>
            <div>
                {totals.map((item, index) => (
                    <Item
                        key={index}
                        description={item.description}
                        qty={item.quantity}
                        rate={item.price}
                        amount={item.total}
                        currency_symbol={details.estimate.currency_symbol}
                    />
                ))}
                {totals.map((item, index) => (
                        // if(item.code === "gross_amount"){
                        //
                        //     <p style={{ fontWeight: '600', color: '#333333' }}>
                        //         {`${currency_symbol} ${item.value} `}
                        //     </p>
                        // }else if(item.code === "discount"){
                        //     <p style={{ fontWeight: '600', color: '#333333' }}>
                        //         {`${currency_symbol} ${item.value}} `}
                        //     </p>
                        // }else if(item.code === "sub_total"){
                        //      <p style={{ fontWeight: '600', color: '#333333' }}>
                        //         {`${currency_symbol} ${item.value}} `}
                        //     </p>
                        // }else if(item.code === "tax"){
                        //     <p style={{ fontWeight: '600', color: '#333333' }}>
                        //         {`${currency_symbol} ${item.value}} `}
                        //     </p>
                        // }else if(item.code === "total"){
                        //      <p style={{ fontWeight: '600', color: '#333333' }}>
                        //         {`${currency_symbol} ${item.value}} `}
                        //     </p>
                        // }
            ))
                }



            </div>
        </div>
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                padding: '0rem 2rem 2rem 1rem',
                borderBottom: '1px solid #EBEBEB',
            }}
        >
            <p
                style={{
                    fontWeight: '600',
                    color: '#333333',
                    textAlign: 'right',
                    paddingRight: '4.3rem',
                    backgroundColor:'#51b6f9',
                }}
            >
                Net Amount
            </p>

            <p style={{ fontWeight: '600', color: '#333333',backgroundColor:'#51b6f9', }}>
                {`₹ ${indianCurrency.format(11887.6)} `}
            </p>
        </div>
    </>
);
const Notes = () => (
    <div
        style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingInline: '2rem',
            paddingBottom:"5rem"
        }}
    >
        <div>
            <p
                style={{
                    paddingBottom: '0.4rem',
                    fontWeight: '600',
                    fontSize: '1rem',
                }}
            >
                Notes:
            </p>
            <p style={{ paddingBottom: '0.2rem', color: '#333333' }}>
                template 2
            </p>
        </div>
    </div>
);
const Achievements = () => (
    <div
        style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingInline: '2rem',
            paddingBottom:"5rem"
        }}
    >
        <div>
            <p
                style={{
                    paddingBottom: '0.4rem',
                    fontWeight: '600',
                    fontSize: '1rem',
                }}
            >
                Achievements
            </p>
            <p
                style={{
                    padding:'2rem 19rem'
                }}
            >
                <Image className="rounded-full mr-3"
                       src={logoIcon}
                       width={120}
                       height={120}
                       alt="Picture of the author"
                />
            </p><p
                style={{
                    padding:'2rem 19rem'
                }}
            >
                <Image className="rounded-full mr-3"
                       src={logoIcon}
                       width={120}
                       height={120}
                       alt="Picture of the author"
                />
            </p><p
                style={{
                    padding:'2rem 19rem'
                }}
            >
                <Image className="rounded-full mr-3"
                       src={logoIcon}
                       width={120}
                       height={120}
                       alt="Picture of the author"
                />
            </p>
        </div>
    </div>
);
const Footer = () => (
    <div
        style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingInline: '2rem',
            paddingBottom:"5rem"
        }}
    >
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
            }}
        >
            <Signature />
            <p style={{ fontWeight: '600', textAlign: 'right' }}>
                Authorized Signatory
            </p>
        </div>
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
            }}
        >
            <Signature />
            <p style={{ fontWeight: '600', textAlign: 'right' }}>
                Authorized Signatory
            </p>
        </div>
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
            }}
        >
            <Signature />
            <p style={{ fontWeight: '600', textAlign: 'right' }}>
                Authorized Signatory
            </p>
        </div>
    </div>
);
const printDocument = async () => {
    const input = document.getElementById('invoicePageOne'); // ID of the content container
    const pdf = new jsPDF();
    var margin = {top: 10, right: 20, bottom: 10, left: 20};
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const pdfData = await html2canvas(input, { scale: 1, top: 10, right: 20, bottom: 10, left: 20});
    const pdfImage = pdfData.toDataURL('image/jpeg', 1.0);
    let contentHeight = (pdfData.height *  0.2645833333);
    let currentPage = 0;
    let totalPage = contentHeight / pdfHeight;
    console.log("totalPage")
    console.log(totalPage)
    // pdf.addImage(pdfImage, 'JPEG', 0, 0);
    for (let i = 0; i < totalPage; i++) {
        let position = pdfHeight *  i;
        console.log("position")
        console.log(position)
        console.log("contentHeight")
        console.log(contentHeight)

        const pageImage = pdfData.toDataURL('image/jpeg', 0.8);
        if (i === 0){

            pdf.addImage(pageImage, 'JPEG', 0, 0);
        }else{
            pdf.addPage();
            pdf.addImage(pageImage, 'JPEG', 0, -position);
        }

        contentHeight -= pdfHeight;
        currentPage++;
    }
    // while (contentHeight > pdfHeight) {
    //     pdf.addPage();
    //     position =(contentHeight - parseFloat(pdfHeight * currentPage).toFixed(2))
    //     console.log("position")
    //     console.log(position)
    //     const pageImage = pdfData.toDataURL('image/jpeg', 1.0);
    //     pdf.addImage(pageImage, 'JPEG', 0, position);
    //     contentHeight -= pdfHeight;
    //     currentPage++;
    // }

    // Save or open the PDF
    pdf.save('invoice.pdf');
};
export default function Template_1(details) {
    console.log(details)
    const {data: session} = useSession()
    return (
        <AppLayout session={session}>
            <div className="bg-white">
                <div className="p-5">
                    <PrimaryButton
                        className="w-full"
                        type="button" onClick={printDocument}
                    >
                        Print estimate
                    </PrimaryButton>
                    {/*<button onClick={printDocument}>Print</button>*/}
                </div>
                <div className="invoicePages" id="invoicePageOne" style={pageStyle}>
                    <Header name ={details.estimate.company.name}
                            address ={details.estimate.company.address}
                            phone_number ={details.estimate.company.phone_number}
                            email ={details.estimate.company.email}
                            image ={details.company_image_path+details.estimate.company.logo}/>
                    <InvoiceTitle/>
                    <BillDetails customer_name={details.estimate.customer.customer_name} address={details.estimate.customer.address} estimate_no ={details.estimate.estimate_no} estimate_date={details.estimate.estimate_date} ref_no={details.estimate.ref_no}/>
                    <SubTitle/>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            padding: '1rem 2rem',
                            borderBottom: '1px solid #EBEBEB',
                            backgroundColor:`${details.estimate.company.color}`,
                        }}
                    >
                        <p style={{ width : '50%', fontWeight: '600' }}>Description</p>
                        <p style={{ fontWeight: '600' }}>Quantity</p>
                        <p style={{ fontWeight: '600' }}>Rate</p>
                        <p style={{ fontWeight: '600' }}>Amount</p>
                    </div>
                    {details.estimate.products.map((item, index) => (
                        <Item
                            key={index}
                            description={item.description}
                            qty={item.quantity}
                            rate={item.price}
                            amount={item.total}
                            currency_symbol={details.estimate.currency_symbol}
                        />
                    ))}
                    <CumSum totals={details.estimate.totals} currency_symbol={details.estimate.currency_symbol}/>
                    <EmptySpace space={2} />
                    <Footer />
                    <Notes />
                    <EmptySpace space={4} />
                    <Achievements />
                </div>
            </div>


        </AppLayout>
    )
}
export async function getServerSideProps(context) {
    const session = await getSession(context)

    if (!session) {
        return {redirect: {destination: '/', permanent: false,}}
    }

    const sentFormData = new FormData();
    sentFormData.append("estimate_id", context.params.estimate_id)
    const details = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}estimate/detail`, {
        method: 'POST',
        body: sentFormData,
        headers: {"Access-Token": session.user.access_token}
    })
        .then((res) => {
            return res.json()
        })
        .then()
        .catch((error) => {
            console.log(error)
        });

    return {props: details && details.status ? details.data: {}};
}