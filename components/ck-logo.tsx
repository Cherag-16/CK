export function CKLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <div
      className={`${className} flex items-center justify-center bg-primary text-primary-foreground rounded-lg font-bold text-xl`}
    >
      CK
    </div>
  )
}
