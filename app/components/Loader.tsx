'use client'

interface LoaderProps {
    className?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    text?: string
}

export default function Loader({ className = "", size = 'lg', text = "Loading..." }: LoaderProps) {
    const ringSize = { sm: 40, md: 56, lg: 80, xl: 104 }[size]
    const stroke = 4
    const r = ringSize / 2 - stroke * 2
    const circ = 2 * Math.PI * r
    const dotSize = { sm: 5, md: 6, lg: 8, xl: 10 }[size]

    return (
        <div className={`flex min-h-screen w-full items-center justify-center ${className}`}>
            <div className="flex flex-col items-center gap-5">

                {/* Spinner ring — single colour #1d9bf0 */}
                <svg
                    width={ringSize}
                    height={ringSize}
                    viewBox={`0 0 ${ringSize} ${ringSize}`}
                    className="animate-spin"
                    style={{ animationDuration: '1s', animationTimingFunction: 'linear' }}
                >
                    {/* Faint track */}
                    <circle
                        cx={ringSize / 2} cy={ringSize / 2} r={r}
                        fill="none" stroke="#1d9bf0" strokeWidth={stroke} opacity={0.15}
                    />
                    {/* Active arc */}
                    <circle
                        cx={ringSize / 2} cy={ringSize / 2} r={r}
                        fill="none" stroke="#1d9bf0" strokeWidth={stroke}
                        strokeLinecap="round"
                        strokeDasharray={`${circ * 0.7} ${circ * 0.3}`}
                    />
                </svg>

                {/* Staggered bouncing dots */}
                <div className="flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                        <span
                            key={i}
                            className="block rounded-full bg-[#1d9bf0]"
                            style={{
                                width: dotSize,
                                height: dotSize,
                                animation: `ldBounce 0.9s ease-in-out ${i * 0.15}s infinite`,
                            }}
                        />
                    ))}
                </div>

                {/* Shimmer label */}
                {text && (
                    <p
                        className="text-xs font-semibold tracking-widest uppercase select-none"
                        style={{
                            background: 'linear-gradient(90deg, #536471 0%, #1d9bf0 50%, #536471 100%)',
                            backgroundSize: '200% auto',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            animation: 'ldShimmer 1.8s linear infinite',
                        }}
                    >
                        {text}
                    </p>
                )}
            </div>

            <style>{`
                @keyframes ldBounce {
                    0%, 100% { transform: translateY(0);    opacity: 0.4; }
                    50%       { transform: translateY(-7px); opacity: 1;   }
                }
                @keyframes ldShimmer {
                    0%   { background-position: 200% center; }
                    100% { background-position:   0% center; }
                }
            `}</style>
        </div>
    )
}
