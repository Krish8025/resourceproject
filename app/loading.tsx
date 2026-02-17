import Loader from './components/Loader'

export default function Loading() {
    return (
        <div className="flex min-h-[50vh] w-full flex-1 items-center justify-center bg-zinc-50/50 dark:bg-zinc-950/50 backdrop-blur-sm">
            <Loader />
        </div>
    )
}
