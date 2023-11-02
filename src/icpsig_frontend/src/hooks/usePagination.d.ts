/// <reference types="react" />
export declare const usePagination: () => {
    currentPage: number;
    setPage: import("react").Dispatch<import("react").SetStateAction<number>>;
    setTotalDocs: import("react").Dispatch<import("react").SetStateAction<number | undefined>>;
    totalDocs: number | undefined;
};
