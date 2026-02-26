export default function Button({ buttonClass, content, onClick }) {
    return (
        <button className={buttonClass} onClick={onClick}>
            {content}
        </button>
    )
}