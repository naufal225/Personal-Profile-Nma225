export default function Container({ children, className = '', as: As = 'div' }) {
  return (
    <As className={`mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-8 ${className}`}>
      {children}
    </As>
  )
}
