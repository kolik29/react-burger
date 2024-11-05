export interface IModal {
    isModalOpen: boolean,
    onClose: () => void,
    children?: React.ReactNode
}