export const Square = ({children, isSelected, updateBoard, i}) => {
    const className = `square ${isSelected ? 'is-selected' : ''}`
    const handleClick = () => {
        updateBoard(i)
    }
    return (
        <div onClick={handleClick} className={className}>
            {children}
        </div>
    ) 
}