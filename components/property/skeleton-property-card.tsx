import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonPropertyCard() {
    return (
        <Card className="overflow-hidden h-full">
            <Skeleton className="aspect-[4/3] w-full" />
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <div className="flex gap-3 mb-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-5 w-24 mt-2" />
                <Skeleton className="h-10 w-full mt-4" />
            </CardContent>
        </Card>
    )
}

export function SkeletonProperty() {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({length: 8}).map((_, index) => (
                <SkeletonPropertyCard key={index}/>
            ))}
        </div>
    )
}