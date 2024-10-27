export interface iModal {
    isModalOpen: boolean,
    onClose: () => void,
    children?: React.ReactNode
}