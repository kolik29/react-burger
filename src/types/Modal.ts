export interface iModal {
    isOpen: boolean,
    onClose: () => void,
    children: React.ReactNode
}