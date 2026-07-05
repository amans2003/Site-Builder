// TODO: replace with the real support contact number.
const SUPPORT_PHONE = '+91 7439064694'

export function SupportFooter({ className = '' }) {
  return (
    <p className={`text-xs text-gray-400 text-center ${className}`}>
      Need help? Contact <span className="text-gray-500 font-medium">Aman Singh</span>, Software Developer
      <br />
      {SUPPORT_PHONE}
    </p>
  )
}
